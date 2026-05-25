/**
 * Aliza chatbot guardrails.
 *
 * Three concerns:
 *   1. Hard content rules (system-prompt level) — what Aliza must never say.
 *   2. Output sanitation (post-model regex) — strip banned typography.
 *   3. Medical red-flag detection — when the woman mentions clinical content,
 *      ensure a doctor-disclaimer line is appended.
 *
 * Mirrors the rules used in the newsletter draft pipeline so chat output and
 * newsletter copy stay typographically and ethically aligned.
 */

export const ALIZA_HARD_RULES = `חוקים קשים שלא ניתן להפר:
1. אסור לתת ייעוץ רפואי, תרופתי, או דיאגנוזה. את לא רופאה.
2. אם המשתמשת מתארת תסמין משמעותי, ערך בדיקה, או שאלת מינון, הפני בעדינות לרופא/ת נשים, מרפאת גיל מעבר, או רופא משפחה.
3. אסור להמליץ דיאטות, מספרי קלוריות, צומות, או הגבלות אכילה ספציפיות.
4. אסור מספרים מדויקים על תרופות, מינונים, או תופעות לוואי. אם נשאלת, ענה שזה ענין לרופאה.
5. אסור מקפים ארוכים בטקסט (לא — ולא –). להשהיה או הפרדה, פסיק, נקודה, או סוגריים בלבד.
6. אסור כוכביות להדגשת טקסט (לא ** ולא *). כל המילים כטקסט רגיל. הדגשה דרך מבנה משפט.
7. אסור סימני Markdown לכותרות (#, ##, ###). הפרדה בין סעיפים דרך שורה ריקה בלבד.
8. אסור קלישאות שטחיות ("תני לעצמך זמן", "תקשיבי לגוף", "כל גוף שונה", "תהיי טובה לעצמך", "הכל יעבור"). אם בכל זאת רוצים, חברי תמיד לפעולה ספציפית או מנגנון ביולוגי.
9. אל תמציאי מחקרים, ציטוטים, או מספרים. אם לא בטוחה, דלגי בשתיקה.
10. דברי בגוף ראשון נקבה (אני, שלי). פני אל המשתמשת בגוף שני נקבה (את, שלך).
11. את עליזה, האלטר אגו של ענבל. את לא ענבל. ענבל היא האישה האמיתית מאחורי העסק, את הדמות שמדברת איתה. כשמצטטים את ענבל, מצטטים בגוף שלישי ("ענבל כותבת ש...").
12. אסור לחתום בשם "ענבל", "באהבה ענבל", "חיבוק ענבל", "ענבל ועליזה", או כל וריאציה. בצ'אט לא חותמים בכלל.
13. אסור לפנות למשתמשת במילה "חברה" כפנייה כללית. אם יש שם, השתמשי בשם. אם אין שם, פני בלי כינוי או בטקסט טבעי ("היי", "אני שומעת").
14. עברית טבעית של דוברת ישראלית, לא עברית מתורגמת מאנגלית. אסור אנגליציזמים מילוליים. דוגמאות:
    - לא "לא כלום מפואר" (nothing fancy) → כן "לא משהו מורכב" / "לא משהו מוגזם" / "משהו פשוט"
    - לא "זה עושה שני דברים" (it does two things) → כן "זה תורם משני כיוונים" / "זה עוזר בשתי דרכים"
    - לא "תיקחי את זה לקלינאית" (take it to your doctor) → כן "הביאי את זה לרופאה"
    - לא "להישאר על המסלול" (stay on track) → כן "להתמיד" / "לא להתפזר"
    - לא "הכלי שעוזר לי לשמוע עליו הכי הרבה" (mixed pattern) → כן "הכלי שיוצא לי לשמוע עליו הכי הרבה" (אם השומעת היא את) או "הכלי שעוזר לי הכי הרבה" (אם הכלי עוזר לך). אסור לערבב בין שני המבנים.
    כשמתלבטים, לחשוב: "ככה אישה ישראלית בת 50 הייתה מנסחת את זה?".`;

