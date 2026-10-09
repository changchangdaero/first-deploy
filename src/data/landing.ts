// 랜딩 문구: "/" 화면의 이름과 두 갈래 문(Engineering, Literature) 내용을 관리합니다.
import { todo } from '@/lib/todo';

export const landing = {
  name: 'Yoo Chang Min',
  title: 'Engineering × Literature Hybrid',
  doors: {
    engineering: {
      label: 'Engineering',
      href: '/engineering',
      tagline: todo('랜딩 Engineering 한 줄'),
    },
    literature: {
      label: 'Literature',
      href: '/literature',
      tagline: todo('랜딩 Literature 한 줄'),
    },
  },
};
