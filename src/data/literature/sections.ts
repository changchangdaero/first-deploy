// Literature 섹션 문구: "/literature" 페이지의 섹션 제목과 설명을 관리합니다.
import { todo } from '@/lib/todo';

export const literatureSections = {
  meta: {
    title: 'Literature',
    description: todo('Literature 페이지 검색/공유 설명'),
  },
  about: {
    eyebrow: 'LITERATURE',
    title: 'About Me',
  },
  works: {
    eyebrow: 'WORKS',
    title: 'Works & Publications',
  },
  activities: {
    eyebrow: 'ACTIVITIES',
    title: 'Activities & Exhibition',
  },
};
