// Engineering 페이지: "/engineering"에 엔지니어링 소개, 기술 스택, 프로젝트 목록을 보여줍니다.
import type { Metadata } from 'next';

import EngAbout from '@/components/engineering/EngAbout';
import EngTechStack from '@/components/engineering/EngTechStack';
import ProjectGrid from '@/components/engineering/ProjectGrid';
import { engineeringSections as sections } from '@/data/engineering/sections';

export const metadata: Metadata = {
  title: sections.meta.title,
  description: sections.meta.description,
  openGraph: { title: `${sections.meta.title} | Changmin.dev`, description: sections.meta.description },
};

export default function EngineeringPage() {
  return (
    <main className="portfolio-page">
      <div className="portfolio-main">
        <EngAbout />
        <EngTechStack />
        <ProjectGrid />
      </div>
    </main>
  );
}
