// Archive 레이아웃: "/archive" 하위 페이지에 Engineering 헤더를 씌웁니다. (메뉴에는 노출하지 않음)
import ThemedSiteHeader from '@/components/ThemedSiteHeader';
import { engineeringHeader } from '@/data/navigation';

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemedSiteHeader config={engineeringHeader} />
      {children}
    </>
  );
}
