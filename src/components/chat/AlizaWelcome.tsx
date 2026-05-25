'use client';

import { useEffect, useState } from 'react';
import { AlizaAvatar } from './AlizaAvatar';
import { parseMood, type AlizaMood } from '@/lib/aliza/avatars';
import styles from './AlizaWelcome.module.css';

const CACHE_KEY = 'aliza_welcome_v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type WelcomeData = { text: string; mood: AlizaMood; cachedAt: number };

export function AlizaWelcome() {
  const [data, setData] = useState<WelcomeData | null>(null);

  useEffect(() => {
    // Try cache first.
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as WelcomeData;
        if (parsed.cachedAt && Date.now() - parsed.cachedAt < CACHE_TTL_MS) {
          setData(parsed);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    // Fetch fresh.
    let cancelled = false;
    fetch('/api/chat/welcome')
      .then(r => r.ok ? r.json() : { text: 'היי. אני עליזה, האלטר אגו של ענבל. איך את היום?', mood: 'greeting' })
      .then(j => {
        if (cancelled) return;
        const fresh: WelcomeData = {
          text: j.text,
          mood: parseMood(j.mood),
          cachedAt: Date.now(),
        };
        setData(fresh);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(fresh)); } catch { /* ignore */ }
      })
      .catch(() => {
        if (!cancelled) {
          setData({ text: 'היי. אני עליזה, האלטר אגו של ענבל. איך את היום?', mood: 'greeting', cachedAt: Date.now() });
        }
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className={styles.welcome} aria-label="ברכת פתיחה של עליזה">
      <AlizaAvatar mood={data?.mood ?? 'greeting'} state="listening" size="xl" alt="עליזה" />
      <div className={styles.bubble}>
        {data ? (
          <p className={styles.text}>{data.text}</p>
        ) : (
          <p className={styles.skeleton} aria-hidden="true">⌛</p>
        )}
      </div>
    </section>
  );
}
