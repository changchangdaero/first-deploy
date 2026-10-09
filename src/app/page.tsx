// 랜딩 페이지: "/" 첫 화면을 Engineering, Literature 두 문으로 나눠 보여줍니다.
import ThemedSiteHeader from '@/components/ThemedSiteHeader';
import LandingSplit from '@/components/landing/LandingSplit';
import { landingHeader } from '@/data/navigation';

export default function Home() {
  return (
    <>
      <ThemedSiteHeader config={landingHeader} />
      <main id="home">
        <LandingSplit />
      </main>
    </>
  );
}
