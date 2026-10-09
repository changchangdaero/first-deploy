export type ProjectStatus = 'done' | 'wip' | 'planned';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  thumbnail?: string;
  highlight?: string;
  links?: { github?: string; demo?: string };
}

export const PROJECTS: Project[] = [
  {
    id: 'ha-infra',
    title: 'HA 인프라 & 이상탐지 대시보드',
    subtitle: 'k3s 기반 고가용성 인프라에 AI 이상탐지를 얹은 SaaS 대시보드',
    description: 'k3s로 HA 클러스터를 구성하고, LSTM 오토인코더로 메트릭 이상을 탐지해 자동 스케일링과 장애 복구를 트리거한다. AI 감지 → 파드 종료·복구 → 노드 페일오버로 이어지는 3막 데모로 복원력을 증명한다.',
    stack: ['k3s', 'Terraform', 'LSTM', 'Next.js', 'Prometheus'],
    status: 'planned',
    highlight: 'AI-triggered scaling · self-healing · node failover',
  },
  {
    id: 'onprem-3tier',
    title: '온프렘 3-Tier + 모니터링 스택',
    subtitle: 'RHEL9 4-VM으로 구축한 Web–WAS–DB 3계층과 관측 스택',
    description: 'VMware에 RHEL9 VM 4대를 세워 nginx–Node.js–PostgreSQL 3-tier를 직접 구성·연동하고, nginx 리버스 프록시로 트래픽을 흘렸다. Prometheus·Grafana로 4개 노드를 실시간 관측하고 부하 테스트로 임계 반응까지 확인했다.',
    stack: ['RHEL9', 'nginx', 'PostgreSQL', 'Prometheus', 'Grafana'],
    status: 'done',
    thumbnail: '/projects/monitoring.png',
    highlight: '4-node 3-tier 구축 · reverse proxy · 실시간 모니터링',
  },
  {
    id: 'hami-pet',
    title: '햄이 — Desktop Pet Scheduler',
    subtitle: '데스크톱 햄스터 펫이 함께하는 캘린더·집중 관리 앱',
    description: 'Electron + React + TypeScript로 만든 데스크톱 앱. 커스텀 월간 캘린더, 포모도로 타이머, 다이어리, 물·스트레칭 리마인더를 담았고, 9종 스프라이트로 살아있는 펫을 구현했다. BYOK 구조라 API 키 없이도 핵심 기능이 동작한다.',
    stack: ['Electron', 'React', 'TypeScript', 'Gemini API'],
    status: 'done',
    highlight: 'BYOK 설계 · 9-state 스프라이트 · 배포 완료',
  },
  {
    id: 'wafer-defect',
    title: '웨이퍼 표면 결함 분류',
    subtitle: 'MobileNet 기반 반도체 웨이퍼 불량 패턴 분류 모델',
    description: 'WM-811K 데이터셋의 웨이퍼 맵을 MobileNet으로 분류하고, 클래스 불균형은 CFG-DDPM 기반 증강으로 보완했다. 제조 도메인의 실제 결함 유형을 다루며 AI·ICT 융합 역량을 다진 캡스톤 프로젝트.',
    stack: ['Python', 'MobileNet', 'DDPM', 'PyTorch'],
    status: 'done',
    highlight: 'WM-811K · 생성모델 데이터 증강',
  },
  {
    id: 'sentistock',
    title: 'SentiStock',
    subtitle: '금융 뉴스 감성 분석 기반 주식 정보 서비스',
    description: '금융 뉴스를 수집·분석해 종목별 시장 감성과 주가 정보를 제공하는 웹 서비스입니다. 초기 뉴스 크롤링 파이프라인 구축부터 React·Next.js 기반 마이페이지 개발, 사용자 정보와 관심 종목 API 연동까지 데이터 흐름과 사용자 접점을 함께 구현했습니다.',
    stack: ['React', 'Next.js', 'Java 17', 'Spring Boot 3', 'JPA', 'MariaDB', 'Python', 'Web Crawling', 'Docker', 'Kubernetes', 'Jenkins', 'AWS'],
    status: 'done',
    highlight: '크롤링 파이프라인 · 마이페이지 · API 연동 · WBS 및 요구사항 정의 · 최종 시연 제작',
  },
];
