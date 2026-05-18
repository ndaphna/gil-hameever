/**
 * Lightweight plain-text → HTML renderer for newsletter draft previews.
 *
 * The draft sanitizer in /api/admin/draft-newsletter strips Markdown headers
 * (#), bold (**), em-dashes (—) and stray asterisks before we ever see the
 * text, so this renderer only needs to handle:
 *   - paragraphs (separated by blank lines)
 *   - bullet lists (lines starting with "- ")
 *   - blockquotes (lines starting with "> ")
 * Everything else renders as plain text inside <p>, preserving emoji and RTL.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderPreviewHtml(text: string): string {
  if (!text.trim()) return '';
  const blocks = text.split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split('\n');
      const allBullets = lines.every((l) => /^\s*-\s+/.test(l));
      const allQuotes = lines.every((l) => /^\s*>\s+/.test(l));
      if (allBullets && lines.length > 0) {
        const items = lines
          .map((l) => `<li>${escapeHtml(l.replace(/^\s*-\s+/, ''))}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      if (allQuotes && lines.length > 0) {
        const inner = lines
          .map((l) => escapeHtml(l.replace(/^\s*>\s+/, '')))
          .join('<br />');
        return `<blockquote>${inner}</blockquote>`;
      }
      const inner = lines.map((l) => escapeHtml(l)).join('<br />');
      return `<p>${inner}</p>`;
    })
    .join('');
}
