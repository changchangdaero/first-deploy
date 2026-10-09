// 출간물 목록: "/literature" Works 섹션에 표시할 책과 참여 작품을 관리합니다.
export type Work = {
  title: string;
  description: string;
  image: string;
  href: string;
  label: string;
};

export const works: Work[] = [
  {
    title: '사랑과 타박상',
    description: '포레스트웨일 출판사에서 출간했습니다.',
    label: 'Essay',
    image: '/love.png',
    href: 'https://product.kyobobook.co.kr/detail/S000214415930',
  },
  {
    title: '휘어진 숲길을 오래도록 걸었다',
    description: '<청춘의 미학>이라는 작품으로 참여했습니다.',
    label: 'Poetry',
    image: '/forest.png',
    href: 'https://product.kyobobook.co.kr/detail/S000203156852',
  },
  {
    title: '파도시집선 014<새벽>',
    description: '<해야 할 일>이라는 작품으로 참여했습니다.',
    label: 'Poetry',
    image: '/013.png',
    href: 'https://product.kyobobook.co.kr/detail/S000211708914',
  },
];
