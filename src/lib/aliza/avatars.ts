/**
 * Mood → illustration mapping for Aliza's avatar.
 * Source assets live in public/aliza/ (28 hand-drawn PNGs).
 *
 * Aliza emits [MOOD:<tag>] at the start of her response. The frontend
 * strips the marker, looks up the illustration here, and renders the
 * avatar in the matching mood.
 */

export type AlizaMood =
  | 'default'
  | 'greeting'
  | 'empathetic'
  | 'curious'
  | 'confident'
  | 'playful'
  | 'celebratory'
  | 'supportive';

export const AVATAR_BY_MOOD: Record<AlizaMood, string> = {
  default:     '/aliza/aliza-main.png',
  greeting:    '/aliza/aliza-wave.jpg',
  empathetic:  '/aliza/aliza-self-hug.png',
  curious:     '/aliza/aliza-what.png',
  confident:   '/aliza/aliza-hands-hips.png',
  playful:     '/aliza/aliza-yoga-chaos.png',
  celebratory: '/aliza/aliza-medal-podium.png',
  supportive:  '/aliza/aliza-friends-cafe.png',
};

/** Strict mood validation — falls back to 'default' on unknown tags. */
export function parseMood(raw: string | null | undefined): AlizaMood {
  if (!raw) return 'default';
  const t = raw.trim().toLowerCase();
  if (t in AVATAR_BY_MOOD) return t as AlizaMood;
  return 'default';
}

/** Path to the speaking-head MP4 loop for a given mood (may not exist yet). */
export function avatarVideoPath(mood: AlizaMood): string {
  return `/aliza/speaking/${mood}.mp4`;
}

/** Extract a [MOOD:<tag>] marker from text and return [moodTag, cleanedText]. */
export function extractMoodMarker(text: string): { mood: AlizaMood; cleaned: string } {
  const match = text.match(/^\s*\[MOOD:([a-z_]+)\]\s*\n?/i);
  if (!match) return { mood: 'default', cleaned: text };
  return {
    mood: parseMood(match[1]),
    cleaned: text.slice(match[0].length),
  };
}
