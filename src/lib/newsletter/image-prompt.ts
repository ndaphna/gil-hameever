/**
 * Image prompt generator for newsletter header images.
 *
 * Single source of truth for the Aliza-voiced system prompt and the body
 * excerpt strategy. Used by:
 *   - /api/admin/newsletter/[id]/generate-image  (single prompt + image)
 *   - /api/admin/newsletter/[id]/suggest-image-prompts  (3 variants)
 *
 * Voice direction:
 *   Aliza is the optimistic-with-dry-humor AI character in the newsletter.
 *   Image prompts should feel like she composed them — light, momentum,
 *   small everyday triumphs, gentle wink. NEVER somber/gray/melancholic.
 *
 * Body excerpt strategy:
 *   First 200 chars (hook) + last 200 chars (uplift / closing question).
 *   The middle is tools/explanation — visually less interesting and would
 *   pull the model toward generic "advice" imagery. The arc endpoints
 *   capture the emotional shape.
 */

import Anthropic from '@anthropic-ai/sdk';

export type ImageStyleKey = 'realistic' | 'illustration' | 'landscape' | 'infographic';

export const IMAGE_STYLE_HINTS: Record<ImageStyleKey, string> = {
  realistic:
    'photorealistic editorial photography, soft warm natural window light, shallow depth of field, warm earthy palette',
  illustration:
    'modern editorial illustration, soft gouache textures, warm pastel palette, gentle confident shapes, hand-drawn feel',
  landscape:
    'serene wide landscape photography, golden hour light, hopeful atmosphere, no people',
  infographic:
    'clean editorial vector illustration, flat shapes with soft gradients, warm pastel palette, abstract symbolic objects, no text labels',
};

export const IMAGE_STYLE_KEYS: ImageStyleKey[] = [
  'landscape',
  'illustration',
  'realistic',
  'infographic',
];

/**
 * The Aliza-voiced system prompt. Both endpoints prepend this; the suggest
 * endpoint then appends a JSON output spec.
 */
export const ALIZA_IMAGE_SYSTEM_PROMPT = `You write concise English image prompts for editorial header images on a Hebrew newsletter for women age 50+ about midlife, perimenopause, and personal growth.

VOICE — channel Aliza, the AI character who lives inside this newsletter: optimistic, dryly witty, occasionally cheeky, finds the bright side without being saccharine. She is the morning-after-the-hard-night voice. Your visual prompts should feel like she composed them — not somber, not gray-toned despair, not "woman alone at rainy window." Instead: light breaking through, small acts of triumph, quiet absurdities of midlife (a kettle that finally whistles, slippers next to running shoes, a half-drunk coffee with a notebook), warm afternoons, garden-table moments.

EMOTIONAL ARC — every newsletter has: raw opening hook, explanation, practical tools, uplifting quote, closing question to the reader. Match the FULL arc, not just the pain at the start. Lean energizing, hopeful, occasionally playful.

HARD RULES:
- Warm, hopeful, energizing palette. Soft warm light. Pastels or warm earth tones.
- NO human faces, NO recognizable people.
- NO text, NO words, NO logos, NO watermarks.
- Prefer: abstract metaphor, everyday object close-up, landscape with light, symbolic still-life with a wink, botanical close-ups, gentle motion.
- FORBIDDEN moods: melancholic, somber, despairing, gray-toned, rainy isolation, "woman alone at window".
- Landscape orientation.`;

/**
 * Extract first 200 + last 200 chars so the model sees the emotional arc
 * (raw hook + uplifting close), not just the painful opening.
 */
export function bodyArcExcerpt(bodyText: string, perSide = 200): string {
  const clean = bodyText.trim();
  if (clean.length <= perSide * 2 + 50) return clean;
  return `${clean.slice(0, perSide).trim()}\n\n[...]\n\n${clean.slice(-perSide).trim()}`;
}

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  _anthropic = new Anthropic({ apiKey });
  return _anthropic;
}

/**
 * Generate ONE English image prompt grounded in subject + arc excerpt + style.
 * Used by the auto-fill path in /generate-image.
 */
