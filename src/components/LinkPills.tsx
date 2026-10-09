// 링크 버튼 묶음: 프로필 링크를 기존 social-link-pill 디자인으로 그리고, 주소가 빈 링크는 숨깁니다.
import Image from 'next/image';
import type { IconType } from 'react-icons';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { SiVelog } from 'react-icons/si';

import type { LinkIcon, ProfileLink } from '@/data/links';

const ICONS: Record<Exclude<LinkIcon, 'brunch'>, IconType> = {
  github: FaGithub,
  mail: FiMail,
  velog: SiVelog,
  instagram: FaInstagram,
};

function PillIcon({ icon }: { icon?: LinkIcon }) {
  if (!icon) {
    return null;
  }

  if (icon === 'brunch') {
    return (
      <Image
        src="/icons/brunch.svg"
        alt=""
        width={18}
        height={18}
        className="social-link-pill__image"
        aria-hidden="true"
      />
    );
  }

  const Icon = ICONS[icon];
  return <Icon className="social-link-pill__icon" aria-hidden="true" focusable="false" />;
}

export default function LinkPills({ items, label }: { items: ProfileLink[]; label: string }) {
  const visibleItems = items.filter((item) => item.href);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <nav className="hero-social-links" aria-label={label}>
      {visibleItems.map((item) => {
        const isExternal = item.href.startsWith('http');

        return (
          <a
            key={item.label}
            className="social-link-pill"
            href={item.href}
            aria-label={`${item.label} 링크 열기`}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            <PillIcon icon={item.icon} />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
