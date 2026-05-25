'use client';

import { useEffect, useState } from 'react';
import styles from './SuggestionChips.module.css';

type Suggestion = { label: string; prompt: string };

type Props = {
  onPick: (prompt: string) => void;
};

// Hebrew topic → suggested chip label + opening prompt.
// The mapping intentionally mirrors symptom enums so memory.active_symptoms
// can be used directly.
const TOPIC_CHIPS: Record<string, Suggestion> = {
  hot_flashes:               { label: 'גלי חום',       prompt: 'יש לי גלי חום השבוע, מה כדאי לי לעשות?' },
  night_sweats:              { label: 'הזעות לילה',    prompt: 'אני מתעוררת באמצע הלילה רטובה. איך מתמודדים עם זה?' },
  sleep_issues:              { label: 'שינה',          prompt: 'השינה שלי לא טובה לאחרונה.' },
  insomnia:                  { label: 'שינה',          prompt: 'אני לא מצליחה להירדם בכלל.' },
  low_energy:                { label: 'תשישות',         prompt: 'אני מותשת לחלוטין השבוע.' },
  mood:                      { label: 'מצב רוח',       prompt: 'מצב הרוח שלי לא יציב לאחרונה.' },
  concentration_difficulty:  { label: 'ערפול מוחי',    prompt: 'יש לי קושי להתרכז ולזכור דברים.' },
  brain_fog:                 { label: 'ערפול מוחי',    prompt: 'יש לי קושי להתרכז ולזכור דברים.' },
  dryness:                   { label: 'יובש',          prompt: 'אני מתמודדת עם יובש, מה כדאי לי לדעת?' },
  pain:                      { label: 'כאבים',         prompt: 'יש לי כאבים שמופיעים יותר לאחרונה.' },
};

const FALLBACK_CHIPS: Suggestion[] = [
  { label: 'מה לעשות עכשיו', prompt: 'מאיפה את ממליצה לי להתחיל?' },
  { label: 'כלי לשינה',       prompt: 'יש לך כלי מהיר לשינה טובה יותר?' },
  { label: 'מה זה גיל המעבר', prompt: 'מה זה בעצם גיל המעבר ומה קורה לגוף שלי?' },
];

export function SuggestionChips({ onPick }: Props) {
  const [chips, setChips] = useState<Suggestion[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/aliza/memory')
      .then(r => r.ok ? r.json() : { memory: null })
      .then(j => {
        if (cancelled) return;
        const symptoms = (j?.memory?.active_symptoms ?? []) as string[];
        const seen = new Set<string>();
        const fromMemory: Suggestion[] = [];
        for (const s of symptoms) {
          const chip = TOPIC_CHIPS[s];
          if (chip && !seen.has(chip.label)) {
            fromMemory.push(chip);
            seen.add(chip.label);
            if (fromMemory.length === 3) break;
          }
        }
        const result = fromMemory.length > 0 ? fromMemory : FALLBACK_CHIPS;
        setChips(result.slice(0, 3));
      })
      .catch(() => setChips(FALLBACK_CHIPS));
    return () => { cancelled = true; };
  }, []);

  if (chips.length === 0) return null;

  return (
    <div className={styles.row} role="group" aria-label="הצעות לפתיחה">
      {chips.map(c => (
        <button
          key={c.label}
          type="button"
          className={styles.chip}
          onClick={() => onPick(c.prompt)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
