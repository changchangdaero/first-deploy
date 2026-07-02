'use client';

// 히어로 애니메이션 제목: 랜딩 화면 히어로에서 쓰는 타자 효과 제목입니다.
import { useEffect, useState } from 'react';

type HeroTitleProps = {
  text: string;
};

export default function HeroTitle({ text }: HeroTitleProps) {
  const [visibleLength, setVisibleLength] = useState(0);
  const characters = Array.from(text);
  const isComplete = visibleLength >= characters.length;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisibleLength(characters.length);
      return;
    }

    if (visibleLength >= characters.length) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setVisibleLength((currentLength) => Math.min(currentLength + 1, characters.length));
      },
      visibleLength === 0 ? 320 : 95,
    );

    return () => window.clearTimeout(timeout);
  }, [characters.length, visibleLength]);

  return (
    <h1 className="hero-title" aria-label={text}>
      <span className="hero-title__ghost" aria-hidden="true">
        {text}
      </span>
      <span className="hero-title__typed" aria-hidden="true">
        {characters.slice(0, visibleLength).join('')}
        <span className={isComplete ? 'hero-title__cursor hero-title__cursor--done' : 'hero-title__cursor'} />
      </span>
    </h1>
  );
}
