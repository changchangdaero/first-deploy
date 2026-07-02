// 공개 포트폴리오 콘텐츠: 홈, 프로젝트, 연락, 글쓰기 페이지에서 쓰는 문구, 링크, 프로젝트 데이터입니다.
export const profile = {
  name: '유창민',
  image: '/me.jpg',
  email: 'changchangdaero@naver.com',
  github: 'https://github.com/changchangdaero',
  resumeHref: '#',
  headline: '글을 쓰고 있습니다. DevOps도 공부하고 있어요!',
  summary: '',
  direction: '<개발자로서의 방향성 요약>',
  highlights: [
    '명지대학교 정보통신공학 & 인공지능·ICT융합전공',
    'LG CNS AM INSPIRE CAMP DevOps 과정 수료',
    '교보문고 시·에세이 분야 주간베스트 도서 [사랑과 타박상] 저자',
    '브런치스토리 작가',
    '한국예술인복지재단 신진예술인',
  ],
  aboutItems: [
    { label: '학력', value: '명지대학교 AI응용시스템학과 / 인공지능ICT융합전공' },
    { label: '부트캠프', value: 'LG CNS AM INSPIRE CAMP DevOps 과정 수료' },
    { label: '수상', value: '최종 팀프로젝트 SentiStock 우수상' },
    { label: '관심 분야', value: '<관심 분야: 데이터, 웹 서비스, 인프라 등>' },
    { label: '글쓰기 이력', value: '<글쓰기 이력 요약>' },
  ],
};

export const projects = [
  {
    slug: 'sentistock',
    title: 'SentiStock',
    period: 'LG CNS AM INSPIRE CAMP',
    oneLine: '<한 줄 설명>',
    problem: '금융 뉴스 데이터 기반 서비스에서 뉴스 수집, 요약, 감정분석 흐름을 구성해야 했습니다.',
    role: '크롤링 파이프라인, LLM 모델 비교, DB 저장 구조, 마이페이지 UI, 요구사항 정의서, WBS 문서화',
    stack: ['Spring Boot', 'Python', 'Crawling', 'LLM', 'MySQL', 'React'],
    documentation: '요구사항 정의서, WBS, 데이터 처리 흐름, 모델 비교 기록',
    learned: '<배운 점>',
    result: '<결과>',
  },
  {
    slug: 'wafer-defect-augmentation',
    title: 'Wafer Defect Augmentation',
    period: 'Capstone / Data Lab',
    oneLine: '<한 줄 설명>',
    problem: 'WM-811K 웨이퍼 결함 데이터의 클래스 불균형 문제를 다뤘습니다.',
    role: '데이터 증강 전략 비교, 생성형 AI 증강, 합성 데이터 구성, MobileNet 기반 성능 평가',
    stack: ['Python', 'PyTorch', 'Diffusion', 'YOLO', 'MobileNet', 'Data Augmentation'],
    documentation: 'macro-F1, 클래스별 F1-score, 검증 조건, 데이터 분포 변화 기록',
    learned: '<배운 점>',
    result: '<결과>',
  },
  {
    slug: 'changmin-dev',
    title: 'Changmin.dev',
    period: 'Personal Portfolio / Archive',
    oneLine: '<한 줄 설명>',
    problem: '개발자 포트폴리오와 기술 기록 아카이브를 함께 운영할 구조가 필요했습니다.',
    role: 'Next.js App Router 구조, Supabase 연동, Markdown 글쓰기, 이미지 업로드, 관리자 페이지, 배포',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Markdown', 'Vercel'],
    documentation: '기술 기록, 관리자 작성 흐름, 배포와 유지보수 기록',
    learned: '<배운 점>',
    result: '<결과>',
  },
];

export const futureProjects = [
  '관광 웹앱',
  '유기견 보호소 관리 시스템',
  '텍스트 분석 프로젝트',
];

export const coreTracks = [
  {
    title: 'Data & AI',
    description: '<데이터 수집, 분석, 모델 평가, 증강 실험 경험 설명>',
    items: ['Crawling', 'LLM', 'Model Evaluation', 'Data Augmentation'],
  },
  {
    title: 'Web Service',
    description: '<프론트엔드, 백엔드, DB, 사용자 화면 구현 경험 설명>',
    items: ['Next.js', 'Spring Boot', 'Supabase', 'MySQL'],
  },
  {
    title: 'Cloud & Operation',
    description: '<배포, 모니터링, 성능 테스트, 인프라 실습 경험 설명>',
    items: ['AWS', 'Docker', 'Jenkins', 'Grafana', 'nGrinder'],
  },
  {
    title: 'Writing & Documentation',
    description: '<요구사항 정의, WBS, 회의록, 실험 기록, 기술 글쓰기 등 개발 문서화 역량 설명>',
    items: ['Requirements', 'WBS', 'Meeting Notes', 'Technical Writing'],
  },
];

export const archiveCategories = [
  'Troubleshooting',
  'Dev Log',
  'Infra Notes',
  'Data Lab',
  'Project Review',
];

export const recentTechNotes = [
  {
    title: '<기술 글 제목>',
    category: 'Dev Log',
    date: '2026.04',
    description: '<기술 학습, 트러블슈팅, 실험 메모를 요약>',
    tags: ['Next.js', 'Supabase', 'Markdown'],
  },
  {
    title: '<기술 글 제목>',
    category: 'Troubleshooting',
    date: '2026.03',
    description: '<뉴스 수집, 데이터 처리, 실패 케이스 등 기술 기록 요약>',
    tags: ['Crawling', 'LLM', 'MySQL'],
  },
  {
    title: '<기술 글 제목>',
    category: 'Infra Notes',
    date: '2026.02',
    description: '<배포, 모니터링, 성능 테스트 기록 요약>',
    tags: ['nGrinder', 'Grafana', 'Prometheus'],
  },
];

export const writingCategories = ['Essay', 'Poem', 'Review', 'Publication', 'Brunch'];

export const writingPreview = [
  {
    title: 'Publication',
    description: '개인 저서 《사랑과 타박상》',
  },
  {
    title: 'Brunch Story',
    description: '브런치스토리 작가 활동',
  },
  {
    title: 'Literary Writing',
    description: '산문, 시, 서평 기록',
  },
];
