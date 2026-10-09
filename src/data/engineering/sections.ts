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
  projectDetail: {
    back: 'Projects',
    facts: { period: '기간', team: '인원', role: '내 역할' },
    stack: '기술 스택',
    techChoices: '기술 선택 이유',
    architecture: '아키텍처',
    contributions: '내가 한 일',
    teamContext: '팀 맥락',
    troubleshooting: '트러블슈팅',
    troubleshootingSteps: { problem: '문제', cause: '원인', solution: '해결', result: '결과' },
    results: '결과',
    learnings: '배운 점',
    limitations: '한계',
    links: '링크',
    linkLabels: { github: 'GitHub', video: '시연 영상', slides: '발표 자료', demo: 'Demo' },
    previous: '이전 프로젝트',
    next: '다음 프로젝트',
  },
};
