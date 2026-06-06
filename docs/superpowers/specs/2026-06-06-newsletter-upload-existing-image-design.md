# Newsletter — Upload an Existing Header Image

**Date:** 2026-06-06
**Status:** Approved (brainstorm), ready for implementation plan

## Goal

Add a third path to the "תמונת ראש" card in the newsletter draft editor: let the
content creator use an image she **already has**, in addition to the existing
AI-generate and delete paths. Any image must be accepted and **automatically
fitted** to the dimensions the newsletter requires.

## Scope

- **In:** upload a file from device; supply an image link (including a Google
  Drive "anyone with the link" share URL); server-side auto-resize to the
  canonical header dimensions; persist to the existing storage bucket and draft
  row exactly like a generated image.
- **Out:** native Google Drive folder browser / Picker (rejected — would require
  standing up a full Google OAuth client, API key, picker.js, token handling,
  and consent screen for a single image field). If visual Drive browsing is ever
  wanted, it is a separate project.

## Current state (for reference)

- Editor: `src/app/admin/newsletter/[id]/draft-editor.tsx` — "תמונת ראש" card
  (~line 828) currently exposes generate (`generate-image`) and delete
  (`header-image` DELETE) only. Shared UI state: `isImageBusy`, `imageError`,
  `imageSuccess`, `headerImageUrl`, `headerImageProvider`, `headerImagePrompt`.
- Generate endpoint: `src/app/api/admin/newsletter/[id]/generate-image/route.ts`
  — produces a 1536×1024 PNG via gpt-image-1, uploads to the public Supabase
  Storage bucket `newsletter-images` as `${id}-${Date.now()}.png`, then persists
  `header_image_url`, `header_image_prompt`, `header_image_provider` on the
  `newsletter.email_drafts` row.
- Email template: `src/lib/newsletter/brevo-template.ts:183` renders the header
  image at `width: 100%; max-width: 100%; height: auto; max-height: 280px;
  object-fit: cover` inside a 640px-max-width container. So a 1536×1024 (3:2)
  asset is cropped to the visible ~280px band — generated and uploaded images
  therefore render identically.
- No `sharp`/`jimp` installed. No Google/Drive integration exists in the app.

## Design

### Canonical dimensions

All header images normalize to **1536×1024 (3:2), fit: cover** — identical to the
AI-generated images, so uploads and generations look the same in the email.

### New endpoint: `POST /api/admin/newsletter/[id]/upload-image`

- **Auth:** `content_creator` (same gate as generate-image — Supabase
  `auth.getUser()` + `newsletter.has_role('content_creator')`).
- **Runtime:** `nodejs`, `force-dynamic`, `maxDuration = 60`.
- **Input — two content types:**
  - `multipart/form-data` with a `file` field (device upload), OR
  - `application/json` with `{ url: string }` (link / Drive paste).
- **Drive link normalization (URL path only):** before fetching, convert common
  Drive share forms to a direct-download URL:
  - `https://drive.google.com/file/d/<ID>/view...` → `https://drive.google.com/uc?export=download&id=<ID>`
  - `https://drive.google.com/open?id=<ID>` → same
  - Any other URL is fetched as-is.
- **Validation:**
  - Resolved bytes must be a decodable image (sharp metadata succeeds);
    otherwise `400 invalid_image`.
  - Size cap ~15MB (reject larger with `400 file_too_large`).
  - URL fetch uses a timeout (~15s) and rejects non-image content-types /
    Drive permission HTML pages with a clear message
    (`400 not_an_image` — hint: share the Drive file to "anyone with the link").
- **Transform (`sharp`):**
  `sharp(input).rotate().resize(1536, 1024, { fit: 'cover' }).flatten({ background: '#ffffff' }).jpeg({ quality: 85 })`.
  (`.rotate()` honors EXIF orientation from phone photos; `.flatten` gives PNGs
  with transparency a white background instead of black.)
- **Store:** upload the JPEG to `newsletter-images` as `${id}-${Date.now()}.jpg`
  with `contentType: 'image/jpeg'`, `cacheControl: '31536000, immutable'`,
  `upsert: false`; get its public URL.
- **Persist:** update the draft row —
  `header_image_url = <publicUrl>`, `header_image_provider = 'upload'`,
  `header_image_prompt = null`, `updated_at = now()`.
- **Response:** `{ ok: true, url, provider: 'upload' }`. Errors mirror the
  generate-image shape: `{ error, detail? }` with appropriate status.

### Dependency

Add `sharp` to `package.json` (Vercel supports it natively).

### Frontend: `draft-editor.tsx`

In the "תמונת ראש" card, add a block above (or beside) the generate controls:

- **Device upload:** a visible button "העלי תמונה מהמחשב" that triggers a hidden
  `<input type="file" accept="image/*">`. On change, POST the file as
  `multipart/form-data` to `upload-image`.
- **Link upload:** a text input (`dir="ltr"`, placeholder for a Drive/image URL)
  plus a button "העלי מקישור / דרייב" that POSTs `{ url }` as JSON.
- **State:** reuse `isImageBusy`, `imageError`, `imageSuccess`. On success set
  `headerImageUrl`, `headerImageProvider`, clear `headerImagePrompt`, then
  `router.refresh()`. Disable all image controls while `isImageBusy` (and the
  usual save/broadcast/automation busy flags), consistent with generate.
- **Note line:** "כל תמונה תותאם אוטומטית — חיתוך למילוי לרוחב הנכון (1536×1024)."
- The existing preview, provider meta, and delete button already key off
  `headerImageUrl` / `headerImageProvider` and work unchanged for uploads.

## Data flow

1. User picks a file or pastes a link → POST to `upload-image`.
2. Endpoint: auth → (normalize Drive URL & fetch) or (read multipart file) →
   validate → `sharp` resize/cover/flatten/jpeg → upload to bucket → persist row.
3. Returns public URL → client updates state → `router.refresh()`.
4. Subsequent test-send / broadcast / preview pick up `header_image_url` exactly
   as they do for generated images (no changes needed there).

## Error handling

- Unauthorized / forbidden → 401 / 403 (same as generate-image).
- Non-image bytes, oversized file, failed/timed-out fetch, Drive-not-shared HTML
  → 400 with a Hebrew-friendly `error` code surfaced via `imageError`.
- Storage upload failure → 500 `upload_failed`.
- Row persist failure → 500 `persist_failed` (URL still returned for debugging).

## Testing

- Upload a JPG and a PNG-with-transparency from device → both land as 1536×1024
  JPEG on white, render in the full-email preview and a test send.
- Paste a public image URL → same result.
- Paste a Drive "anyone with the link" share URL → normalized, fetched, stored.
- Paste a Drive link that is **not** shared → clear error, no row change.
- Oversized (>15MB) and non-image URL → rejected with clear errors.
- Portrait phone photo with EXIF rotation → orientation correct after resize.
- Delete still clears an uploaded image from storage + row.
