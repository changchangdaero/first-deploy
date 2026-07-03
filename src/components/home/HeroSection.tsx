// 히어로 섹션: 첫 화면의 애니메이션 제목과 개인 링크 버튼을 보여줍니다.
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaInstagram, FaUser } from 'react-icons/fa';
import { MdArticle } from 'react-icons/md';
import type { IconType } from 'react-icons';

import HeroTitle from '@/components/HeroTitle';

type SocialLink = {
  label: string;
  href: string;
  icon?: IconType;
  iconSrc?: string;
};

// Edit links here
const socialLinks: SocialLink[] = [
  {
    label: 'Profile',
    href: 'https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&pkid=1&os=35402807&qvt=0&query=%EC%9C%A0%EC%B0%BD%EB%AF%BC',
    icon: FaUser,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/changchangdaero',
    icon: FaGithub,
  },
  {
    label: 'Blog',
    href: 'https://blog.naver.com/changchangdaero',
    icon: MdArticle,
  },
  {
    label: 'Brunch',
    href: 'https://brunch.co.kr/@changchangdaero',
    iconSrc: '/icons/brunch.svg',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/chang_y.u/',
    icon: FaInstagram,
  },
];

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function SocialLinkIcon({ link }: { link: SocialLink }) {
  if (link.icon) {
    const Icon = link.icon;
    return <Icon className="social-link-pill__icon" aria-hidden="true" focusable="false" />;
  }

  if (link.iconSrc) {
    return (
      <Image
        src={link.iconSrc}
        alt=""
        width={18}
        height={18}
        className="social-link-pill__image"
        aria-hidden="true"
      />
    );
  }

  return null;
}

function SocialLinkPill({ link }: { link: SocialLink }) {
  const content = (
    <>
      <SocialLinkIcon link={link} />
      <span>{link.label}</span>
    </>
  );

  if (link.href.startsWith('/')) {
    return (
      <Link className="social-link-pill" href={link.href} aria-label={`${link.label} 링크 열기`}>
        {content}
      </Link>
    );
  }

  return (
    <a
      className="social-link-pill"
      href={link.href}
      aria-label={`${link.label} 링크 열기`}
      target={isExternalHref(link.href) ? '_blank' : undefined}
      rel={isExternalHref(link.href) ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  );
}

export default function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <p className="section-eyebrow">chang chang daero</p>
      <HeroTitle text="Engineering × Literature Hybrid!" />

      <nav className="hero-social-links" aria-label="개인 링크">
        {socialLinks.map((link) => (
          <SocialLinkPill key={link.label} link={link} />
        ))}
      </nav>
    </section>
  );
}
