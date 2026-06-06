#!/usr/bin/env bash
# Generate an image via Codex CLI's imagegen tool, reusing the user's
# ChatGPT subscription session. Supports text-to-image and image-to-image.
#
# Implementation note: on codex-cli 0.111.0 the `imagegen` tool does NOT
# write a PNG file to disk. The generated image is embedded as base64 inside
# the session rollout jsonl under ~/.codex/sessions/YYYY/MM/DD/. This script
# captures the new session file created by the run and decodes the image
# out of it. Flags: `--enable image_generation` turns the under-development
# tool on; `--ephemeral` is intentionally NOT passed so the session is
# persisted and we can read it back.
#
# Usage:
#   gen.sh --prompt "<text>" --out <path.png> [--ref <image>]... [--timeout-sec N]
#
# Exit codes:
#   0 success (path printed on stdout)
#   2 bad args
#   3 required CLI missing (codex / python3)
#   4 reference image not found
#   5 codex exec failed
#   6 no new session file detected
#   7 image payload not found in session file (imagegen likely did not run)

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

PROMPT=""
OUT=""
REF_IMAGES=()
TIMEOUT_SEC=300

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prompt)      PROMPT="$2"; shift 2 ;;
    --out)         OUT="$2"; shift 2 ;;
    --ref)         REF_IMAGES+=("$2"); shift 2 ;;
    --timeout-sec) TIMEOUT_SEC="$2"; shift 2 ;;
    -h|--help)     sed -n '2,24p' "$0"; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

[[ -z "$PROMPT" ]] && { echo "Missing --prompt" >&2; exit 2; }
[[ -z "$OUT" ]]    && { echo "Missing --out" >&2; exit 2; }

command -v codex >/dev/null 2>&1 || {
  echo "codex CLI not found. Install Codex CLI and run 'codex login' first." >&2
  exit 3
}
command -v python3 >/dev/null 2>&1 || { echo "python3 not found" >&2; exit 3; }

SESSIONS_ROOT="$HOME/.codex/sessions"
mkdir -p "$SESSIONS_ROOT"

before="$(mktemp)"; after="$(mktemp)"
stdout_log="$(mktemp)"; stderr_log="$(mktemp)"; new_sessions_file="$(mktemp)"
TMP_REFS_DIR=""
cleanup() {
  rm -f "$before" "$after" "$stdout_log" "$stderr_log" "$new_sessions_file"
  [[ -n "$TMP_REFS_DIR" ]] && rm -rf "$TMP_REFS_DIR"
}
trap cleanup EXIT

# Reference images: codex's `-i` attaches them, but a path with spaces or
# non-ASCII characters (e.g. a Hebrew folder name) fails to attach and imagegen
# silently never runs. Copy any such reference to a temp ASCII path first.
SAFE_REFS=()
if [[ ${#REF_IMAGES[@]} -gt 0 ]]; then
  for img in "${REF_IMAGES[@]}"; do
    [[ -f "$img" ]] || { echo "Reference image not found: $img" >&2; exit 4; }
    if [[ "$img" == *" "* || "$img" == *[![:ascii:]]* ]]; then
      [[ -z "$TMP_REFS_DIR" ]] && TMP_REFS_DIR="$(mktemp -d)"
      safe="$TMP_REFS_DIR/ref${#SAFE_REFS[@]}.${img##*.}"
      cp "$img" "$safe"
      SAFE_REFS+=("$safe")
    else
      SAFE_REFS+=("$img")
    fi
  done
fi

find "$SESSIONS_ROOT" -type f -name 'rollout-*.jsonl' -print 2>/dev/null | sort > "$before" || true

# Intentionally NOT using --ephemeral: we need the session rollout on disk.
args=(exec --skip-git-repo-check --sandbox read-only --color never --enable image_generation)
for img in "${SAFE_REFS[@]}"; do args+=(-i "$img"); done

instruction="Use the imagegen tool to generate the image for the following request."
if [[ ${#SAFE_REFS[@]} -gt 0 ]]; then
  instruction+=" Use the attached image(s) as visual reference / input for image-to-image."
fi
instruction+=$'\nRequirements: generate the image directly, return only the image, no explanation.\n\nRequest:\n'"$PROMPT"

# `-i` is a variadic flag (<FILE>...), so passing the prompt as the trailing
# positional would be consumed as another image file. Feed the prompt via
# stdin instead (codex exec reads from stdin when no prompt positional is given).

TO=""
if   command -v timeout  >/dev/null 2>&1; then TO="timeout"
elif command -v gtimeout >/dev/null 2>&1; then TO="gtimeout"
fi

# imagegen is non-deterministic: the model sometimes answers without calling the
# tool, leaving no image payload in the session rollout. Retry a few times
# before giving up. Override the count with GEN_ATTEMPTS (default 3).
ATTEMPTS="${GEN_ATTEMPTS:-3}"
attempt=0
while :; do
  attempt=$((attempt + 1))

  set +e
  if [[ -n "$TO" ]]; then
    printf '%s' "$instruction" | "$TO" "$TIMEOUT_SEC" codex "${args[@]}" >"$stdout_log" 2>"$stderr_log"
  else
    printf '%s' "$instruction" | codex "${args[@]}" >"$stdout_log" 2>"$stderr_log"
  fi
  rc=$?
  set -e

  if [[ $rc -ne 0 ]]; then
    if [[ $attempt -lt $ATTEMPTS ]]; then
      echo "codex exec failed (exit=$rc); retrying ($attempt/$ATTEMPTS)..." >&2
      continue
    fi
    echo "codex exec failed (exit=$rc). stderr tail:" >&2
    tail -n 40 "$stderr_log" >&2 || true
    exit 5
  fi

  # Collect ALL new session files (a run can spawn more than one rollout).
  find "$SESSIONS_ROOT" -type f -name 'rollout-*.jsonl' -print 2>/dev/null | sort > "$after" || true
  comm -13 "$before" "$after" > "$new_sessions_file" || true

  if [[ -s "$new_sessions_file" ]]; then
    # Windows/Git-Bash: convert MSYS paths (/c/Users/...) to native Windows
    # paths so the Windows Python extractor can open them — it reads the paths
    # from this file, and MSYS only auto-converts argv, not file contents
    # (/c/Users would otherwise resolve to a non-existent C:\c\Users).
    if command -v cygpath >/dev/null 2>&1; then
      win_sessions_file="$(mktemp)"
      while IFS= read -r _p; do [[ -n "$_p" ]] && cygpath -w "$_p"; done < "$new_sessions_file" > "$win_sessions_file"
      mv -f "$win_sessions_file" "$new_sessions_file"
    fi
    set +e
    python3 "$SCRIPT_DIR/extract_image.py" "$OUT" "$new_sessions_file"
    py_rc=$?
    set -e
    [[ $py_rc -eq 0 ]] && exit 0
  fi

  # No image payload this turn (imagegen likely didn't run). Retry.
  if [[ $attempt -lt $ATTEMPTS ]]; then
    echo "no image payload yet; retrying ($attempt/$ATTEMPTS)..." >&2
    continue
  fi
  echo "Image payload not found after $ATTEMPTS attempt(s)" >&2
  echo "(imagegen likely did not run; stderr tail:)" >&2
  tail -n 30 "$stderr_log" >&2 || true
  exit 7
done
