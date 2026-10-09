// 프로젝트 데이터: "/engineering" 목록과 "/engineering/projects/[slug]" 상세 페이지의 내용을 관리합니다.
// 이미지는 public/projects/[slug]/ 폴더에 넣고 file에 파일명만 적습니다. 파일이 없으면 자동으로 숨겨집니다.
import { todo } from '@/lib/todo';

export type ProjectStatus = 'done' | 'wip';

export type ProjectImage = {
  file: string;
  caption: string;
};

export type ProjectMetric = {
  label: string;
  value: string;
};

// 트러블슈팅: 증상 / 원인 / 해결 구조로 적습니다. 비어 있는 칸은 화면에서 숨겨집니다.
// - response: 근본 해결 전에 취한 대응 (해결 대신 쓸 때)
// - hypotheses: 정리한 원인 가설 목록
// - notes: '[확인 필요] …'처럼 직접 채울 메모 (노란색으로 강조됩니다)
// - image: 이 항목의 증거 사진
export type ProjectTroubleshooting = {
  title?: string;
  symptom: string;
  cause?: string;
  response?: string;
  hypotheses?: string[];
  solution?: string;
  lesson?: string;
  notes?: string[];
  image?: ProjectImage;
};

// 설계 결정: 어떤 선택지 중에서 무엇을 왜 골랐고, 어떤 한계를 인식했는지 적습니다.
export type ProjectDecision = {
  title: string;
  options: string;
  decision: string;
  tradeoff?: string;
};

// 2열 표 (예: 겪은 문제 → 반영한 장치). 셀 안의 `코드`는 코드 글꼴로 보입니다.
export type ProjectTable = {
  title: string;
  columns: [string, string];
  rows: [string, string][];
};

// 코드 블록: language에 맞춰 문법 강조가 적용됩니다.
export type ProjectCode = {
  title: string;
  language: 'bash' | 'yaml' | 'dockerfile';
  source: string;
  caption?: string;
};

// 기술 선택 이유: 왜 이 기술을 골랐는지 1~2줄로 적습니다.
export type ProjectTechChoice = {
  tech: string;
  reason: string;
};

export type Project = {
  slug: string;
  // 카드 번호 옆에 표시하는 분류 라벨 (예: Infra, CI/CD, AI)
  category: string;
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
  decisions?: ProjectDecision[];
  table?: ProjectTable;
  code?: ProjectCode;
  metrics?: ProjectMetric[];
  screenshots?: ProjectImage[];
  learnings?: string[];
  limitations?: string[];
  nextSteps?: string[];
  // nextSteps 섹션 제목을 바꿀 때 사용 (기본: 다음 개선 과제)
  nextStepsLabel?: string;
  links?: {
    github?: string;
    issue?: string;
    dockerhub?: string;
    video?: string;
    slides?: string;
    demo?: string;
  };
  award?: string;
};

