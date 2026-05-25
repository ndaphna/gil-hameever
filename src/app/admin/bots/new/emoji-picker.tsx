'use client';

import { useEffect, useRef, useState } from 'react';
import { Smile } from 'lucide-react';
import styles from './new.module.css';

// Curated set — warm, feminine, supportive vibe matching Inbal's voice.
// Grouped visually but flat for keyboard tab order.
const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: 'אהבה ותמיכה',
    emojis: ['💜', '💖', '💕', '💗', '💓', '🌸', '🌷', '🌹', '🌺', '🌻', '✨', '🌟', '💫'],
  },
  {
    label: 'חיבוקים ופנים',
    emojis: ['🤗', '🥰', '😊', '😌', '🙂', '😉', '😅', '🙏', '👋', '💁‍♀️', '🙋‍♀️'],
  },
  {
    label: 'גוף ובריאות',
    emojis: ['🧘‍♀️', '🧠', '💪', '🌿', '🍵', '🌱', '☕', '🛌', '🌙', '☀️', '🌈'],
  },
  {
    label: 'הצבעות וסימונים',
    emojis: ['👇', '👆', '👉', '👈', '✅', '⭐', '🔥', '🎁', '📖', '💡', '🎯'],
  },
];

const ALL_EMOJIS = EMOJI_GROUPS.flatMap((g) => g.emojis);

export default function EmojiPicker({
  onPick,
}: {
  onPick: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div ref={wrapRef} className={styles.emojiPickerWrap}>
      <button
        type="button"
        className={styles.emojiToggleBtn}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="הוסף אימוג'י"
      >
        <Smile size={14} />
        אימוג'י
      </button>
      {open && (
        <div className={styles.emojiPanel} role="dialog" aria-label="בחירת אימוג'י">
          {EMOJI_GROUPS.map((group) => (
            <div key={group.label} className={styles.emojiGroup}>
              <div className={styles.emojiGroupLabel}>{group.label}</div>
              <div className={styles.emojiGrid}>
                {group.emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    className={styles.emojiBtn}
                    onClick={() => {
                      onPick(e);
                      setOpen(false);
                    }}
                    aria-label={`הוסף ${e}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Helper to insert text at the textarea's cursor position.
 * Returns the new value and the new cursor position.
 */
export function insertAtCursor(
  textarea: HTMLTextAreaElement | null,
  current: string,
  text: string,
): { value: string; cursor: number } {
  if (!textarea) {
    return { value: current + text, cursor: (current + text).length };
  }
  const start = textarea.selectionStart ?? current.length;
  const end = textarea.selectionEnd ?? current.length;
  const value = current.slice(0, start) + text + current.slice(end);
  return { value, cursor: start + text.length };
}

export { ALL_EMOJIS };
