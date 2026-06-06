# Image Generation Procedure — gil-hameever

The orderly, repeatable procedure for producing every image on the site. Follow it
exactly. **Never ship a flat gradient / solid-color placeholder.** If generation fails,
say so and stop — do not fake an asset.

> Status: v1 covers **article hero images** end-to-end (proven). Other image types
> (avatars, Aliza illustrations, social/carousel, newsletter headers) are sketched at the
> bottom and will be tightened over time. When you complete a new type for real, promote
> its steps from "Draft" to a full section here.

---

## Tooling: GPT Image 2 via the Codex CLI (canonical, no per-image billing)

Images are generated with **GPT Image 2** through the local `codex` CLI, reusing the
ChatGPT subscription — no OpenAI API billing. Wrapper script:

```
.agents/skills/gpt-image-2/scripts/gen.sh      # generate (text-to-image or image-to-image)
.agents/skills/gpt-image-2/scripts/extract_image.py  # decode the image out of the codex session
```

### Prerequisites (verify before generating)
- `codex` CLI installed and logged in (`codex login`) with a ChatGPT plan that includes
  Image 2. Check: `codex features list | grep image_generation` → must be `stable true`.
- `python3` on PATH.
- `sharp` available in the project (`node -e "require.resolve('sharp')"`) — used to
  resize/convert to the final JPG.

### Generate (text-to-image)
```bash
bash .agents/skills/gpt-image-2/scripts/gen.sh \
  --prompt "<English prompt — see style guide below>" \
  --out "C:/Users/Adva/Projects/gil-hameever/public/articles/_gen/<slug>.png"
```
- Use an **absolute Windows-style path** (`C:/Users/...`) for `--out`.
- Output is a large PNG (~1.5–2.5 MB). Exit code 0 = success; the path is printed.

### Generate (image-to-image, e.g. preserve a face)
```bash
bash .agents/skills/gpt-image-2/scripts/gen.sh \
  --prompt "<edit instruction>" \
  --ref "C:/absolute/path/to/reference.png" \
  --out "C:/.../public/<dir>/<name>.png"
```
`--ref` is repeatable for multi-reference composition.

### Windows gotchas (already fixed in this repo's copy of the scripts — keep them)
These two bugs made `gen.sh` silently fail on Windows/Git-Bash before 2026-06-05:
1. **Path translation:** Git-Bash writes MSYS paths (`/c/Users/...`) into the session-list
   file; native Windows Python reads them literally and resolves `/c/Users` as
   `C:\c\Users` (missing). `gen.sh` now converts session paths with `cygpath -w` before
   handing them to `extract_image.py`.
2. **Encoding:** `extract_image.py` now reads session rollouts as `encoding="utf-8"` and
   splits on `\n` only (not `str.splitlines()`, which breaks on Unicode line separators
   that can appear mid-payload and shatter the giant single-line JSON, losing the base64).

If you re-copy the scripts from the global skill, re-apply these fixes.

### Reliability (built into this repo's `gen.sh`)
- **Retry:** imagegen is non-deterministic — the model sometimes answers without calling the
  tool (no image payload). `gen.sh` now retries up to `GEN_ATTEMPTS` times (default 3).
- **Reference paths:** a `--ref` whose path has spaces or non-ASCII chars (Hebrew folder)
  is auto-copied to a temp ASCII path before attaching (codex `-i` fails on such paths).

### Failure handling
`gen.sh` exit codes: `3` codex/python missing · `5` codex exec failed (auth/network) ·
`6` no session file · `7` imagegen did not run / no payload after all retries. On any
non-zero exit: report the failing layer in one line and **do not** substitute a placeholder.

---

## Media storage

Where generated media lives:
- **Article images (small JPGs):** committed in-repo under `public/articles/` and served as
  Vercel static assets (CDN-cached). Simple; fine for tens-of-KB files. This is the default.
- **Video and heavy assets (future):** **do NOT commit to git** — it bloats the repo and git
  is poor with large binaries. Use the project's **Supabase Storage** bucket (already used for
  newsletter images) and reference the public CDN URL. Decide a bucket/path convention when
  the first video ships and document it here.
