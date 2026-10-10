// 프로젝트 데이터: "/engineering" 목록과 "/engineering/projects/[slug]" 상세 페이지의 내용을 관리합니다.
// 이미지는 public/projects/[slug]/ 폴더에 넣고 file에 파일명만 적습니다. 파일이 없으면 자동으로 숨겨집니다.

export type ProjectStatus = 'done' | 'wip';

export type ProjectImage = {
  file: string;
  caption: string;
  // 결과 갤러리에서 기본은 16:10 칸을 꽉 채움(cover). 차트처럼 잘리면 안 되는 이미지는 'contain'
  fit?: 'cover' | 'contain';
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

// 표: 첫 열은 행 제목입니다. 셀 안의 `코드`는 코드 글꼴로 보입니다.
export type ProjectTable = {
  title: string;
  columns: string[];
  rows: string[][];
  caption?: string;
  collapsed?: boolean; // true면 제목만 보이고, 눌러야 펼쳐집니다.
};

// 코드 블록: language에 맞춰 문법 강조가 적용됩니다.
export type ProjectCode = {
  title: string;
  language: 'bash' | 'yaml' | 'dockerfile' | 'python';
  source: string;
  caption?: string;
  collapsed?: boolean; // true면 제목만 보이고, 눌러야 펼쳐집니다.
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
  // true면 사이트 목록과 상세 페이지에서 숨깁니다. (작성은 해 두고 나중에 공개할 때)
  hidden?: boolean;
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
  tables?: ProjectTable[];
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

const allProjects: Project[] = [
  {
    slug: '3tier-monitoring',
    category: 'Infra',
    status: 'done',
    title: '3-tier 인프라 구축 및 모니터링',
    summary: '가상 서버 4대로 웹 서비스를 직접 구축하고, 서버 상태를 한눈에 보는 모니터링 화면까지 만든 프로젝트',
    background: '리눅스 서버 운영을 실제로 해 보기 위해 진행한 부트캠프 과제입니다.',
    context: '코멘토 리눅스 운영 직무 부트캠프',
    period: '5주',
    team: '개인',
    role: '설계부터 구축, 모니터링까지 전부',
    stack: ['VMware', 'RHEL9', 'Nginx', 'Node.js', 'PostgreSQL', 'Prometheus', 'node_exporter', 'Grafana', 'stress'],
    thumbnail: 'grafana-dashboard.png',
    architecture: {
      file: 'architecture.svg',
      caption:
        '사용자의 요청은 웹 서버(Nginx), 애플리케이션 서버(Node.js), DB 서버(PostgreSQL) 순서로 전달됩니다. 관리 서버(mgt01)는 4대 서버의 CPU와 메모리 상태를 모읍니다.',
    },
    contributions: [
      '1주차: VMware로 리눅스(RHEL9) 가상 서버 4대를 만들고 기본 설정을 했습니다.',
      '2주차: 웹 서버(Nginx), 애플리케이션 서버(Node.js), DB(PostgreSQL)를 설치했습니다.',
      '3주차: 세 서버를 연결해, 웹 주소로 접속하면 DB 데이터까지 조회되도록 만들었습니다.',
      '4주차: Prometheus와 Grafana로 4대 서버의 CPU와 메모리 사용량을 그래프로 볼 수 있게 했습니다.',
      '부하 실습: 서버에 일부러 부하를 주고, 그래프에서 변화가 보이는지 확인했습니다.',
      '단계마다 서버 상태를 저장해 두어, 문제가 생기면 바로 되돌릴 수 있게 했습니다.',
    ],
    metrics: [
      { label: '부하를 준 웹 서버 CPU', value: '72.86%' },
      { label: '같은 시간 나머지 서버 CPU', value: '3~5%' },
      { label: '모니터링 대상', value: '4대' },
    ],
    screenshots: [
      {
        file: 'db-via-proxy.jpg',
        caption: '웹 서버 주소로 접속해 DB 데이터까지 불러온 화면입니다. 세 서버가 모두 연결된 것을 확인했습니다.',
      },
      { file: 'nginx-proxy.png', caption: '웹 서버로 들어온 요청을 Nginx가 애플리케이션 서버로 넘겨 주는 모습입니다.' },
      { file: 'vm-4-servers.png', caption: '서버 4대를 만든 뒤 각각 인터넷에 연결되는지 확인한 화면입니다.' },
    ],
    learnings: [
      '웹 서버가 요청을 대신 받아 넘겨 주면 뒤쪽 서버를 외부에 드러내지 않아도 된다는 점을 직접 구성하며 이해했습니다.',
    ],
    limitations: [
      '서버를 한 대씩 손으로 만들었습니다. 서버가 많아지면 Terraform 같은 도구로 자동으로 만들 필요가 있습니다.',
    ],
  },
  {
    slug: 'jenkins-ci',
    category: 'CI/CD',
    status: 'done',
    title: 'Jenkins 기반 CI/CD 파이프라인 구축',
    summary: '코드를 올리면 Jenkins가 자동으로 Docker 이미지를 만들어 Docker Hub에 올리도록 만들고, 서버 배포 단계까지 스크립트로 작성한 프로젝트',
    background:
      'LG CNS 블로그 서비스를 여러 개의 작은 서비스로 나누는 팀 프로젝트에서, AI 운세 서비스의 자동 빌드와 배포를 맡았습니다. 작업 중 Jenkins가 계속 끊기는 문제가 있었는데, 멘토와 함께 로그를 살펴보다가 폴더 권한 문제라는 것을 찾아 해결했습니다.',
    context: 'LG CNS AM INSPIRE CAMP 3기, 미니 프로젝트 2차',
    period: '2025.10.23 ~ 10.29 (1주)',
    team: '7명',
    role: 'CI/CD 파이프라인 구축 담당',
    stack: ['AWS EC2', 'Jenkins (lts-jdk17)', 'Docker', 'Docker Hub', 'Docker Compose', 'Bash', 'GitHub'],
    thumbnail: 'dockerhub-tags.png',
    architecture: {
      file: 'architecture.svg',
      caption:
        'GitHub에서 코드를 가져와 AWS 서버(EC2)의 Jenkins가 Docker 이미지를 만들고, 빌드 번호와 latest 두 이름으로 Docker Hub에 올립니다. 필요하면 같은 서버에서 바로 실행합니다.',
    },
    contributions: [
      'AWS 서버에 Jenkins를 설치하고, Jenkins 안에서 서버의 Docker를 바로 쓸 수 있게 연결했습니다.',
      'Docker Hub 로그인 정보를 Jenkins에 안전하게 저장하고, 빌드할 때 자동으로 꺼내 쓰도록 했습니다.',
      '이미지 빌드, Docker Hub 업로드, 서버 실행까지 한 번에 이어지는 최종 스크립트를 작성했습니다.',
      '실패했을 때 원인을 빨리 찾을 수 있도록, 값이 비어 있는지 미리 확인하고 단계마다 로그를 남기게 했습니다.',
      '다른 서버에 원격으로 배포하던 방식을, Jenkins가 있는 서버에서 바로 실행하는 방식으로 바꿨습니다.',
    ],
    teamContext:
      '7명이 세 팀(부하 테스트, Jenkins 자동화, GitHub Actions 자동화)으로 나눠 진행했고, 부하 테스트와 GitHub Actions는 다른 팀원이 맡았습니다. Jenkins 초기 설치와 원격 배포 스크립트 초안은 팀원이 만들었고, 저는 이를 바탕으로 최종 스크립트를 직접 작성했습니다.',
    troubleshooting: [
      {
        title: '첫 배포 실패: Docker Hub 로그인 정보가 전달되지 않음',
        symptom:
          'Docker Hub 아이디와 비밀번호 값이 비어 있어서 스크립트가 오류로 멈췄습니다.',
        cause:
          '세 가지가 겹쳤습니다. Jenkins에 저장한 로그인 정보가 스크립트로 넘어가지 않았고, 스크립트와 설정의 변수 이름도 서로 달랐습니다. 게다가 Docker Hub를 구글 계정으로 가입해서 비밀번호 자체가 없었습니다.',
        solution:
          '비밀번호 대신 쓸 수 있는 Docker Hub 토큰을 발급해 Jenkins에 등록하고, 변수 이름을 하나로 맞췄습니다. 값이 비어 있으면 바로 멈추고 알려 주는 확인 코드도 넣었습니다.',
        image: {
          file: 'build1-console-unbound.png',
          caption: '첫 번째 빌드 화면: Docker Hub 로그인 값이 비어 있어 실패',
        },
      },
      {
        title: 'Jenkins 접속 불가와 플러그인 설치 실패',
        symptom: 'Jenkins 화면이 끝없이 로딩되고, 다시 설치한 뒤에는 플러그인이 대부분 설치되지 않았습니다.',
        response: '처음부터 다시 구축하면서 원인 후보를 정리했습니다.',
        hypotheses: [
          '업데이트 서버 응답 지연',
          '네트워크 주소 확인 문제',
          '이전 설치 흔적',
          '디스크 용량 부족',
          'Jenkins 폴더 권한 문제',
          '플러그인끼리 충돌',
        ],
        image: {
          file: 'plugin-install-failed.png',
          caption: '다시 설치한 뒤 플러그인 대부분이 설치에 실패한 화면',
        },
      },
      {
        title: '진짜 원인: Jenkins가 자기 폴더에 쓸 권한이 없었음',
        symptom: '빌드 직전에 Jenkins 연결이 다시 끊겼습니다.',
        cause:
          '멘토와 함께 로그를 확인해 보니, Jenkins가 데이터를 저장하는 폴더에 읽고 쓸 권한이 없었습니다.',
        solution:
          '폴더를 미리 만들고 Jenkins에게 권한을 준 뒤 다시 실행하니 정상적으로 동작했습니다.',
        lesson:
          '정리했던 원인 후보 중 권한 문제가 진짜 원인이었고, 플러그인 설치 실패도 같은 이유였을 가능성이 컸습니다. 이후로는 문제가 생기면 로그부터 확인합니다.',
      },
    ],
    decisions: [
      {
        title: '배포 구조 결정',
        options: '서버를 둘로 나눠 원격 배포 vs 서버 한 대에서 바로 실행',
        decision:
          '1주라는 짧은 일정 안에 배포를 성공시키는 것을 우선해 서버 한 대 방식을 골랐습니다.',
        tradeoff:
          '한 서버에서 Jenkins와 서비스가 자원을 나눠 써서 실제 운영에는 맞지 않습니다. 실제로 메모리 부족도 의심됐기 때문에, 운영 환경이라면 서버를 나누는 게 맞다고 판단했습니다.',
      },
    ],
    tables: [
      {
        title: '최종 스크립트의 방어 장치',
        collapsed: true,
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
    ],
    code: {
      title: '최종 파이프라인 스크립트',
      collapsed: true,
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
      { label: '올라간 이미지', value: '7번, latest' },
      { label: '두 이미지가 같은지', value: '같은 이미지 (0d69a56e1d90)' },
      { label: '업로드 날짜', value: '2025-10-28' },
    ],
    limitations: [
      '서버 실행 단계는 스크립트로 만들었지만, 실제로 실행한 기록은 남아 있지 않습니다.',
      '서버 한 대에서 Jenkins와 서비스가 자원을 나눠 씁니다.',
    ],
    nextSteps: [
      '빌드 서버와 서비스 서버 나누기',
      'Jenkins에 주는 권한을 줄인 더 안전한 빌드 방식 찾기',
      '지원이 끝난 기본 이미지(openjdk)를 최신 이미지로 교체',
    ],
    links: {
      issue: 'https://github.com/lgcns2-mini/dcompose/issues/4',
      dockerhub: 'https://hub.docker.com/r/changchangdaero/ai-fortune/tags',
    },
  },
  {
    // 요약 · 배경 · 내가 한 일 문구는 제안서와 검토의견서를 바탕으로 쓴 초안입니다.
    slug: 'alertlens',
    // 프로젝트 완성 후 공개 예정
    hidden: true,
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
    summary:
      '반도체 웨이퍼 불량 사진을 종류별로 분류하는 AI 모델에서, 맞히기 어렵고 데이터가 적은 불량 종류에 학습 데이터를 더 많이 늘려 불량을 놓치는 경우를 줄인 프로젝트',
    background:
      '웨이퍼 데이터의 약 85%가 정상 사진이고, 불량 종류끼리도 많은 것은 9,680장, 적은 것은 149장일 만큼 차이가 큽니다. 모든 종류에 데이터를 똑같이 늘리면 종류마다 다른 상황을 반영하지 못해서, 정해진 양의 추가 데이터를 어떻게 나눌지에 집중했습니다.',
    context: 'IC-PBL 캡스톤디자인 2, 팀 도체부도체',
    period: '2026년 1학기',
    team: '2명',
    role: '데이터 준비, 데이터 늘리기, 모델 학습과 튜닝 (팀원과 함께)',
    stack: ['Python', 'PyTorch', 'MobileNetV2'],
    thumbnail: 'class-distribution.png',
    architecture: {
      file: 'architecture.svg',
      caption:
        '정상과 불량의 적정 비율을 찾아 추가할 데이터 양을 정하고, 불량 종류별로 나눕니다. 이렇게 만든 세 가지 데이터를 같은 조건에서 학습시켜 비교했습니다.',
    },
    contributions: [
      '라벨이 붙은 웨이퍼 사진만 골라 같은 크기로 맞추고, 학습용과 평가용으로 나눴습니다.',
      '사진을 돌리거나 뒤집어 데이터를 늘리고, 모든 종류에 똑같이 늘린 데이터와 종류별로 다르게 늘린 데이터를 만들었습니다.',
      '이미 학습된 이미지 모델(MobileNetV2)을 웨이퍼 데이터로 다시 학습시키고, 불량을 놓치지 않는 정도를 기준으로 가장 좋은 모델을 골랐습니다.',
      '학습 설정값을 조정하고, 종류별로 데이터를 얼마나 늘릴지 바꿔 가며 실험했습니다.',
      '최종 보고서를 작성했습니다.',
    ],
    teamContext:
      '2명이서 대부분의 실험을 함께 했습니다. 정상과 불량의 기준 비율 찾기와 데이터 배분 수식은 팀원이 주도했고, 데이터 준비부터 학습, 튜닝, 배분 조정까지는 함께 했습니다.',
    decisions: [
      {
        title: '무엇을 비교할지 바꿈',
        options: '어떤 데이터 늘리기 방법이 가장 좋은가 vs 같은 양을 종류별로 어떻게 나눌 것인가',
        decision: '나누는 방법을 비교하기로 했습니다.',
        tradeoff: '방법끼리 성능 차이가 크지 않아 단순 비교로는 보여 줄 게 없다는 지도교수님 의견을 반영했습니다.',
      },
      {
        title: '모델 고르는 기준',
        options: 'F1 점수 vs F2 점수',
        decision: 'F2 점수로 골랐습니다.',
        tradeoff: '불량을 놓치는 것이 더 큰 문제라서, 놓친 불량에 더 큰 벌점을 주는 F2 점수가 목적에 맞았습니다.',
      },
    ],
    tables: [
      {
        title: '불량 종류별로 늘린 데이터 양',
        collapsed: true,
        columns: ['불량 종류', '분류 점수', '어려운 정도', '데이터 부족 정도', '최종 비중', '늘린 장수'],
        rows: [
          ['Scratch', '0.5802', '0.4198', '0.5022', '0.4830', '1,130'],
          ['Loc', '0.6351', '0.3649', '0.2378', '0.3910', '915'],
          ['Edge-Loc', '0.7450', '0.2550', '0.1496', '0.2665', '624'],
          ['Donut', '0.8175', '0.1825', '0.6860', '0.2201', '515'],
          ['Random', '0.8790', '0.1210', '0.5795', '0.1421', '333'],
          ['Center', '0.8950', '0.1050', '0.1951', '0.1111', '260'],
          ['Near-full', '0.9425', '0.0575', '1.0000', '0.0747', '175'],
          ['Edge-Ring', '0.9672', '0.0328', '0.0000', '0.0328', '77'],
        ],
        caption: '맞히기 어려운 Scratch와 Loc에 가장 많이 늘리고, 이미 잘 맞히는 Edge-Ring에는 적게 늘렸습니다.',
      },
      {
        title: '최종 성능 비교',
        columns: ['조건', '전체 F1', '전체 F2', '불량 F1', '불량 F2'],
        rows: [
          ['원본', '0.8782', '0.8647', '0.8644', '0.8488'],
          ['똑같이 늘림', '0.8947', '0.8864', '0.8829', '0.8732'],
          ['종류별로 다르게 늘림 (제안)', '0.8917', '0.8907', '0.8795', '0.8783'],
        ],
        caption: '제안한 방법은 F2 점수(불량을 놓치지 않는 정도)가 가장 높았고, F1 점수는 똑같이 늘린 방법이 조금 더 높았습니다.',
      },
    ],
    code: {
      title: '데이터 배분 수식',
      language: 'python',
      collapsed: true,
      caption: '배분 수식을 코드로 옮긴 것입니다. 0.3은 실험하며 정한 값입니다.',
      source: `difficulty = 1 - f2_score                    # 어려운 정도 (검증 데이터의 F2 점수 기준)
scarcity = math.log(n_max / n_class)         # 데이터가 적을수록 커지는 값
weight = difficulty * (1 + 0.3 * scarcity)   # 최종 비중
aug_count = budget * weight / total_weight   # 추가할 4,024장을 비중대로 나눔`,
    },
    metrics: [
      { label: '전체 F2 점수', value: '0.8647 → 0.8907' },
      { label: '불량 F2 점수', value: '0.8488 → 0.8783' },
      { label: 'Scratch 불량 F2 점수', value: '0.6356 → 0.7553' },
      { label: '추가한 데이터', value: '4,024장' },
    ],
    screenshots: [
      {
        file: 'none-ratio-curve.png',
        caption:
          '정상 사진 수를 늘려 가며 잰 점수입니다. 정상과 불량이 약 3.23 대 1을 넘으면 점수가 거의 오르지 않아 이 비율을 기준으로 정했습니다.',
        fit: 'contain',
      },
      {
        file: 'performance-comparison.png',
        caption: '원본, 똑같이 늘림, 종류별로 다르게 늘림 세 가지의 성능 비교',
        fit: 'contain',
      },
    ],
    learnings: [
      '데이터가 한쪽으로 치우쳐 있으면 정확도만으로는 모델을 판단할 수 없어서, 목적에 맞는 평가 기준을 먼저 정해야 한다는 것을 배웠습니다.',
      '모델만큼이나 학습 데이터를 어떻게 구성하느냐가 성능에 큰 영향을 준다는 것을 실험으로 확인했습니다.',
    ],
    limitations: [
      '배분 수식의 일부 값(0.3 등)을 실험하며 정해서 통계적인 근거가 부족합니다.',
      'F1 점수는 똑같이 늘린 방법이 더 높았고, Donut, Random, Near-full 불량은 제안한 방법에서 오히려 점수가 낮아 모든 종류가 좋아지지는 않았습니다.',
      '공개 데이터만 사용해서 실제 공장 데이터로는 확인하지 못했습니다.',
    ],
    nextSteps: [
      '불량 모양에 맞춰 종류마다 데이터 늘리는 방법과 양을 따로 정하기',
      '어려운 정도를 매기는 기준이 객관적인지, 다른 분야 데이터에도 통하는지 확인하기',
    ],
  },
  {
    slug: 'sentistock',
    category: 'Web',
    status: 'done',
    title: 'SentiStock',
    summary: '뉴스 감성 분석 기반 주식 투자 판단 보조 플랫폼',
    background:
      '투자자는 숫자뿐 아니라 뉴스가 주는 기대감이나 불안감에도 흔들립니다. SentiStock은 종목별 뉴스 분위기를 0~100점으로 보여 주고, 투자 성향에 맞춰 살 때와 팔 때를 알려 주어 감정적인 매매를 줄이도록 돕는 서비스입니다.',
    context: 'LG CNS AM INSPIRE CAMP 3기, 최종 팀 프로젝트',
    period: '2025.11 ~ 2026.01 (10주)',
    team: '7명',
    role: '프론트엔드: 마이페이지 개발과 서버 연동',
    stack: ['TypeScript', 'Next.js'],
    thumbnail: 'app-mockup.jpg',
    architecture: {
      file: 'service-architecture.png',
      caption: '팀 전체 서비스 구조입니다. 서버, 뉴스 감정 분석, 클라우드 인프라는 다른 팀원이 맡았습니다.',
    },
    contributions: [
      'Next.js와 TypeScript로 마이페이지 화면을 만들었습니다. 회원정보, 알림 설정, 계정 보안, 구독 관리, 즐겨찾기, 매수 종목 목록 화면입니다.',
      '투자 성향, 구독, 즐겨찾기, 매수 종목, 회원 탈퇴 기능을 서버와 연결하고, 서버 요청 코드를 공통으로 쓰기 쉽게 정리했습니다.',
      '회원정보 수정, 매수 종목 목록 등에서 서버 연결 오류를 고쳤습니다.',
      '일정표와 요구사항 정의서를 작성했습니다.',
      '최종 시연 영상을 만들었습니다.',
    ],
    teamContext:
      '프론트엔드 4명, 백엔드와 클라우드 3명, 멘토 1명으로 진행했습니다. 뉴스 수집과 감정 분석, 서버, 클라우드 인프라는 다른 팀원이 맡았고, 저는 프론트엔드에서 마이페이지와 사용자 관련 서버 연동을 맡았습니다.',
    screenshots: [
      { file: 'mypage-profile.png', caption: '회원정보와 투자 성향 결과' },
      { file: 'mypage-subscription.png', caption: '구독 관리 (구독 상태와 결제 정보)' },
      { file: 'mypage-favorites.png', caption: '즐겨찾기 종목 목록' },
      { file: 'mypage-stock-list.png', caption: '매수 종목 목록 (평균 매수가와 수익률)' },
    ],
    learnings: [
      '아이디어가 기획, 개발, 배포를 거쳐 실제 서비스가 되기까지 단계마다 어떤 결정이 필요한지 직접 겪으며 배웠습니다.',
    ],
    limitations: [
      '커뮤니티와 SNS까지 데이터를 넓히는 것, 모의투자 같은 추가 기능은 일정과 데이터 부족으로 충분히 하지 못했습니다.',
    ],
    links: { github: 'https://github.com/changchangdaero/sentistock-FE' },
    award: '우수상',
  },
  {
    slug: 'hami',
    category: 'Desktop',
    status: 'wip',
    title: '햄이 (Hami)',
    summary: '자연어로 대화하며 일정 관리하는 데스크톱 펫 앱',
    background:
      '일정 앱은 직접 열어야만 확인할 수 있어 자주 잊게 됩니다. 화면 위에 항상 머무는 햄스터가 말을 걸고, 자연어로 일정을 받아 정리해 주는 데스크톱 펫으로 일정 관리의 접근성을 높이고자 했습니다.',
    context: '개인 토이 프로젝트',
    period: '2026.07 ~ (MS Store 배포 준비 중)',
    team: '개인',
    role: '기획부터 설계, 개발까지 전부',
    stack: ['Electron', 'React', 'TypeScript', 'Gemini API', 'electron-store'],
    thumbnail: 'thumbnail.png',
    architecture: {
      file: 'ipc-architecture.png',
      caption:
        '화면(React)은 정해진 통로로만 앱의 핵심 부분에 요청할 수 있습니다. AI 호출, 데이터 저장, 알림은 모두 핵심 부분에서만 처리해 화면이 이런 기능에 직접 손대지 못하게 했습니다.',
    },
    contributions: [
      '바탕화면 위에 햄스터만 떠 있는 투명 창을 만들었습니다. 마우스로 옮길 수 있고, 다시 켜도 마지막 위치에 나타나며, 햄스터가 아닌 빈 곳은 클릭이 뒤쪽 프로그램으로 통과합니다.',
      '상황에 따라 바뀌는 7가지 표정과 픽셀아트 애니메이션, 글자가 한 자씩 나오는 말풍선을 만들었습니다.',
      '"내일 오후 3시 치과"처럼 말하면 일정이 등록되도록 Gemini API로 대화 기능을 만들었습니다. 내용을 확인받은 뒤에만 등록하고, "다음 주 월요일" 같은 표현도 한국 시간 기준으로 계산합니다.',
      '월간 달력, 할 일 목록, 집중 타이머, AI가 답해 주는 일기, 일정 알림, 공휴일 표시 기능을 만들었습니다.',
      '화면에서 들어오는 요청을 한 번 더 검사하도록 해 보안을 챙겼고, 앱이 두 번 실행되지 않게 했습니다.',
      '설치 없이 바로 실행되는 Windows용 실행 파일로 만들었습니다.',
    ],
    decisions: [
      {
        title: 'AI의 역할',
        options: '자유롭게 대화하는 챗봇 vs 말을 일정 데이터로 바꿔 주는 도구',
        decision: '일정 정리와 일기 답장으로 역할을 좁혔습니다.',
        tradeoff: '일정은 틀리면 안 되기 때문에, AI가 만든 결과는 형식을 검사하고 사용자가 확인한 뒤에만 저장합니다.',
      },
      {
        title: '데이터 저장',
        options: '서버에 저장 vs 내 컴퓨터에 저장',
        decision: '내 컴퓨터에 저장했습니다.',
        tradeoff: '개인 일정이라 서버 없이 빠르고 단순하게 동작하지만, 여러 기기에서 함께 쓸 수는 없습니다.',
      },
      {
        title: 'AI 사용 키',
        options: '앱에 개발자 키를 넣기 vs 사용자가 자기 키를 입력',
        decision: '사용자가 직접 입력하는 방식을 택했습니다.',
        tradeoff:
          '배포 파일에 비밀값이 들어가지 않습니다. 다만 입력받은 키를 아직 암호화하지 않고 저장하고 있어, 배포 전에 고쳐야 합니다.',
      },
    ],
    troubleshooting: [
      {
        title: 'AI 요청이 몰려 응답이 막힘',
        symptom: '일정 대화 중 AI가 같은 요청을 여러 번 보내면서 사용량 제한에 걸리고 응답이 느려졌습니다.',
        cause: '같은 요청이 중복으로 실행되고, 대화가 끝나기 전에 여러 요청이 한꺼번에 나갔습니다.',
        solution:
          '한 번에 보낼 수 있는 요청 수를 제한하고, 요청이 하나씩 차례로 나가도록 바꿨습니다. 제한에 걸리면 최대 3번까지 다시 시도하고, 너무 오래 걸리면 중단하게 했습니다.',
        image: { file: 'ts-request-queue.png', caption: '몰리는 요청을 차례로 내보내도록 바꾼 과정' },
      },
      {
        title: '애매한 말 때문에 일정 정보가 빠짐',
        symptom: '"금요일쯤 약속", "다음 주에 병원"처럼 말하면 날짜나 시간이 빠진 채로 처리됐습니다.',
        cause: 'AI가 답하는 형식이 매번 달라서, 마음대로 해석하면 잘못된 일정이 만들어졌습니다.',
        solution:
          'AI가 답할 형식을 정해 두고 필요한 정보가 빠지면 다시 물어보게 했습니다. 저장 전에는 내용을 요약해 보여 주고, 사용자가 맞다고 해야만 등록합니다.',
        image: { file: 'ts-schema-validation.png', caption: '형식 검사와 확인 단계로 잘못된 등록을 막은 과정' },
      },
    ],
    screenshots: [
      { file: 'pet-state-machine.png', caption: '상황에 따라 바뀌는 햄스터 표정 (기본, 잠자기, 감정 반응)', fit: 'contain' },
      { file: 'nl-to-schedule.png', caption: '말로 입력한 내용이 일정 데이터와 따뜻한 한마디로 바뀌는 예시', fit: 'contain' },
    ],
    learnings: [
      'AI의 답을 그대로 믿지 말고, 형식을 검사하고 사용자 확인을 거쳐야 실제 데이터로 쓸 수 있다는 것을 배웠습니다.',
      '외부 서비스는 사용량 제한이 있다는 전제로, 요청 순서와 재시도를 미리 설계해야 안정적으로 동작한다는 것을 경험했습니다.',
    ],
    limitations: [
      '사용자가 입력한 Gemini API 키를 아직 암호화하지 않고 로컬에 저장합니다.',
      'Windows 전용이며, 현재는 개발자 본인만 사용하고 있습니다.',
    ],
    nextStepsLabel: '진행 계획 (MS Store 배포)',
    nextSteps: [
      'API 키를 Electron safeStorage로 암호화해 저장',
      'Microsoft Store용 설치 파일(MSIX)도 만들 수 있게 설정',
      'GitHub Actions로 검사, 빌드, 스토어용 설치 파일 생성까지 자동화',
      '개발자 등록, 개인정보처리방침과 스토어 소개 자료 준비',
      '스토어 심사를 거쳐 출시하고, 이후 업데이트 배포',
    ],
    links: { github: 'https://github.com/changchangdaero/hamsterdiary' },
  },
];

// 사이트에 보여줄 프로젝트 (hidden 제외). 목록 · 상세 페이지 · 이전/다음 이동 모두 이 배열을 사용합니다.
export const projects = allProjects.filter((project) => !project.hidden);

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
