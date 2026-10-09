'use client';

// 랜딩 스플릿: 가운데 축(이름·×·세로선)을 기준으로 Engineering / Literature 두 문을 거울처럼 나눠 보여줍니다.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { FiFeather, FiTerminal } from 'react-icons/fi';

import { landing } from '@/data/landing';

type DoorKey = keyof typeof landing.doors;

const DOOR_ICONS: Record<DoorKey, IconType> = {
  engineering: FiTerminal,
  literature: FiFeather,
};

const CROSS = '×';
const SEGMENTS = [landing.doors.engineering.label, CROSS, landing.doors.literature.label];
const TOTAL_LENGTH = SEGMENTS.reduce((sum, segment) => sum + Array.from(segment).length, 0);

// 세 조각(Engineering → × → Literature)을 하나의 타자 흐름으로 이어서 칩니다.
function useTypedLength() {
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedLength(TOTAL_LENGTH);
      return;
    }

    if (typedLength >= TOTAL_LENGTH) {
      return;
    }

    const timeout = window.setTimeout(
      () => setTypedLength((current) => Math.min(current + 1, TOTAL_LENGTH)),
      typedLength === 0 ? 320 : 95,
    );

    return () => window.clearTimeout(timeout);
  }, [typedLength]);

  return typedLength;
}

function segmentProgress(typedLength: number, segmentIndex: number) {
  const offset = SEGMENTS.slice(0, segmentIndex).reduce((sum, segment) => sum + Array.from(segment).length, 0);
  const length = Array.from(SEGMENTS[segmentIndex]).length;
  const visible = Math.max(0, Math.min(typedLength - offset, length));
  const isTyping = typedLength >= offset && typedLength < offset + length;
  return { visible, isTyping };
}

function TypedWord({ text, visible, showCursor }: { text: string; visible: number; showCursor: boolean }) {
  return (
    <span className="landing-door__word" aria-hidden="true">
      <span className="hero-title__ghost">{text}</span>
      <span className="hero-title__typed">
        {Array.from(text).slice(0, visible).join('')}
        {showCursor ? <span className="hero-title__cursor" /> : null}
      </span>
    </span>
  );
}

function Door({ doorKey, typedLength, segmentIndex }: { doorKey: DoorKey; typedLength: number; segmentIndex: number }) {
  const door = landing.doors[doorKey];
  const Icon = DOOR_ICONS[doorKey];
  const { visible, isTyping } = segmentProgress(typedLength, segmentIndex);

  return (
    <Link
      href={door.href}
      className={`landing-door landing-door--${doorKey}`}
      aria-label={`${door.label} 페이지로 이동`}
    >
      <span className="landing-door__content">
        <TypedWord text={door.label} visible={visible} showCursor={isTyping} />
        <span className="landing-door__tagline">{door.tagline}</span>
        <span className="landing-door__meta" aria-hidden="true">
          <span className="landing-door__icon">
            <Icon focusable="false" />
          </span>
          <span className="landing-door__arrow">→</span>
        </span>
      </span>
    </Link>
  );
}

export default function LandingSplit() {
  const typedLength = useTypedLength();
  const isCrossVisible = segmentProgress(typedLength, 1).visible > 0;

  return (
    <div className="landing">
      <h1 className="sr-only">
        {landing.name} — {landing.doors.engineering.label} {CROSS} {landing.doors.literature.label}
      </h1>
      <p className="landing__name landing__name--stacked" aria-hidden="true">
        {landing.name}
      </p>

      <nav className="landing-split" aria-label="페이지 선택">
        <Door doorKey="engineering" typedLength={typedLength} segmentIndex={0} />
        <span className="landing-axis" aria-hidden="true">
          <span className="landing__name landing-axis__name">{landing.name}</span>
          <span className={isCrossVisible ? 'landing-axis__cross landing-axis__cross--visible' : 'landing-axis__cross'}>
            {CROSS}
          </span>
        </span>
        <Door doorKey="literature" typedLength={typedLength} segmentIndex={2} />
      </nav>
    </div>
  );
}
