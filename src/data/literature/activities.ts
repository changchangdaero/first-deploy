// 문학 활동 목록: "/literature" Activities 섹션에 표시할 서포터즈, 전시 이력을 관리합니다.
export type LiteratureActivity = {
  title: string;
  description: string;
  image: string;
  label: string;
  year: string;
};

export const activities: LiteratureActivity[] = [
  {
    title: '인디펍 독립출판 서포터즈',
    description: '독립출판 플랫폼 인디펍의 도서들을 읽고 블로그에 서평을 작성했습니다.',
    label: 'Supporters',
    year: '2024',
    image: '/indiepub-supporters.png',
  },
  {
    title: '딥앤와이드 출판사 서포터즈 9기',
    description: '딥앤와이드 출판사의 신간들을 읽고 서평 작성 및 SNS 홍보를 진행하였습니다.',
    label: 'Supporters',
    year: '2025',
    image: '/deep-and-wide-supporters.png',
  },
  {
    title: '빈칸 <낮과 밤> 글 전시',
    description: "복합문화공간 '빈칸'에서 개최한 글 전시에 참여하였습니다.",
    label: 'Exhibition',
    year: '2024',
    image: '/binkan-day-and-night.png',
  },
];
