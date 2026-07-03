// Next.js 사이트 설정: 포트폴리오 앱의 이미지 처리와 빌드 동작을 관리합니다.
/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    unoptimized: true, // 깃허브 페이지 이미지 최적화 비활성화
  },
};

export default nextConfig;