- **Legacy:** older articles reference an external host (`i.imghippo.com`). New work should
  not add new external-host dependencies; prefer in-repo (images) or Supabase Storage (heavy).

---

## Article hero images (proven end-to-end)

### Spec
- **Path:** `public/articles/<slug>.jpg`
- **Format/size:** JPEG, **800×500** (landscape ~1.6:1).
- **Referenced in two places:**
  1. The article's client component, e.g.
     `src/app/(public)/<route>/<name>-client.tsx` →
     `<img src="/articles/<slug>.jpg" alt="<Hebrew alt>" className="article-image" />`
  2. The articles index array in
     `src/app/(public)/articles/articles-client.tsx` → the matching entry's `imageUrl`.

### Style guide (brand default: warm illustration)
Article heroes use a **warm, hand-drawn digital illustration** style — **not** photoreal.
Soft pastel palette with **rose and lavender** tones, gentle and cozy, clean. A woman ~50
(or the topic's stated age) is common but **not required** — any illustration that conveys
the article's idea works (a scene, a still life, a cozy vignette). **No text, no words, no
letters** in the image (AI renders text garbled, and the page already has the H1). Wide
**landscape** composition for the 800×500 slot. Always **context-matched** to the article.

Generate with the brand style anchored by an example illustration as a `--ref`:
- Reference illustrations live in `C:\Users\Adva\Pictures\דוגמאות לאיורים למאמרים גיל המעבר`.
  Use one (e.g. the soft-pastel `OsO8314YpQ.jpg`) as the `--ref` style anchor.
- `gen.sh` auto-copies a `--ref` whose path has spaces or non-ASCII characters (Hebrew) to
  a temp ASCII path — codex's `-i` fails to attach such paths otherwise.

Prompt template (illustration):
```
<SCENE specific to the article topic>. Warm friendly hand-drawn digital illustration in soft
pastel colors, matching the artistic style of the reference image. Soft rose and lavender
pastel palette, gentle cozy and clean. Wide horizontal landscape composition filling a 3:2
frame. Absolutely no text, no words, no letters anywhere.
```

> A photorealistic editorial style was used earlier and still works (drop the "illustration"
> language, add "photorealistic editorial photograph"). The **brand default is illustration**;
> only switch to photoreal if asked.

### Convert + place (PNG → final 800×500 JPG)
After generating PNG(s) into `public/articles/_gen/`, run a sharp conversion that names each
output to match its source slug, then delete the scratch dir:
```js
// public/articles/_gen/convert.mjs
import sharp from 'sharp';
import { readdirSync } from 'fs';
import path from 'path';
const genDir = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const outDir = path.resolve(genDir, '..');
for (const f of readdirSync(genDir).filter(f => f.endsWith('.png'))) {
  await sharp(path.join(genDir, f))
    .resize(800, 500, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, f.replace(/\.png$/, '.jpg')));
}
```
```bash
node public/articles/_gen/convert.mjs
rm -rf public/articles/_gen        # scratch dir is never committed
```
`fit: 'cover'` + `position: 'attention'` crops to 800×500 while keeping the salient
region (usually the face). Final files land at ~30–70 KB — a gradient placeholder is
~13 KB, which is the tell-tale sign generation was skipped.

### Verify before committing
1. Open each final `.jpg` and confirm it is the real, context-matched photo (not a
   gradient) and the crop didn't cut the subject.
2. Confirm both references (`articles-client.tsx` + the article component) point to the
   right `/articles/<slug>.jpg`.

---

## Other image types — Draft (refine when first done for real)

- **Inbal avatars / portraits:** image-to-image (`--ref`) from the existing Inbal photos in
  `public/` to preserve identity; for transparent cut-outs use rembg `birefnet-portrait`.
  Output spec TBD when first produced.
- **Aliza illustrations:** consistent illustrated style; references in `public/aliza/`.
  Style lock + spec TBD.
- **Social / carousel images:** sizing per platform (e.g. 1080×1350 IG portrait); TBD.
- **Newsletter headers:** see the `NEWSLETTER_*.md` guides (gpt-image-1, 1536×1024 lineage).

When you build one of these for real: capture the exact prompt, size, path convention, and
any reference assets here, and move it out of Draft.
