// 프로젝트 상세 페이지: "/engineering/projects/[slug]"에 프로젝트 하나의 상세 내용을 보여줍니다.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProjectDetail from '@/components/engineering/ProjectDetail';
import { getProject, projects } from '@/data/engineering/projects';

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 데이터에 없는 slug는 404로 보냅니다.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: `${project.title} | Changmin.dev`, description: project.summary },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="portfolio-page">
      <div className="portfolio-main">
        <ProjectDetail project={project} />
      </div>
    </main>
  );
}
