/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 정적 사이트 배포 설정
  images: {
    unoptimized: true, // 깃허브 페이지 이미지 최적화 비활성화
  },
};

export default nextConfig;