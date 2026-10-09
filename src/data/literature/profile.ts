// Literature 프로필: "/literature" About 섹션의 사진, 소개, 이력, 링크를 관리합니다.
import { links, type ProfileLink } from '@/data/links';
import { todo } from '@/lib/todo';

export const literatureProfile = {
  name: '유창민',
  // 사진 경로. 비워두면 사진 영역이 숨겨집니다.
  image: '/me.jpg',
  headline: todo('Literature 한 줄 소개'),
  summary: '',
  highlights: [
    '교보문고 시·에세이 분야 주간베스트 도서 [사랑과 타박상] 저자',
    '공저 시집 2권 참여',
    '브런치스토리 작가',
    '한국예술인복지재단 신진예술인',
    '인디펍 · 딥앤와이드 출판사 서포터즈',
    '트라아트(빈칸) 글 전시회 <낮과밤> 참여',
  ],
  links: [
    { label: 'Brunch', icon: 'brunch', href: links.brunch },
    { label: 'Instagram', icon: 'instagram', href: links.instagram },
  ] satisfies ProfileLink[],
};
