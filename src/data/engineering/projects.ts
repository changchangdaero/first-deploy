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
      '정상 · 결함 비율로 증강 예산을 정하고, 클래스별 분류 난이도와 희소성에 따라 증강량을 차등 배분해 결함 클래스의 Recall 중심 성능을 개선',
    background:
      'WM-811K 웨이퍼 맵은 정상(None)이 약 85.2%를 차지하고, 결함 클래스끼리도 Edge-Ring 9,680장과 Near-full 149장처럼 편차가 큽니다. 모든 결함 클래스에 같은 양을 증강하면 클래스마다 다른 부족 정도와 분류 난이도를 반영하지 못하기 때문에, 제한된 증강 예산을 어떻게 나눌지에 집중했습니다.',
    context: 'IC-PBL 캡스톤디자인 2 · 팀 도체부도체',
    period: '2026년 1학기',
    team: '2명',
    role: '데이터 전처리 · 증강 · 모델 학습 · 튜닝 (공동 수행)',
    stack: ['Python', 'PyTorch', 'MobileNetV2'],
    thumbnail: 'class-distribution.png',
    architecture: {
      file: 'architecture.svg',
      caption: '데이터 준비 → 정상 · 결함 비율 탐색 → 증강 예산 산출 → 클래스별 배분 → 3개 데이터셋을 동일 조건으로 학습 · 비교',
    },
    contributions: [
      'WM-811K 라벨 데이터 추출, 64×64 · 3채널 전처리, 5개 fold 분할(fold 0 고정 테스트셋) 구성',
      '회전 · 반전 기반 전통적 증강으로 균등 · 차등 증강 데이터셋 생성',
      'ImageNet 사전학습 MobileNetV2 전이학습, 검증 Macro-F2 기준 모델 선정',
      '하이퍼파라미터 튜닝(AdamW, lr · weight decay 1e-4)과 클래스별 증강 가중치 조정 실험',
      '최종 보고서 작성',
    ],
    teamContext:
      '2인 팀으로 대부분의 실험을 함께 진행했습니다. 정상 · 결함 기준 비율 탐색과 증강 가중치 수식은 팀원이 주도했고, 전처리 · 증강 · 학습 · 튜닝 · 가중치 조정은 함께 수행했습니다.',
    decisions: [
      {
        title: '연구 질문 전환',
        options: '어떤 증강 기법(전통적 · 생성형 · 결함 합성)이 가장 좋은가 vs 같은 예산을 클래스별로 어떻게 나눌 것인가',
        decision: '증강량 배분 전략 비교로 전환',
        tradeoff:
          '기법 간 성능 차이가 크지 않아, 단순 비교로는 불균형 문제를 어떤 기준으로 해결했는지 제시하기 어렵다는 지도교수 피드백을 반영',
      },
      {
        title: '증강 데이터 선별 방식',
        options: '생성 데이터 중 품질 좋은 샘플만 사람이 골라 사용 vs 사전에 정한 기준대로 전부 사용',
        decision: '사람의 임의 선별을 제외',
        tradeoff: '주관적 판단이 개입되면 실험의 객관성과 재현성이 떨어지고 기법 간 공정한 비교가 어려움',
      },
      {
        title: 'CFG-DDPM 생성형 증강',
        options: '클래스 조건 확산 모델(CFG-DDPM)로 결함 데이터 생성 vs 전통적 증강(회전 · 반전)으로 통일',
        decision: '초기 탐색에만 활용하고 최종 실험에서는 제외',
        tradeoff: '생성 샘플마다 품질 편차가 있어, 배분 전략의 효과만 비교하려면 증강 기법을 하나로 통제하는 편이 타당하다고 판단',
      },
      {
        title: '모델 선정 기준',
        options: '검증 F1-score vs 검증 Macro-F2',
        decision: 'Macro-F2로 변경하고 Defect Macro-F2를 핵심 지표로 설정',
        tradeoff: '결함을 놓치지 않는 것(Recall)이 중요한 문제라 Recall에 더 큰 비중을 두는 F2가 목적에 맞음',
      },
    ],
    tables: [
      {
        title: '클래스별 증강량 배분',
        columns: ['클래스', '검증 F2', '난이도 D', '희소성', '최종 가중치', '증강량'],
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
        caption: '분류가 어려운 Scratch · Loc에 증강량이 집중되고, 이미 잘 분류되는 Edge-Ring에는 적게 배정됩니다.',
      },
      {
        title: '최종 성능 비교 (fold 0 고정 테스트셋)',
        columns: ['조건', 'Macro-F1', 'Macro-F2', 'Defect Macro-F1', 'Defect Macro-F2'],
        rows: [
          ['원본', '0.8782', '0.8647', '0.8644', '0.8488'],
          ['균등 증강', '0.8947', '0.8864', '0.8829', '0.8732'],
          ['차등 증강 (제안)', '0.8917', '0.8907', '0.8795', '0.8783'],
        ],
        caption: '차등 증강은 F2 계열 지표에서 가장 높았고, F1 계열은 균등 증강이 더 높았습니다.',
      },
    ],
    code: {
      title: '증강량 배분 수식',
      language: 'python',
      caption: '배분 수식을 코드로 옮긴 것입니다. 0.3은 휴리스틱 계수입니다.',
      source: `difficulty = 1 - f2_score                    # 분류 난이도 (검증셋 F2 기준)
scarcity = math.log(n_max / n_class)         # 희소성 보너스 (데이터가 적을수록 큼)
weight = difficulty * (1 + 0.3 * scarcity)   # 최종 가중치
aug_count = budget * weight / total_weight   # 증강 예산 4,024장을 가중치 비율로 배분`,
    },
    metrics: [
      { label: 'Macro-F2', value: '0.8647 → 0.8907' },
      { label: 'Defect Macro-F2', value: '0.8488 → 0.8783' },
      { label: 'Scratch F2', value: '0.6356 → 0.7553' },
      { label: '증강 예산', value: '4,024장' },
    ],
    screenshots: [
      {
        file: 'none-ratio-curve.png',
        caption: '정상(None) 데이터 수에 따른 Macro-F2 — 약 3.23:1부터 향상 폭이 완만해져 기준 비율로 설정',
        fit: 'contain',
      },
      {
        file: 'performance-comparison.png',
        caption: '원본 · 균등 증강 · 차등 증강의 테스트셋 성능 비교',
        fit: 'contain',
      },
    ],
    learnings: [
      '불균형 데이터에서는 Accuracy 하나로 판단할 수 없어, 문제 목적에 맞는 평가 지표(Macro-F2, Defect Macro-F2)를 먼저 정해야 한다는 점을 배웠습니다.',
      '모델 구조만큼이나 학습 데이터의 구성과 배분이 성능에 큰 영향을 준다는 것을 실험으로 확인했습니다.',
    ],
    limitations: [
      '희소성 계수 0.3 등 난이도 계산 수식이 휴리스틱이라 통계적 근거가 부족합니다.',
      'Macro-F1은 균등 증강이 더 높았고, Donut · Random(균등 증강)과 Near-full(원본)은 차등 증강에서 오히려 낮아 모든 클래스에서 일관된 개선은 아니었습니다.',
      '공개 데이터셋(WM-811K)만 사용해 실제 생산라인 데이터로는 검증하지 않았습니다.',
    ],
    nextSteps: [
      '결함 패턴의 형태적 특성에 맞춰 클래스별 증강 기법과 수량을 개별 설정',
      '난이도 산정 기준의 객관성과 다른 도메인으로의 일반화 가능성 검증',
    ],
  },
  {
    slug: 'sentistock',
    category: 'Web',
    status: 'done',
    title: 'SentiStock',
    summary: '뉴스 감성 분석 기반 주식 투자 판단 보조 플랫폼',
    background:
      '투자자는 재무 지표뿐 아니라 뉴스가 만든 기대 · 불안 같은 감정에도 반응합니다. SentiStock은 종목별 뉴스를 감정 점수(0~100)로 수치화하고, 투자 성향에 따라 매수 · 매도 알림을 보내 감정적 매매를 줄이도록 돕는 서비스입니다.',
    context: 'LG CNS AM INSPIRE CAMP 3기 · 최종 팀 프로젝트',
    period: '2025.11 ~ 2026.01 (10주)',
    team: '7명',
    role: 'Frontend · 마이페이지 개발과 API 연동',
    stack: ['TypeScript', 'Next.js'],
    thumbnail: 'app-mockup.jpg',
    architecture: {
      file: 'service-architecture.png',
      caption:
        '팀 서비스 아키텍처 — 백엔드 API, 감정 분석 파이프라인(GPT-4o-mini · KR-FinBERT), 클라우드 인프라(EKS · GitHub Actions · Kafka)는 다른 팀원이 담당',
    },
    contributions: [
      'Next.js · TypeScript로 마이페이지 화면 개발 (회원정보 조회 · 수정, 알림 설정, 계정 보안, 구독 관리, 즐겨찾기, 매수 종목 리스트)',
      '투자 성향 · 구독 · 즐겨찾기 · 매수 종목 · 계정 보안 · 회원 탈퇴 API 연동, API 요청 헬퍼와 구독 관련 훅 정리',
      '회원정보 수정 · 매수 종목 리스트 등 연동 오류 수정',
      'WBS · 요구사항 정의서 작성',
      '최종 시연 영상 제작',
    ],
    teamContext:
      '프론트엔드 4명 · 백엔드/클라우드 3명과 멘토 1명으로 진행했습니다. 뉴스 수집과 감정 분석 파이프라인, 백엔드 API, 클라우드 인프라는 다른 팀원이 담당했고, 저는 프론트엔드에서 마이페이지와 사용자 관련 API 연동을 맡았습니다.',
    screenshots: [
      { file: 'mypage-profile.png', caption: '회원정보 조회 · 투자 성향 결과' },
      { file: 'mypage-subscription.png', caption: '구독 관리 (구독 상태 · 결제 정보)' },
      { file: 'mypage-favorites.png', caption: '즐겨찾기 종목 목록' },
      { file: 'mypage-stock-list.png', caption: '매수 종목 리스트 (평단가 · 수익률)' },
    ],
    learnings: [
      '아이디어가 기획 · 개발 · 배포를 거쳐 실제 서비스로 사용자에게 전달되기까지, 단계마다 필요한 의사결정과 기술적 고려사항을 통합적인 관점에서 이해했습니다.',
    ],
    limitations: [
      '데이터 수집 확장(커뮤니티 · SNS)과 기능 고도화(모의투자 등)는 일정과 데이터 제약으로 충분히 진행하지 못했습니다.',
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
    role: '기획 · 설계 · 개발 전체',
    stack: ['Electron', 'React', 'TypeScript', 'Gemini API', 'electron-store'],
    thumbnail: 'thumbnail.png',
    architecture: {
      file: 'ipc-architecture.png',
      caption:
        'Renderer(React) → Preload(contextBridge) → IPC → Main Process. Gemini API · 로컬 저장소 · 트레이와 알림은 Main에서만 다룹니다.',
    },
    contributions: [
      '투명 · 프레임 없는 펫 창, 드래그와 위치 복원, 투명 영역 클릭 통과, 시스템 트레이 구현',
      '7가지 감정 상태 머신과 픽셀아트 애니메이션, 타자기 효과 말풍선',
      'Gemini API로 자연어 일정 등록 · 수정 · 삭제 대화 구현 (수집 → 확인 → 실행 단계, KST 기준 상대 날짜 계산)',
      '월간 달력 다이어리, 할 일, 뽀모도로 타이머, AI 감성 일기, 리마인더 알림, 공휴일 표시',
      'contextBridge · IPC 입력 검증으로 Renderer와 Main의 보안 경계 설계, 단일 인스턴스 보장',
      'electron-builder로 Windows x64 portable 패키징',
    ],
    decisions: [
      {
        title: 'AI의 역할',
        options: '자유 대화 챗봇 vs 자연어를 구조화된 일정 데이터로 바꾸는 도구',
        decision: '구조화 변환과 감성 피드백(일기 코멘트)으로 역할을 한정',
        tradeoff: '일정 데이터는 틀리면 안 되기 때문에, AI 출력은 스키마로 검증하고 사용자의 명시적 확인을 거친 뒤에만 저장',
      },
      {
        title: '데이터 저장',
        options: '서버 · DB vs 로컬 저장소(electron-store)',
        decision: '서버 없이 로컬에 저장',
        tradeoff: '개인 일정이라 외부 서버 없이 빠르고 단순하게 동작. 대신 여러 기기 간 동기화는 지원하지 않음',
      },
      {
        title: 'API 키 방식',
        options: '앱에 키를 내장 vs 사용자가 자신의 Gemini 키를 입력(BYOK)',
        decision: 'BYOK',
        tradeoff: '배포 앱에 비밀값을 넣지 않음. 단, 입력받은 키를 아직 암호화하지 않고 저장하고 있어 배포 전 개선이 필요',
      },
    ],
    troubleshooting: [
      {
        title: '반복 함수 호출로 인한 API 오류와 응답 지연',
        symptom: '일정 등록 대화 중 AI가 필요한 정보를 확인하려 함수를 반복 호출해 API 요청 제한(Rate Limit)에 걸리고 응답이 지연됨',
        cause: '같은 요청이 중복 실행되고, 대화가 끝나기 전에 여러 함수 호출이 동시에 발생',
        solution:
          '한 번의 요청에서 실행할 수 있는 함수 호출 범위를 제한하고, 요청 큐로 Gemini 호출을 한 번에 하나씩 직렬화. Rate Limit 응답에는 최대 3회 재시도, 타임아웃과 예외 처리 추가',
        image: { file: 'ts-request-queue.png', caption: '요청 큐로 동시 호출을 제어한 과정' },
      },
      {
        title: '모호한 자연어 표현으로 인한 일정 정보 누락',
        symptom: "'금요일쯤 약속', '다음 주에 병원' 같은 표현에서 날짜 · 시간이 빠지거나 파싱에 실패",
        cause: 'AI 응답 형식이 일정하지 않아, 임의로 해석하면 잘못된 일정 데이터가 만들어짐',
        solution:
          '응답 스키마(필수 필드 · 대화 단계)를 정의해 검증하고, 정보가 모호하면 추가 질문. 저장 전에는 내용을 요약해 사용자가 명확히 승인한 경우에만 등록',
        image: { file: 'ts-schema-validation.png', caption: '스키마 검증과 확인 단계로 잘못된 등록을 막은 과정' },
      },
    ],
    screenshots: [
      { file: 'pet-state-machine.png', caption: '픽셀아트 캐릭터 상태 머신 (idle · sleep · 반응형 감정)', fit: 'contain' },
      { file: 'nl-to-schedule.png', caption: '자연어 입력을 구조화된 일정 데이터와 감성 코멘트로 변환', fit: 'contain' },
    ],
    learnings: [
      'LLM 출력은 그대로 믿지 않고 스키마 검증과 사용자 확인을 거쳐야 실제 데이터로 쓸 수 있다는 점을 배웠습니다.',
      '외부 API 호출은 요청 제한을 전제로 큐 · 재시도 · 타임아웃을 설계해야 안정적으로 동작한다는 것을 경험했습니다.',
    ],
    limitations: [
      '사용자가 입력한 Gemini API 키를 아직 암호화하지 않고 로컬에 저장합니다.',
      'Windows 전용이며, 현재는 개발자 본인만 사용하고 있습니다.',
    ],
    nextStepsLabel: '진행 계획 (MS Store 배포)',
    nextSteps: [
      'API 키를 Electron safeStorage로 암호화해 저장',
      'electron-builder에 MSIX 패키징 대상 추가',
      'GitHub Actions로 typecheck → build → MSIX 생성 자동화',
      'Partner Center 등록, 개인정보처리방침 · 스토어 등록 정보 준비',
      'Store 제출 · 인증 후 출시, 이후 버전 관리와 업데이트 배포',
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
