// 프로젝트 데이터: "/engineering" 목록과 "/engineering/projects/[slug]" 상세 페이지의 내용을 관리합니다.
// 이미지는 public/projects/[slug]/ 폴더에 넣고 file에 파일명만 적습니다. 파일이 없으면 자동으로 숨겨집니다.
import { todo } from '@/lib/todo';

export type ProjectStatus = 'done' | 'wip';
export type ProjectTier = 'main' | 'sub';

export type ProjectImage = {
  file: string;
  caption: string;
};

export type ProjectMetric = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  tier: ProjectTier;
  status: ProjectStatus;
  title: string;
  summary: string;
  context: string;
  period: string;
  team: string;
  role: string;
  stack: string[];
  thumbnail?: string;
  architecture?: ProjectImage;
  contributions: string[];
  teamContext?: string;
  metrics?: ProjectMetric[];
  screenshots?: ProjectImage[];
  learnings?: string[];
  limitations?: string[];
  links?: {
    github?: string;
    video?: string;
    slides?: string;
    demo?: string;
  };
  award?: string;
};

export const projects: Project[] = [
  {
    slug: '3tier-monitoring',
    tier: 'main',
    status: 'done',
    title: '3-tier 인프라 구축 및 모니터링',
    summary: todo('3-tier 프로젝트 한 줄 요약'),
    context: '코멘토 리눅스 운영 직무 부트캠프',
    period: '5주',
    team: todo('인원'),
    role: todo('역할'),
    stack: ['Linux', 'Nginx', 'Node.js', 'PostgreSQL', 'Prometheus', 'Grafana', 'stress'],
    thumbnail: 'monitoring.png',
    contributions: [
      'VM 4대(mgt/web/was/db)에 nginx · Node.js · PostgreSQL 3-tier 구성 및 연동',
      'Prometheus · Grafana 모니터링 대시보드 구축',
      'stress 부하 테스트',
    ],
    screenshots: [{ file: 'monitoring.png', caption: todo('스크린샷 설명') }],
  },
  {
    slug: 'jenkins-ci',
    tier: 'main',
    status: 'done',
    title: 'Jenkins 기반 CI 파이프라인',
    summary: todo('Jenkins CI 프로젝트 한 줄 요약'),
    context: 'LG CNS AM INSPIRE CAMP 3기 · 미니 프로젝트 2차',
    period: todo('기간'),
    team: '7명',
    role: 'Jenkins CI 담당',
    stack: ['Jenkins', 'Docker', 'Docker Hub', 'GitHub'],
    contributions: [
      'Jenkins 빌드 → Docker 이미지 패키징 → Docker Hub push로 이어지는 CI 파이프라인 구축',
      '세 세부팀 결과를 통합한 발표 자료 제작 및 발표',
    ],
    teamContext:
      '웹사이트 MVP를 만든 뒤 3개 세부팀(nGrinder 부하 테스트 / Jenkins CI / GitHub Actions CI)으로 나누어 진행했습니다. nGrinder 부하 테스트와 GitHub Actions CI는 다른 팀원이 담당했습니다.',
    limitations: ['CI까지 완료했고, CD는 다음 단계로 계획했습니다.'],
  },
  {
    slug: 'alertlens',
    tier: 'main',
    status: 'wip',
    title: 'AlertLens',
    summary: '실행 중 경보 라벨 이상의 위치 진단과 묶기 민감도 분석 시스템',
    context: '캡스톤디자인',
    period: todo('기간'),
    team: '개인',
    role: todo('역할'),
    stack: ['Prometheus', 'Alertmanager', 'Docker Compose'],
    contributions: ['Docker Compose 기반 Prometheus + Alertmanager testbed 구성'],
  },
  {
    slug: 'sentistock',
    tier: 'sub',
    status: 'done',
    title: 'SentiStock',
    summary: '뉴스 감성 분석 기반 주식 투자 판단 보조 플랫폼',
    context: 'LG CNS AM INSPIRE CAMP 3기 · 최종 팀 프로젝트',
    period: todo('기간'),
    team: '7명',
    role: todo('역할'),
    stack: ['Python', 'React', 'Next.js', 'Spring Boot', 'MariaDB', 'Docker', 'Jenkins', 'AWS'],
    contributions: [
      '네이버 뉴스 크롤링 파이프라인 구축 (Python)',
      '마이페이지 UI 개발 및 API 연동',
      'WBS · 요구사항 정의서 작성',
      '최종 시연 영상 제작',
    ],
    award: '우수상 (5팀 중 3등)',
  },
  {
    slug: 'wafer-defect',
    tier: 'sub',
    status: 'done',
    title: 'WM-811K 웨이퍼 결함 분류',
    summary: '결함 클래스 난이도 기반 증강으로 클래스 불균형 해소',
    context: '캡스톤디자인 · IC-PBL 기업연계',
    period: todo('기간'),
    team: '2명',
    role: todo('역할'),
    stack: ['Python', 'PyTorch', 'CFG-DDPM', 'MobileNet'],
    contributions: [todo('내가 한 일')],
    metrics: [{ label: 'F2-score', value: '0.8647 → 0.8947' }],
    limitations: ['난이도 계산 수식이 휴리스틱이라 신뢰성이 부족합니다.'],
  },
  {
    slug: 'hami',
    tier: 'sub',
    status: 'wip',
    title: '햄이 (Hami)',
    summary: '자연어로 대화하며 일정 관리하는 데스크톱 펫 앱',
    context: '개인 토이 프로젝트',
    period: todo('기간'),
    team: '개인',
    role: todo('역할'),
    stack: ['Electron', 'React', 'TypeScript'],
    contributions: [todo('내가 한 일')],
  },
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  done: '완료',
  wip: '진행 중',
};

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function projectImagePath(slug: string, file: string) {
  return `/projects/${slug}/${file}`;
}
