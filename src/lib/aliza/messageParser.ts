/**
 * Parse an Aliza response into structured segments that the UI can render.
 *
 * Input examples:
 *   "[MOOD:empathetic]\nאני שומעת. [RESOURCE:sleep-guide-landing]"
 *   "תודה ששיתפת. רוצה לקרוא משהו? [RESOURCE:mood-guide-landing]"
 *   "סתם טקסט בלי סימונים."
 *
 * Output: { mood, segments: Array<{type:'text'|'resource', ...}> }
 *
 * The [RESOURCE:<slug>] marker can appear anywhere in the body; it is
 * replaced by an inline ResourceCard at render time.
 */

import { extractMoodMarker, type AlizaMood } from './avatars';

export type MessageSegment =
  | { type: 'text'; text: string }
  | { type: 'resource'; slug: string };

export type ParsedMessage = {
  mood: AlizaMood;
  segments: MessageSegment[];
  /** All resource slugs detected, in order (for analytics + dedup). */
  resourceSlugs: string[];
};

const RESOURCE_RE = /\[RESOURCE:([a-z0-9\-_]+)\]/gi;

export function parseAlizaMessage(raw: string): ParsedMessage {
  const { mood, cleaned } = extractMoodMarker(raw);
  const segments: MessageSegment[] = [];
  const slugs: string[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  RESOURCE_RE.lastIndex = 0;
  while ((match = RESOURCE_RE.exec(cleaned)) !== null) {
    const before = cleaned.slice(lastIndex, match.index).trim();
    if (before) segments.push({ type: 'text', text: before });
    const slug = match[1].toLowerCase();
    segments.push({ type: 'resource', slug });
    slugs.push(slug);
    lastIndex = match.index + match[0].length;
  }
  const tail = cleaned.slice(lastIndex).trim();
  if (tail) segments.push({ type: 'text', text: tail });

  // Edge case: empty after stripping → preserve at least one text segment.
  if (segments.length === 0) segments.push({ type: 'text', text: cleaned.trim() });

  return { mood, segments, resourceSlugs: slugs };
}
