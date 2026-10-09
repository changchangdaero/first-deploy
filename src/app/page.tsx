// 랜딩 페이지: "/" 첫 화면을 Engineering, Literature 두 문으로 나눠 보여줍니다.
import LandingSplit from '@/components/landing/LandingSplit';

export default function Home() {
  return (
    <main id="home">
      <LandingSplit />
    </main>
  );
}