/**
 * Strip banned typography from Aliza's raw output.
 *   - em-dash / en-dash → ", "
 *   - **bold** / *emphasis* → plain
 *   - markdown headings (#, ##, ###) → plain text
 *   - cleanup of comma artifacts
 */
export function sanitizeAlizaOutput(text: string): string {
  return text
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\*\*([^*\n]+?)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+?)\*([^*]|$)/g, '$1$2$3')
    .replace(/, ,/g, ',')
    .replace(/[ \t]+,/g, ',')
    // Strip Inbal-as-author sign-offs that leak from the corpus.
    // Catches: "באהבה, ענבל", "חיבוק, ענבל 💗", "שלך, ענבל", "ענבל ועליזה",
    // "ענבל 💗" on its own line, "באהבה רבה, ענבל ועליזה" etc.
    .replace(/\n+\s*(באהבה(\s+רבה)?|חיבוק|שלך|אוהבת|מחבקת|בברכה)?[,\s]*ענבל(\s*ועליזה)?\s*[💗💜🩷❤️🌸✨💕💖]*\s*$/g, '')
    .replace(/\n+\s*ענבל(\s*ועליזה)?\s*[💗💜🩷❤️🌸✨💕💖]+\s*$/g, '')
    // Also catch sign-off that starts with "עליזה ענבל" or "ענבל" alone on a line at end.
    .replace(/\n+\s*ענבל\s*$/g, '')
    .trim();
}

/**
 * Detect clinical / medical-decision language in the woman's message.
 * Triggers an auto-appended doctor disclaimer if Aliza's response doesn't
 * already mention seeing a doctor.
 *
 * Heuristic only — wide net, false-positives are fine (better safe).
 */
const MEDICAL_KEYWORDS = [
  // Hormone therapy & meds
  'הורמונל', 'אסטרוגן', 'פרוגסטרון', 'טסטוסטרון', 'HRT', 'תחליפ', 'גלולה',
  'תרופה', 'תרופות', 'תרופת', 'מינון', 'מ"ג', 'מג ', 'מיליגרם',
  // Lab values
  'בדיקת דם', 'בדיקות דם', 'הורמון', 'ערכי', 'TSH', 'FSH', 'אסטרדיול',
  'כולסטרול', 'סוכר', 'תפקודי כבד', 'תפקודי בלוטה',
  // Symptoms that warrant escalation
  'דימום', 'גוש', 'גושים', 'כאבים חזקים', 'כאב חזק', 'מצב חירום',
  'אבדנ', 'אובדנ', 'דיכאון', 'התקפי חרדה',
  // Direct medical questions
  'האם לקחת', 'כדאי לקחת', 'מה לקחת', 'איזו תרופה', 'איזה מינון',
  'אבחנ', 'דיאגנוז',
];

export function hasMedicalRedFlags(userMessage: string): boolean {
  const normalized = userMessage.toLowerCase();
  return MEDICAL_KEYWORDS.some(kw => normalized.includes(kw.toLowerCase()));
}

export const MEDICAL_DISCLAIMER =
  'חשוב לי להגיד: אני לא רופאה. השיחה הזאת לא תחליף ייעוץ רפואי. בנושאים כאלה, כדאי להתייעץ עם רופאת נשים, מרפאת גיל מעבר, או רופאת המשפחה שלך.';

/**
 * Append the medical disclaimer to the response if the user's message had
 * red flags AND the response doesn't already reference a doctor.
 */
export function maybeAppendDisclaimer(userMessage: string, response: string): string {
  if (!hasMedicalRedFlags(userMessage)) return response;
  const alreadyReferencesDoctor = /רופא|מרפא|ייעוץ רפואי/.test(response);
  if (alreadyReferencesDoctor) return response;
  return `${response}\n\n${MEDICAL_DISCLAIMER}`;
}
