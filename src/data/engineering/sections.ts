// Engineering 섹션 문구: "/engineering" 페이지의 섹션 제목과 설명을 관리합니다.
import { todo } from '@/lib/todo';

export const engineeringSections = {
  meta: {
    title: 'Engineering',
    description: todo('Engineering 페이지 검색/공유 설명'),
  },
  about: {
    eyebrow: 'ENGINEERING',
    title: 'About Me',
  },
  techStack: {
    eyebrow: 'SKILLS',
    title: 'Tech Stack',
  },
  projects: {
    eyebrow: 'PROJECTS',
    title: "What I've Built",
    description: todo('Projects 섹션 소개'),
    mainLabel: 'Main Projects',
    subLabel: 'More Projects',
  },
};
