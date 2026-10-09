// 랜딩 스플릿: 화면을 Engineering / Literature 두 문으로 나누고, 가운데 × 구분선과 이름·제목을 겹쳐 보여줍니다.
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FiFeather, FiTerminal } from 'react-icons/fi';

import HeroTitle from '@/components/HeroTitle';
import { landing } from '@/data/landing';

type DoorKey = keyof typeof landing.doors;

const DOOR_ICONS: Record<DoorKey, IconType> = {
  engineering: FiTerminal,
  literature: FiFeather,
};

function Door({ doorKey }: { doorKey: DoorKey }) {
  const door = landing.doors[doorKey];
  const Icon = DOOR_ICONS[doorKey];

  return (
    <Link
      href={door.href}
      className={`landing-door landing-door--${doorKey}`}
      aria-label={`${door.label} 페이지로 이동`}
    >
      <span className="landing-door__content">
        <span className="landing-door__icon">
          <Icon aria-hidden="true" focusable="false" />
        </span>
        <span className="section-eyebrow">{door.label}</span>
        <span className="landing-door__tagline">{door.tagline}</span>
        <span className="landing-door__arrow" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  );
}

export default function LandingSplit() {
  return (
    <div className="landing">
      <div className="landing__intro">
        <p className="landing__name">{landing.name}</p>
        <HeroTitle text={landing.title} />
      </div>

      <nav className="landing-split" aria-label="페이지 선택">
        <Door doorKey="engineering" />
        <span className="landing-split__divider" aria-hidden="true">
          <span className="landing-split__cross">×</span>
        </span>
        <Door doorKey="literature" />
      </nav>
    </div>
  );
}
