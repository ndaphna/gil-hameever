'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AVATAR_BY_MOOD, avatarVideoPath, type AlizaMood } from '@/lib/aliza/avatars';
import styles from './AlizaAvatar.module.css';

type Props = {
  mood?: AlizaMood;
  state?: 'idle' | 'speaking' | 'listening';
  size?: 'xs' | 'sm' | 'md' | 'xl';
  alt?: string;
};

const SIZE_PX: Record<NonNullable<Props['size']>, number> = {
  xs: 32,
  sm: 48,
  md: 80,
  xl: 160,
};

/**
 * Aliza avatar with three states:
 *  - idle: static illustration matched to mood (default)
 *  - listening: subtle breathing pulse via CSS
 *  - speaking: tries to play a video loop at /aliza/speaking/<mood>.mp4;
 *              falls back to CSS pulse if the video doesn't exist.
 *
 * Respects prefers-reduced-motion: pinned to idle when set.
 */
export function AlizaAvatar({ mood = 'default', state = 'idle', size = 'sm', alt = 'עליזה' }: Props) {
  const px = SIZE_PX[size];
  const stillSrc = AVATAR_BY_MOOD[mood];
  const videoSrc = avatarVideoPath(mood);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const wantsVideo = state === 'speaking' && !reducedMotion && !videoFailed;

  const stateClass =
    state === 'speaking' ? styles.speaking :
    state === 'listening' ? styles.listening :
    styles.idle;

  return (
    <div
      className={`${styles.avatar} ${stateClass}`}
      style={{ width: px, height: px }}
      aria-label={alt}
    >
      {wantsVideo && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          className={styles.video}
          width={px}
          height={px}
        />
      )}
      {!wantsVideo && (
        <Image
          src={stillSrc}
          alt={alt}
          width={px}
          height={px}
          className={styles.image}
          priority={size === 'xl'}
        />
      )}
    </div>
  );
}
