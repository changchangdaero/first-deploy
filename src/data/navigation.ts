// 섹션별 헤더 메뉴: Engineering, Literature 각 페이지의 네비게이션과 반대편 링크를 정의합니다.
import { links } from '@/data/links';

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type HeaderConfig = {
  brandHref: string;
  navItems: NavItem[];
  crossLink?: NavItem;
};

export const engineeringHeader: HeaderConfig = {
  brandHref: '/',
  navItems: [
    { label: 'About', href: '/engineering#about' },
    { label: 'Projects', href: '/engineering#projects' },
    ...(links.velog ? [{ label: 'velog', href: links.velog, external: true }] : []),
  ],
  crossLink: { label: 'Literature', href: '/literature' },
};

export const literatureHeader: HeaderConfig = {
  brandHref: '/',
  navItems: [
    { label: 'About', href: '/literature#about' },
    { label: 'Works', href: '/literature#works' },
    { label: 'Activities', href: '/literature#activities' },
  ],
  crossLink: { label: 'Engineering', href: '/engineering' },
};

export const landingHeader: HeaderConfig = {
  brandHref: '/',
  navItems: [],
};