export async function draftSingleImagePrompt(
  subject: string,
  bodyText: string,
  style: ImageStyleKey,
): Promise<string> {
  const client = getAnthropic();
  const styleHint = IMAGE_STYLE_HINTS[style];
  const excerpt = bodyArcExcerpt(bodyText);

  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 350,
    system: `${ALIZA_IMAGE_SYSTEM_PROMPT}\n\nReturn ONLY the prompt — no preface, no quotes, no explanation. Target length: 40-70 words.`,
    messages: [
      {
        role: 'user',
        content: `Newsletter subject (Hebrew): "${subject}"

Body excerpt (Hebrew — opening hook + closing uplift, middle elided):
${excerpt}

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

export type PromptSuggestion = {
  angle: string;
  prompt: string;
};

/**
 * Return 3 prompt variants with DISTINCT conceptual angles. Each is
 * independently usable as a final prompt.
 */
export async function suggestImagePromptVariants(
  subject: string,
  bodyText: string,
  style: ImageStyleKey,
): Promise<PromptSuggestion[]> {
  const client = getAnthropic();
  const styleHint = IMAGE_STYLE_HINTS[style];
  const excerpt = bodyArcExcerpt(bodyText);

  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 900,
    system: `${ALIZA_IMAGE_SYSTEM_PROMPT}

OUTPUT FORMAT — Return ONLY a JSON object (no markdown fence, no preface) with this exact shape:
{"suggestions": [
  {"angle": "<short Hebrew label, 2-5 words>", "prompt": "<40-70 word English image prompt>"},
  {"angle": "...", "prompt": "..."},
  {"angle": "...", "prompt": "..."}
]}

Exactly 3 suggestions, each with a DISTINCT conceptual angle. Pick 3 from:
- מטאפורה יומיומית — close-up of an everyday object that quietly resolves the newsletter's tension (kettle, journal, slippers + running shoes, half-drunk coffee, open window)
- נוף עם אור — landscape moment with light breaking through (dawn, golden hour, light between trees)
- רגע שקט עם חיוך — small symbolic still-life with subtle humor or quiet triumph
- אנרגיה ותנועה — abstract suggestion of motion, getting up, momentum (flowing fabric, opening curtain, climbing stairs from below)
- ירוק וצמיחה — botanical close-up, growth metaphor, hands-and-soil-implied
- צבע ושמחה — bold warm color composition, sunlight + saturated palette
- אבסורד קטן — gentle ironic juxtaposition that pokes fun at midlife (wobbling tea-stack, mismatched objects in harmony)

Each prompt must be independently usable, 40-70 English words, and adhere to all HARD RULES from the voice spec above.`,
    messages: [
      {
        role: 'user',
        content: `Newsletter subject (Hebrew): "${subject}"

Body excerpt (Hebrew — opening hook + closing uplift, middle elided):
${excerpt}

Style direction (applies to all 3): ${styleHint}

Return the JSON now.`,
      },
    ],
  });

  const raw = res.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim();
  if (!raw) throw new Error('sonnet returned empty response');

  // Strip ```json fences if the model added them despite instructions.
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  let parsed: { suggestions?: unknown };
  try {
    parsed = JSON.parse(json) as { suggestions?: unknown };
  } catch (err) {
    throw new Error(`sonnet returned non-JSON: ${(err as Error).message}; raw=${raw.slice(0, 200)}`);
  }
  if (!Array.isArray(parsed.suggestions)) {
    throw new Error('sonnet response missing suggestions array');
  }
  const cleaned: PromptSuggestion[] = parsed.suggestions
    .filter(
      (s): s is { angle: unknown; prompt: unknown } =>
        typeof s === 'object' && s !== null && 'angle' in s && 'prompt' in s,
    )
    .map((s) => ({
      angle: String(s.angle).trim(),
      prompt: String(s.prompt).trim(),
    }))
    .filter((s) => s.angle.length > 0 && s.prompt.length > 0)
    .slice(0, 4);
  if (cleaned.length === 0) {
    throw new Error('sonnet returned no usable suggestions');
  }
  return cleaned;
}
