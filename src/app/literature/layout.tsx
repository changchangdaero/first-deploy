// Literature 레이아웃: "/literature" 하위 페이지에 Literature 헤더를 씌웁니다.
import ThemedSiteHeader from '@/components/ThemedSiteHeader';
import { literatureHeader } from '@/data/navigation';

export default function LiteratureLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemedSiteHeader config={literatureHeader} />
      {children}
    </>
  );
}
