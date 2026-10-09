// Next.js 사이트 설정: 포트폴리오 앱의 이미지 처리, 빌드 동작, 예전 주소 리다이렉트를 관리합니다.
/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    unoptimized: true, // 깃허브 페이지 이미지 최적화 비활성화
  },
  async redirects() {
    return [
      { source: '/projects', destination: '/engineering#projects', permanent: true },
      { source: '/writing', destination: '/literature', permanent: true },
      { source: '/contact', destination: '/engineering', permanent: true },
    ];
  },
};

export default nextConfig;
