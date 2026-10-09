// 랜딩 페이지: "/" 첫 화면에 이름과 Engineering, Literature 두 갈래 문만 보여줍니다.
import HeroTitle from '@/components/HeroTitle';
import ThemedSiteHeader from '@/components/ThemedSiteHeader';
import LandingDoors from '@/components/landing/LandingDoors';
import { landing } from '@/data/landing';
import { landingHeader } from '@/data/navigation';

export default function Home() {
  return (
    <>
      <ThemedSiteHeader config={landingHeader} />
      <main className="portfolio-page landing-page">
        <div className="portfolio-main">
          <section id="home" className="hero-section landing-hero">
            <p className="landing-hero__name">{landing.name}</p>
            <HeroTitle text={landing.title} />
          </section>
          <LandingDoors />
        </div>
      </main>
    </>
  );
}