export const projects: Project[] = [
  {
    slug: '3tier-monitoring',
    category: 'Infra',
    status: 'done',
    title: '3-tier 인프라 구축 및 모니터링',
    summary: 'VM 4대로 구성한 3-tier 웹 서비스와 모니터링 환경 구성',
    background: '리눅스 운영 실무를 익히기 위한 과제',
    context: '코멘토 리눅스 운영 직무 부트캠프',
    period: '5주',
    team: '개인',
    role: '설계 · 구축 · 모니터링 전체',
    stack: ['VMware', 'RHEL9', 'Nginx', 'Node.js', 'PostgreSQL', 'Prometheus', 'node_exporter', 'Grafana', 'stress'],
    thumbnail: 'grafana-dashboard.png',
    architecture: {
      file: 'architecture.svg',
      caption: '사용자 → Nginx(web01) → Node.js(was01) → PostgreSQL(dbm01), mgt01의 Prometheus가 4대의 node_exporter 지표를 수집',
    },
    contributions: [
      '1주차 · VMware로 RHEL9 VM 4대(web01 / was01 / dbm01 / mgt01) 생성, 저장소 · 호스트명 · 보안 설정',
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
    category: 'CI/CD',
    status: 'done',
    title: 'Jenkins 기반 CI/CD 파이프라인 구축',
    summary: 'Jenkins와 Docker로 빌드 · Docker Hub push를 자동화하고, compose 배포 단계까지 스크립트로 구현',
    background:
      'LG CNS 블로그 서비스를 MSA로 전환하는 팀 프로젝트에서 ai-fortune-service의 Jenkins 파이프라인을 맡았습니다. 구축 중 Jenkins가 반복해서 끊기는 장애를 겪었고, 멘토와 함께 docker logs를 확인해 볼륨 마운트 권한 불일치가 원인임을 찾아 해결했습니다.',
    context: 'LG CNS AM INSPIRE CAMP 3기 · 미니 프로젝트 2차',
    period: '2025.10.23 ~ 10.29 (1주)',
    team: '7명',
    role: 'CI/CD 파이프라인 구축 담당',
    stack: ['AWS EC2', 'Jenkins (lts-jdk17)', 'Docker', 'Docker Hub', 'Docker Compose', 'Bash', 'GitHub'],
    thumbnail: 'dockerhub-tags.png',
    architecture: {
      file: 'architecture.svg',
      caption:
        'GitHub → EC2 위 Jenkins 컨테이너에서 docker build → Docker Hub push(:빌드번호, :latest) → 같은 EC2에서 docker compose 배포(옵션)',
    },
    contributions: [
      'EC2에 Jenkins 컨테이너를 구성하고 docker.sock을 마운트해 호스트 Docker로 이미지를 빌드하도록 설정',
      'Docker Hub Access Token을 Jenkins Credentials에 등록하고 빌드 환경변수로 주입',
      '빌드 → Docker Hub push(:빌드번호, :latest) → compose 배포로 이어지는 최종 파이프라인 스크립트 작성',
      '필수값 검증 · 클린 clone · 단계별 로그 등 실패 원인을 빠르게 찾기 위한 방어 장치 반영',
      '배포 구조를 SSH 원격 배포에서 단일 EC2 로컬 compose 배포로 재설계',
    ],
    teamContext:
      '7명 팀이 3개 세부팀(nGrinder 부하 테스트 / Jenkins CI·CD / GitHub Actions CI)으로 나눠 진행했고, nGrinder와 GitHub Actions는 다른 팀원이 담당했습니다. Jenkins 초기 셋업과 docker.sock 권한 해결, SSH 원격 배포 스크립트 초안은 팀원이 작성했고, 저는 이를 참고해 단일 EC2 로컬 배포 방식의 최종 파이프라인 스크립트를 직접 작성했습니다.',
    troubleshooting: [
      {
        title: '첫 배포 실패: 인증 환경변수 미주입',
        symptom:
          'Docker Hub 계정 환경변수(`DOCKERHUB_USR`, `DOCKERHUB_PSW`)가 비어 `unbound variable` 오류로 스크립트가 중단됨',
        cause:
          'Jenkins Credentials가 빌드 환경변수로 바인딩되지 않았고, 스크립트가 참조한 변수명(`DOCKERHUB_USR`)과 바인딩한 변수명도 일치하지 않았음. 또 Docker Hub를 구글 계정으로 가입해 비밀번호가 없는 상태였음',
        solution:
          'Docker Hub Access Token을 발급해 Jenkins Credentials에 등록하고, Credentials Binding 플러그인으로 환경변수에 주입. 변수명을 `DOCKERHUB_USER` / `DOCKERHUB_PSW`로 맞추고, 스크립트에 필수 변수 검증 가드(`${VAR:?}`)를 추가',
        image: {
          file: 'build1-console-unbound.png',
          caption: '빌드 #1 콘솔: DOCKERHUB_PSW · DOCKERHUB_USR unbound variable로 실패',
        },
      },
      {
        title: 'Jenkins 접속 불가와 플러그인 설치 실패',
        symptom: '8080 포트 접속 시 무한 로딩. 재구축 후에는 플러그인 설치가 극도로 느리고 대부분 실패',
        response: '환경을 처음부터 재구축(포트 8085로 변경, 보안그룹 재설정)하고 원인 가설을 정리',
        hypotheses: [
          '업데이트 서버 타임아웃',
          '컨테이너 DNS 불안정',
          '설치 lock 파일 잔존',
          '디스크 부족',
          '`jenkins_home` 권한 꼬임',
          '플러그인 의존성 충돌',
        ],
        image: {
          file: 'plugin-install-failed.png',
          caption: '재구축 후 초기 플러그인 설치에서 대부분의 플러그인이 실패',
        },
      },
      {
        title: '핵심 원인: 볼륨 마운트 권한 불일치',
        symptom: '빌드 직전 Jenkins 연결이 다시 끊김',
        cause:
          '멘토와 함께 docker logs를 확인한 결과, 마운트한 디렉토리의 권한이 Jenkins 실행 사용자와 맞지 않아 read/write 불가 로그가 발생',
        solution:
          '마운트할 디렉토리를 미리 만들고, Jenkins 실행 사용자(uid 1000)에게 소유권을 부여한 뒤 재실행 → 정상 가동',
        lesson:
          '2번에서 세운 가설 중 "권한 꼬임"이 실제 원인이었고, 플러그인 설치 실패와 접속 끊김도 같은 원인에서 비롯됐을 가능성이 높았습니다. 이후 장애가 나면 docker logs부터 확인하는 습관이 생겼습니다.',
      },
    ],
    decisions: [
      {
        title: '배포 구조 결정',
        options: 'CI 서버와 서비스 서버를 분리해 SSH로 원격 배포 vs Jenkins가 있는 단일 EC2에 로컬 배포',
        decision:
          '일정상 "배포 성공"을 최우선으로 두고 단일 EC2 로컬 배포를 선택. 배포 단계를 SSH 방식에서 로컬 compose 방식으로 다시 작성',
        tradeoff:
          '단일 EC2는 Jenkins와 서비스가 리소스를 나눠 써서 운영 환경에는 맞지 않음. 실제로 메모리 문제도 의심됐기 때문에, 운영이라면 서버를 분리하는 것이 맞다고 판단',
      },
    ],
    table: {
      title: '최종 스크립트의 방어 장치',
      columns: ['겪은 문제', '반영한 장치'],
      rows: [
        ['환경변수 미주입', '`${VAR:?}` 필수값 검증'],
        ['로그인 캐시 꼬임', '`docker logout` 후 `--password-stdin`으로 재로그인'],
        ['이전 작업물 잔존', '`rm -rf` 후 `--depth 1` 클린 clone'],
        ['원인 파악이 어려운 실패', '버전 출력, Dockerfile 존재 체크, 단계별 로그'],
        ['롤백 불가', '`:BUILD_NUMBER` + `:latest` 이중 태깅'],
        ['배포 환경 차이', 'compose 파일이 있을 때만 배포하도록 옵션화'],
      ],
    },
    code: {
      title: '최종 파이프라인 스크립트',
      language: 'bash',
      caption: 'Jenkins Execute shell에 작성한 최종 스크립트 (원문 그대로)',
      source: `APP="ai-fortune"
REPO_URL="https://github.com/lgcns2-mini/inspire3_fortune.git"
BRANCH="main"
: "\${DOCKERHUB_USER:?DOCKERHUB_USER is empty}"   # Jenkins가 주입
: "\${DOCKERHUB_PSW:?DOCKERHUB_PSW is empty}"     # Jenkins가 주입
IMAGE="\${DOCKERHUB_USER}/\${APP}"
TAG="\${BUILD_NUMBER:-latest}"
# (배포 옵션) EC2 로컬에 준비해 둔 compose 파일 경로
COMPOSE_FILE="/opt/compose/fortune.yml"
echo "==> APP=\${APP}"
echo "==> REPO=\${REPO_URL} (\${BRANCH})"
echo "==> IMAGE=\${IMAGE}:\${TAG}"
### ── 1) 디버그용 버전 확인 ─────────────────────────────────────────────────
docker version || true
docker compose version || true
# ⭐(추가) 캐시 로그인 비우고 새 토큰으로 로그인, 베이스 이미지 미리 당김
docker logout || true
echo "\${DOCKERHUB_PSW}" | docker login -u "\${DOCKERHUB_USER}" --password-stdin
docker pull openjdk:17-jdk-slim
### ── 2) 소스 체크아웃(깨끗하게) ───────────────────────────────────────────
rm -rf repo
git clone -b "\${BRANCH}" --depth 1 "\${REPO_URL}" repo
cd repo
# 필요 시 Gradle 빌드가 선행되어야 하는 프로젝트면 주석 해제
# ./gradlew -x test build
# Dockerfile 존재 확인(있으면 진행, 없으면 실패)
test -f Dockerfile || { echo "❌ Dockerfile not found in $(pwd)"; exit 1; }
### ── 3) 이미지 빌드 ────────────────────────────────────────────────────────
echo "==> docker build \${IMAGE}:\${TAG}"
docker build --pull -t "\${IMAGE}:\${TAG}" .
### ── 4) DockerHub 푸시 ─────────────────────────────────────────────────────
echo "==> docker push \${IMAGE}:\${TAG}"
docker push "\${IMAGE}:\${TAG}"
echo "==> tag & push :latest"
docker tag "\${IMAGE}:\${TAG}" "\${IMAGE}:latest"
docker push "\${IMAGE}:latest"
docker logout || true
### ── 5) (옵션) 배포: compose pull/up ──────────────────────────────────────
if [ -f "\${COMPOSE_FILE}" ]; then
  echo "==> Deploy with compose: \${COMPOSE_FILE}"
  docker compose -f "\${COMPOSE_FILE}" pull
  docker compose -f "\${COMPOSE_FILE}" up -d
else
  echo "==> Skip deploy (compose file not found: \${COMPOSE_FILE})"
fi
### ── 6) 완료 ───────────────────────────────────────────────────────────────
echo "==> DONE. Pushed \${IMAGE}:\${TAG} and \${IMAGE}:latest"`,
    },
    metrics: [
      { label: 'Docker Hub 이미지 태그', value: '7 · latest' },
      { label: '두 태그의 digest', value: '0d69a56e1d90 (동일)' },
      { label: 'push 일자', value: '2025-10-28' },
    ],
    limitations: [
      'compose 배포 단계는 스크립트로 구현했지만, 실제 실행 결과 기록은 남아 있지 않습니다.',
      '단일 EC2 구성이라 Jenkins와 서비스가 리소스를 나눠 씁니다.',
    ],
    nextSteps: [
      'CI 서버와 서비스 서버 분리',
      'docker.sock 마운트 대신 권한을 최소화한 빌드 방식 검토',
      'deprecated 상태인 openjdk 베이스 이미지를 eclipse-temurin으로 교체',
    ],
    links: {
      issue: 'https://github.com/lgcns2-mini/dcompose/issues/4',
      dockerhub: 'https://hub.docker.com/r/changchangdaero/ai-fortune/tags',
    },
  },
  {
    // 요약 · 배경 · 내가 한 일 문구는 제안서와 검토의견서를 바탕으로 쓴 초안입니다.
    slug: 'alertlens',
    category: 'Observability',
    status: 'wip',
    title: 'AlertLens',
    summary: 'Prometheus 알림 라벨이 조용히 깨진 위치를 찾고, 알림 그룹화에 주는 영향을 수치로 보여주는 진단 도구',
    background:
      '알림 폭풍을 줄이기 위해 처음에는 머신러닝 기반 알림 그룹화를 구상했지만, Datadog이 같은 기능을 이미 상용화한 것을 확인했습니다. 대신 모든 그룹화 기능이 기대는 전제, "알림 라벨이 정확하다"에 주목했습니다. 라벨은 설정 변경이나 업그레이드로 오류 없이 조용히 깨질 수 있고, 실제 오픈소스 프로젝트에서도 같은 사례가 반복해서 보고되었습니다.',
    context: '캡스톤디자인',
    period: '7~13주차 (개발 진행 중)',
    team: '개인',
    role: '설계 · 구현 · 실험 전체',
    stack: ['Docker Compose', 'Prometheus', 'Alertmanager', 'Python', 'pint'],
    architecture: {
      file: 'architecture.svg',
      caption:
        '계획 단계 구성도: Docker Compose 위 Prometheus · Alertmanager · 모의 서비스 2개, AlertLens CLI가 두 지점의 경보를 비교해 라벨 결함 위치와 그룹화 민감도(S)를 계산',
    },
    contributions: [
      '알림 폭풍 · 알림 그룹화 관련 도구와 실제 장애 사례 조사 (참고자료 16건)',
      '머신러닝 기반 알림 그룹화에서 라벨 품질 진단으로 주제 고도화',
      '라벨 이상 진단 · 알림 묶음 영향 분석 · 실험 검증의 3단 구조 설계',
      '지도교수 검토를 반영해 7주 안에 완결할 수 있는 범위로 재설계',
    ],
    decisions: [
      {
        title: '주제 전환',
        options: '머신러닝 기반 알림 그룹화 vs 그룹화가 기대는 라벨의 품질 진단',
        decision: '라벨 품질 진단',
        tradeoff:
          '머신러닝 그룹화는 Datadog Intelligent Correlation으로 이미 상용화되어 있음. 반면 모든 그룹화 기능의 공통 전제인 라벨 정확성은 기존 도구(pint 등)의 사각지대로 남아 있다고 판단',
      },
      {
        title: '구현 방식',
        options: '머신러닝 기반 판단 vs 규칙 기반 비교',
        decision: '정상 시기의 라벨 상태와 비교하는 규칙 기반으로 구현',
        tradeoff:
          '결과를 다시 만들 수 있고 판단 이유를 설명할 수 있어야 운영 도구로 신뢰할 수 있음. AI 에이전트가 원인 설정을 찾아 수정안을 제안하는 기능은 향후 확장으로 남김',
      },
      {
        title: '범위 조정',
        options: 'Kubernetes(kind) + Docker Compose 이원화 vs Docker Compose 단일 환경',
        decision: 'Docker Compose 단일 환경, 관측점 2곳, 결함 2~3종으로 축소',
        tradeoff:
          '남은 7주 안에 동작하는 프로토타입과 신뢰할 수 있는 실험 데이터를 완결하기 위한 선택. 대규모 Kubernetes 클러스터에서의 검증은 후속 과제로 남김',
      },
    ],
    limitations: [
      '두 개의 서비스로 구성한 실험 환경이라, 대규모 운영 환경으로 결과를 그대로 일반화하기는 어렵습니다.',
      '라벨 문제의 위치와 영향을 알려줄 뿐, 라벨을 자동으로 고치지는 않습니다.',
    ],
    nextStepsLabel: '진행 계획',
    nextSteps: [
      '7주차 · Docker Compose 모니터링 환경 구축 (Prometheus + Alertmanager + 모의 서비스 2개), 경보 규칙 · 라우팅 설정',
      '8주차 · Prometheus · Alertmanager 경보 API 수집기와 2-Point Diff 탐지 엔진 구현 (Python)',
      '9주차 · 그룹화 민감도(S) 계산 모듈, 라벨 오류 3종(PromQL 누락 · relabel 오류 · 키 충돌) 자동 주입 스크립트',
      '10주차 · 장애 · 라벨 오류 주입 실험, pint와의 사각지대 비교',
      '11주차 · B³-F1 · 민감도 지표 분석과 결과 시각화',
      '12~13주차 · 보고서와 GitHub 정리, CLI 데모와 최종 발표',
    ],
  },
  {
    slug: 'wafer-defect',
    category: 'AI',
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
    slug: 'sentistock',
    category: 'Web',
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
    slug: 'hami',
    category: 'Desktop',
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
