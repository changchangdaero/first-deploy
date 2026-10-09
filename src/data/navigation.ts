// 헤더 메뉴: 모든 페이지 상단 바에 Engineering 그룹과 Literature 그룹 메뉴를 나란히 정의합니다.
import { links } from '@/data/links';

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavGroup = {
  key: 'engineering' | 'literature';
  label: string;
  basePath: string;
  items: NavItem[];
};

// 주소가 빈 링크(예: 아직 없는 velog)는 메뉴에서 뺍니다.
function visible(items: NavItem[]) {
  return items.filter((item) => item.href);
}

export const navGroups: NavGroup[] = [
  {
    key: 'engineering',
    label: 'Engineering',
    basePath: '/engineering',
    items: visible([
      { label: 'About', href: '/engineering#about' },
      { label: 'Projects', href: '/engineering#projects' },
      { label: 'velog', href: links.velog, external: true },
    ]),
  },
  {
    key: 'literature',
    label: 'Literature',
    basePath: '/literature',
    items: visible([
      { label: 'About', href: '/literature#about' },
      { label: 'Works', href: '/literature#works' },
      { label: 'Activities', href: '/literature#activities' },
      { label: 'Brunch', href: links.brunch, external: true },
    ]),
  },
];
