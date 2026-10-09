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

// 트러블슈팅: 문제 → 원인 → 해결 → 결과 순서로 적습니다. image는 이 항목의 증거 사진(선택)입니다.
export type ProjectTroubleshooting = {
  problem: string;
  cause: string;
  solution: string;
  result: string;
  image?: ProjectImage;
};

// 기술 선택 이유: 왜 이 기술을 골랐는지 1~2줄로 적습니다.
export type ProjectTechChoice = {
  tech: string;
  reason: string;
};

export type Project = {
  slug: string;
  tier: ProjectTier;
  status: ProjectStatus;
  title: string;
  summary: string;
  // 왜 만들었나 / 어떤 문제를 풀려고 했나 (선택)
  background?: string;
  context: string;
  period: string;
  team: string;
  role: string;
  stack: string[];
  techChoices?: ProjectTechChoice[];
  // 목록 메인 카드 이미지이자 상세 페이지 맨 위 대표 사진입니다.
  thumbnail?: string;
  architecture?: ProjectImage;
  contributions: string[];
  teamContext?: string;
  troubleshooting?: ProjectTroubleshooting[];
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
    summary: 'VM 4대로 구성한 3-tier 웹 서비스와 모니터링 환경 구성',
    background: '리눅스 운영 실무를 익히기 위한 과제',
    context: '코멘토 리눅스 운영 직무 부트캠프',
    period: '5주',
    team: '개인',
    role: '설계 · 구축 · 모니터링 전체',
    stack: ['VMware', 'Linux', 'Nginx', 'Node.js', 'PostgreSQL', 'Prometheus', 'node_exporter', 'Grafana', 'stress'],
    thumbnail: 'grafana-dashboard.png',
    architecture: {
      file: 'architecture.svg',
      caption: '사용자 → Nginx(web01) → Node.js(was01) → PostgreSQL(dbm01), mgt01의 Prometheus가 4대의 node_exporter 지표를 수집',
    },
    contributions: [
      '1주차 · VMware로 리눅스 VM 4대(web01 / was01 / dbm01 / mgt01) 생성, 저장소 · 호스트명 · 보안 설정',
      '2주차 · Nginx · Node.js · PostgreSQL 설치',
      '3주차 · 웹 → WAS → DB 3-tier 구조 구성 및 연동 (Nginx 리버스 프록시 경유)',
      '4주차 · Prometheus · Grafana로 4대 서버의 자원 지표 수집 및 시각화',
      '부하 실습 · stress로 부하를 주고 지표 변화 관찰',
      '단계마다 VM 스냅샷을 저장해 복구 지점 확보',
    ],
    metrics: [
      { label: 'stress 부하 중 web01 CPU', value: '72.86%' },
      { label: '같은 시점 나머지 3대 CPU', value: '3~5%' },
      { label: '모니터링 대상', value: '4대' },
    ],
    screenshots: [
      { file: 'db-via-proxy.jpg', caption: 'web01(Nginx) 주소로 접속해 WAS를 거쳐 DB 데이터를 조회 — 3-tier 전체 연동 확인' },
      { file: 'nginx-proxy.png', caption: 'web01(192.168.199.128)로 접속하면 Nginx가 Node.js(WAS)로 요청을 전달' },
      { file: 'vm-4-servers.png', caption: 'VM 4대 구축 후 각 서버의 외부 네트워크 연결 확인' },
    ],
    learnings: ['리버스 프록시로 백엔드를 숨기고 계층을 나눠 관리하는 이유를 직접 구성하며 확인했습니다.'],
    limitations: ['VM을 한 대씩 수동으로 구축했습니다. 규모가 커지면 Terraform 같은 IaC로 자동화가 필요합니다.'],
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

// 목록 순서 기준으로 이전/다음 프로젝트를 찾습니다. (상세 페이지 하단 이동용)
export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return {
    previous: index > 0 ? projects[index - 1] : undefined,
    next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}

export function projectImagePath(slug: string, file: string) {
  return `/projects/${slug}/${file}`;
}
