// 홈 히어로 섹션: 첫 화면에 애니메이션 제목과 주요 이동 링크를 보여줍니다.
import Link from 'next/link';

import HeroTitle from '@/components/HeroTitle';

export default function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <p className="section-eyebrow">Changmin.dev</p>
      <HeroTitle text="Hello, Changmin World!" />
      
      <nav className="hero-links" aria-label="주요 링크">
        <Link href="/projects">Projects</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </section>
  );
}
