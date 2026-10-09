// 헤더 메뉴: 모든 페이지 상단 바에 Engineering 그룹과 Literature 그룹 메뉴를 나란히 정의합니다.
export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavGroup = {
  key: 'engineering' | 'literature';
  label: string;
  // 이 경로들(하위 경로 포함)에 있을 때 해당 그룹을 현재 그룹으로 강조합니다.
  paths: string[];
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    key: 'engineering',
    label: 'Engineering',
    paths: ['/engineering', '/archive'],
    items: [
      { label: 'About', href: '/engineering#about' },
      { label: 'Projects', href: '/engineering#projects' },
      { label: 'Tech Stack', href: '/engineering#tech-stack' },
      { label: 'Archive', href: '/archive' },
    ],
  },
  {
    key: 'literature',
    label: 'Literature',
    paths: ['/literature'],
    items: [
      { label: 'About', href: '/literature#about' },
      { label: 'Works', href: '/literature#works' },
      { label: 'Activities', href: '/literature#activities' },
    ],
  },
];
