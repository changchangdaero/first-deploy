// 홈 페이지: "/" 첫 화면에 히어로, 소개 요약, 수상, 기술 스택 섹션을 배치합니다.
import Award from '@/components/Award';
import Contact from '@/components/Contact';
import TechStack from '@/components/TechStack';
import AboutSummary from '@/components/home/AboutSummary';
import HeroSection from '@/components/home/HeroSection';

export default function Home() {
  return (
    <main className="portfolio-page">
      <div className="portfolio-main">
        <HeroSection />
        <AboutSummary />
        <Award />
        <TechStack />
        <Contact />
      </div>
    </main>
  );
}
