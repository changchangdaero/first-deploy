// Engineering 프로필: "/engineering" About 섹션의 사진, 소개, 이력, 링크를 관리합니다.
import { links, type ProfileLink } from '@/data/links';

export const engineeringProfile = {
  name: '유창민',
  // 사진 경로. 지금은 Literature와 같은 사진이며, 교체하려면 경로만 바꾸면 됩니다. 비워두면 사진 영역이 숨겨집니다.
  image: '/me.jpg',
  headline: 'AI를 이해하는 DEVOPS 엔지니어가 되고 싶습니다!',
  summary: '',
  highlights: [
    '명지대학교 정보통신공학 & 인공지능·ICT융합전공',
    'LG CNS AM INSPIRE CAMP 3기 DevOps 과정 수료',
    'Comento Linux 운영 직무 부트캠프 수료',
    '교내 AI 학술동아리 ORCA 1기 부원',
    '교내 1인 창업동아리 선정 (창창대로)',
  ],
  links: [
    { label: 'GitHub', icon: 'github', href: links.github },
    { label: 'Blog', icon: 'velog', href: links.velog, keepWhenEmpty: true },
  ] satisfies ProfileLink[],
};
