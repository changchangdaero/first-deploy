// 랜딩 문 2개: Engineering, Literature 페이지로 가는 두 갈래 카드를 보여줍니다.
import Link from 'next/link';

import { landing } from '@/data/landing';

const doorOrder = ['engineering', 'literature'] as const;

export default function LandingDoors() {
  return (
    <nav className="landing-doors" aria-label="페이지 선택">
      {doorOrder.map((key) => {
        const door = landing.doors[key];

        return (
          <Link key={key} href={door.href} className={`landing-door landing-door--${key}`}>
            <span className="section-eyebrow">{door.label}</span>
            <span className="landing-door__tagline">{door.tagline}</span>
            <span className="landing-door__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
