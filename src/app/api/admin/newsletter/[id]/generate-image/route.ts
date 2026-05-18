/**
 * Generate an editorial header image for a newsletter draft.
 *
 * Auth: content_creator.
 *
 * POST /api/admin/newsletter/:id/generate-image
 * Body (optional): {
 *   prompt?: string,   // English image prompt — when omitted, Haiku 4.5 writes one from subject + body
 *   style?: 'realistic' | 'illustration' | 'landscape' | 'infographic'
 * }
 *
 * Pipeline:
 *   1. Load draft (subject, body_text).
 *   2. If no prompt, ask Claude Sonnet 4.6 to draft a short English image prompt
 *      grounded in the subject + first 400 chars of the body. No human faces.
 *   3. Call OpenAI gpt-image-1 (1536x1024 landscape, medium quality, ~$0.04).
 *   4. Upload PNG to public Supabase Storage bucket `newsletter-images`.
 *   5. Persist `header_image_url`, `header_image_prompt`, `header_image_provider`
 *      on the draft row.
 *   6. Return { ok, url, prompt }.
 *
 * Returns 502 if either OpenAI or Anthropic call fails.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BUCKET = 'newsletter-images';
const PROVIDER = 'openai';

type StyleKey = 'realistic' | 'illustration' | 'landscape' | 'infographic';

const STYLE_HINTS: Record<StyleKey, string> = {
  realistic: 'photorealistic editorial photography, soft natural window light, shallow depth of field, warm muted palette',
  illustration: 'modern editorial illustration, soft gouache textures, warm pastel palette, gentle shapes, hand-drawn feel',
  landscape: 'serene wide landscape photography, golden hour, hopeful atmosphere, no people',
  infographic: 'clean editorial infographic, flat vector style, soft gradients, warm pastel palette, abstract symbolic shapes, no text labels',
};

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  _openai = new OpenAI({ apiKey });
  return _openai;
}

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  _anthropic = new Anthropic({ apiKey });
  return _anthropic;
}

async function draftPromptFromContent(
  subject: string,
  bodyExcerpt: string,
  style: StyleKey,
): Promise<string> {
  const client = getAnthropic();
  const styleHint = STYLE_HINTS[style];

  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system:
      "You write concise English image prompts (40-70 words) for editorial header images on a Hebrew newsletter for women age 50+ about midlife, perimenopause, and personal growth. Hard rules: warm hopeful tone, soft natural light, feminine without cliche. NEVER include human faces or recognizable people. Prefer abstract metaphor, still life, landscape, or symbolic objects. NO text, NO words, NO logos, NO watermarks. Landscape orientation. Return ONLY the prompt — no preface, no quotes, no explanation.",
    messages: [
      {
        role: 'user',
        content: `Newsletter subject (Hebrew): "${subject}"

Body excerpt (Hebrew, first 400 chars):
${bodyExcerpt}

Style direction: ${styleHint}

Write the English image prompt now.`,
      },
    ],
  });

  const text = res.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join(' ')
    .trim();

  if (!text) throw new Error('sonnet returned empty prompt');
  return text;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: allowed, error: roleError } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'content_creator' });
  if (roleError || allowed !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let bodyJson: { prompt?: unknown; style?: unknown } = {};
  try {
    bodyJson = (await request.json()) as { prompt?: unknown; style?: unknown };
  } catch {
    // empty body OK
  }
  const rawPrompt =
    typeof bodyJson.prompt === 'string' ? bodyJson.prompt.trim() : '';
  const style: StyleKey = (() => {
    const s = typeof bodyJson.style === 'string' ? bodyJson.style : '';
    return s === 'realistic' || s === 'illustration' || s === 'landscape' || s === 'infographic'
      ? s
      : 'landscape';
  })();

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, subject, body_text')
    .eq('id', id)
    .maybeSingle<{ id: string; subject: string; body_text: string | null }>();
  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }

  let finalPrompt = rawPrompt;
  if (!finalPrompt) {
    try {
      finalPrompt = await draftPromptFromContent(
        draft.subject,
        (draft.body_text ?? '').slice(0, 400),
        style,
      );
    } catch (err) {
      return NextResponse.json(
        {
          error: 'auto_prompt_failed',
          detail: err instanceof Error ? err.message : String(err),
        },
        { status: 502 },
      );
    }
  } else {
    // User supplied a prompt. Append style hint so all four buttons behave
    // consistently regardless of who wrote the words.
    finalPrompt = `${finalPrompt}. ${STYLE_HINTS[style]}. Landscape orientation, no text, no people's faces.`;
  }

  let b64: string;
  try {
    const openai = getOpenAI();
    const img = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: finalPrompt,
      size: '1536x1024',
      quality: 'medium',
      n: 1,
    });
    const first = img.data?.[0]?.b64_json;
    if (!first) throw new Error('gpt-image-1 returned no b64_json');
    b64 = first;
  } catch (err) {
    return NextResponse.json(
      {
        error: 'image_generation_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  const buffer = Buffer.from(b64, 'base64');
  const filename = `${id}-${Date.now()}.png`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: 'image/png',
      cacheControl: '31536000, immutable',
      upsert: false,
    });
  if (uploadError) {
    return NextResponse.json(
      { error: 'upload_failed', detail: uploadError.message },
      { status: 500 },
    );
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(filename);
  const publicUrl = publicUrlData.publicUrl;

  const { error: persistError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update({
      header_image_url: publicUrl,
      header_image_prompt: finalPrompt,
      header_image_provider: PROVIDER,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (persistError) {
    return NextResponse.json(
      {
        error: 'persist_failed',
        detail: persistError.message,
        url: publicUrl,
        prompt: finalPrompt,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    url: publicUrl,
    prompt: finalPrompt,
    provider: PROVIDER,
  });
}
