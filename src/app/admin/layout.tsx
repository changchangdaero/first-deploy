// Admin 레이아웃: "/admin" 하위 페이지에 Engineering 헤더를 씌웁니다.
import ThemedSiteHeader from '@/components/ThemedSiteHeader';
import { engineeringHeader } from '@/data/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemedSiteHeader config={engineeringHeader} />
      {children}
    </>
  );
}
