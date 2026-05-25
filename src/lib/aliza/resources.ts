/**
 * Resource catalog lookup + topic detection for Aliza recommendations.
 *
 * Aliza embeds [RESOURCE:<slug>] in her response when she wants to recommend
 * a guide. We pre-filter the catalog down to ~2 candidates per turn based on
 * (a) recent symptoms from the user's data and (b) keywords in the user's
 * latest message, so the model has a curated shortlist rather than the full
 * catalog.
 */

import { supabaseAdmin } from '@/lib/supabase-server';

export type Resource = {
  slug: string;
  url: string;
  hebrew_title: string;
  short_desc: string;
  format: 'guide' | 'checklist' | 'protocol' | 'tool' | 'video';
  topic_tags: string[];
  gated: boolean;
  priority: number;
};

/**
 * Hebrew keyword → topic-tag map used to detect topics in user messages.
 * Conservative on purpose: false positives are worse than misses because they
 * make Aliza spam recommendations. Keep the tags aligned with
 * newsletter.aliza_resources.topic_tags and with daily_entries symptom enums.
 */
const KEYWORD_TO_TAGS: Array<[RegExp, string[]]> = [
  // sleep
  [/\b(שינה|לישון|נדודי|מתעורר|לילה|לילות|insomnia|נרדמ)/i, ['sleep_issues', 'insomnia']],
  [/(הזעת לילה|הזעות בלילה|night sweats)/i, ['night_sweats']],
  // hot flashes
  [/(גל חום|גלי חום|גל החום|הסמקה|hot flash)/i, ['hot_flashes', 'flushing']],
  // brain fog / cognition
  [/(ערפל|ערפול|מוח|זיכרון|לזכור|ריכוז|לא זוכרת|מתרכזת|brain fog)/i, ['brain_fog', 'concentration_difficulty', 'memory', 'focus']],
  // mood / emotional
  [/(מצב רוח|עצב|עצובה|דיכאון|חרדה|כעס|רגיש|בכי|frustrat|mood|sad|emotional)/i, ['mood', 'sad', 'frustrated', 'emotional']],
  // energy
  [/(אנרגיה|תשושה|עייפ|מותש|חסר כוח|low energy)/i, ['energy', 'low_energy']],
  // movement / strength
  [/(הליכה|לצעוד|הולכת|walking)/i, ['movement', 'exercise']],
  [/(משקולות|כוח|אימון|חדר כושר|strength)/i, ['movement', 'strength']],
  // nutrition
  [/(חלבון|תזונה|אוכל|אכילה|protein|nutrition)/i, ['nutrition', 'protein']],
  // bones
  [/(עצמות|אוסטאו|osteo)/i, ['bones', 'osteoporosis']],
  // identity / meaning
  [/(מי אני|תפקיד|משמעות|זהות|אחרי שהילדים|identity|purpose)/i, ['identity', 'meaning', 'purpose', 'transition']],
  // mornings
  [/(בוקר|התחלה ליום|שגרה|מסודרת|morning|routine)/i, ['morning_routine']],
  // overwhelmed / first time
  [/(לא יודעת מאיפה להתחיל|הצפה|הצפת|מבולבל|overwhelm)/i, ['general', 'overwhelm', 'onboarding']],
];

/**
 * Detect topic tags from a user message.
 * Combines explicit symptoms from the user's profile (recent active symptoms
 * pulled from journal/check-ins) with keyword matches on the message itself.
 */
export function detectTopics(userMessage: string, recentSymptoms: string[] = []): string[] {
  const tags = new Set<string>(recentSymptoms);
  for (const [regex, mapped] of KEYWORD_TO_TAGS) {
    if (regex.test(userMessage)) {
      mapped.forEach(t => tags.add(t));
    }
  }
  return Array.from(tags);
}

/**
 * Pick top-K resources whose topic_tags overlap with the requested tags.
 * ORDER BY priority desc, slug asc (deterministic tiebreak).
 *
 * Returns empty array if no tags or no matches. Aliza will simply not
 * recommend a resource in that turn, which is the correct behavior.
 */
export async function pickResources(tags: string[], limit: number = 2): Promise<Resource[]> {
  if (tags.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .schema('newsletter')
    .from('aliza_resources')
    .select('slug, url, hebrew_title, short_desc, format, topic_tags, gated, priority')
    .eq('is_active', true)
    .overlaps('topic_tags', tags)
    .order('priority', { ascending: false })
    .order('slug', { ascending: true })
    .limit(limit);

  if (error) {
    console.warn('⚠️ Resource lookup failed:', error.message);
    return [];
  }
  return (data ?? []) as Resource[];
}

/**
 * Format a list of resources as a Hebrew block injected into Aliza's system
 * prompt. Aliza is instructed to embed [RESOURCE:<slug>] inline when she
 * recommends one.
 */
export function formatResourcesBlock(resources: Resource[]): string {
  if (resources.length === 0) return '';
  const lines = resources
    .map(r => `- ${r.slug}: "${r.hebrew_title}" - ${r.short_desc} (${r.format}${r.gated ? ', דורש הרשמה' : ''})`)
    .join('\n');
  return `============================================
משאבים זמינים להמלצה (תוכן של ענבל באתר):
${lines}

אם משאב מתוך הרשימה רלוונטי לשאלת המשתמשת, את יכולה להמליץ עליו ולשבץ בתוך התשובה את הסימון [RESOURCE:<slug>] בדיוק כפי שמופיע למעלה. הסימון יהפוך לכרטיס לחיץ ב־UI.
חוקים:
- מקסימום משאב אחד לתשובה.
- ממליצה רק אם זה באמת מועיל למה שהמשתמשת מתארת, לא בכל תשובה.
- אם זה משאב gated (דורש הרשמה), אזכרי בעדינות שצריך להירשם.
- את לא חייבת להמליץ. רק כשזה טבעי.`;
}

/**
 * Lightweight retrieval gate — used by the chat route to decide whether to
 * even bother loading resources for this turn.
 */
export function shouldLoadResources(userMessage: string, recentSymptoms: string[] = []): boolean {
  if (userMessage.trim().length < 25) return false;
  return detectTopics(userMessage, recentSymptoms).length > 0;
}
