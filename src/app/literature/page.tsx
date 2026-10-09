// Literature 페이지: "/literature"에 문학 소개, 출간물, 활동 이력을 보여줍니다.
import type { Metadata } from 'next';

import Activities from '@/components/literature/Activities';
import LitAbout from '@/components/literature/LitAbout';
import Works from '@/components/literature/Works';
import { literatureSections as sections } from '@/data/literature/sections';

export const metadata: Metadata = {
  title: sections.meta.title,
  description: sections.meta.description,
  openGraph: { title: `${sections.meta.title} | Changmin.dev`, description: sections.meta.description },
};

export default function LiteraturePage() {
  return (
    <main className="portfolio-page">
      <div className="portfolio-main">
        <LitAbout />
        <Works />
        <Activities />
      </div>
    </main>
  );
}
