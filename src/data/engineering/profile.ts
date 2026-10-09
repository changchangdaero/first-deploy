// Engineering 프로필: "/engineering" About 섹션의 사진, 소개, 이력, 기술 스택, 링크를 관리합니다.
import { links, type ProfileLink } from '@/data/links';
import { todo } from '@/lib/todo';

export const engineeringProfile = {
  name: '유창민',
  // 사진 경로 (예: '/engineering/profile.jpg'). 비워두면 사진 영역이 숨겨집니다.
  image: '',
  headline: todo('Engineering 한 줄 소개'),
  summary: '',
  highlights: [
    '명지대학교 정보통신공학 & 인공지능·ICT융합전공',
    'LG CNS AM INSPIRE CAMP 3기 DevOps 과정 수료',
    '코멘토 리눅스 운영 직무 부트캠프 수료',
    '정보처리기사 필기 합격',
    '교보문고 주간베스트 에세이 저자 (출간 작가)',
  ],
  stack: ['Linux', 'Docker', 'Jenkins', 'Prometheus', 'Grafana', 'Nginx', 'PostgreSQL', 'AWS'],
  links: [
    { label: 'GitHub', icon: 'github', href: links.github },
    { label: 'Email', icon: 'mail', href: links.email ? `mailto:${links.email}` : '' },
    { label: 'velog', icon: 'velog', href: links.velog },
  ] satisfies ProfileLink[],
};
