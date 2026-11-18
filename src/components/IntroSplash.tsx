import React, { useEffect, useRef, useState } from 'react';
import { markIntroSeen } from '../lib/intro';

/*
 * Welcome animation (about 2.4 s): "Welcome" / logo / "to the DAD Lab" fade in
 * at the centre, the text fades out, then the logo flies to the header logo's
 * spot and the overlay fades away. Only `opacity` and `transform` are
 * animated, so browsers run it on the compositor and it stays smooth on
 * low-end devices. A click, tap or key press skips it.
 */

type Phase = 'enter' | 'show' | 'textOut' | 'fly' | 'done';

// Milliseconds from mount at which each phase starts.
const TIMELINE: [Phase, number][] = [
  ['show', 30],
  ['textOut', 1250],
  ['fly', 1550],
  ['done', 2400],
];

/** The header logo marks itself with this attribute; it stays hidden until the flying logo lands. */
export const HEADER_LOGO_ATTR = 'data-header-logo';

interface IntroSplashProps {
  logoUrl: string;
  labName: string;
  shortTitle: string;
  onDone: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ logoUrl, labName, shortTitle, onDone }) => {
  const [phase, setPhase] = useState<Phase>('enter');
  const [flight, setFlight] = useState('');
  const logoRef = useRef<HTMLImageElement>(null);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase('done');
    onDone();
  };

  useEffect(() => {
    markIntroSeen();
    const root = document.documentElement;
    root.setAttribute('data-intro', 'playing');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timers = TIMELINE.map(([next, at]) =>
      window.setTimeout(() => {
        if (next === 'done') return finish();
        if (next === 'fly') {
          // Measure where the header logo sits now (layout may differ by screen size).
          const target = document.querySelector(`[${HEADER_LOGO_ATTR}]`)?.getBoundingClientRect();
          const source = logoRef.current?.getBoundingClientRect();
          if (target && source && target.width > 0 && source.width > 0) {
            const dx = target.left + target.width / 2 - (source.left + source.width / 2);
            const dy = target.top + target.height / 2 - (source.top + source.height / 2);
            setFlight(`translate3d(${dx}px, ${dy}px, 0) scale(${target.width / source.width})`);
          }
        }
        setPhase(next);
      }, at),
    );

    const skip = () => finish();
    window.addEventListener('keydown', skip);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('keydown', skip);
      root.removeAttribute('data-intro');
      document.body.style.overflow = previousOverflow;
    };
    // Runs once per play.
  }, []);

  if (phase === 'done') return null;

  const textVisible = phase === 'show';
  const flying = phase === 'fly';

  return (
    <div
      className={`intro-splash ${flying ? 'intro-splash--leaving' : ''}`}
      onClick={finish}
      aria-hidden="true"
      data-phase={phase}
    >
      <div className="intro-splash__backdrop" />
      <div className="intro-splash__stack">
        <p className={`intro-splash__text intro-splash__text--top ${textVisible ? 'is-visible' : ''}`}>Welcome</p>
        <img
          ref={logoRef}
          src={logoUrl}
          alt=""
          width={160}
          height={160}
          decoding="async"
          className={`intro-splash__logo ${phase !== 'enter' ? 'is-visible' : ''}`}
          style={flying && flight ? { transform: flight } : undefined}
        />
        <p className={`intro-splash__text intro-splash__text--bottom ${textVisible ? 'is-visible' : ''}`}>
          to the {shortTitle || labName}
        </p>
      </div>
    </div>
  );
};
