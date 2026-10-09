import type { Metadata } from 'next';
import Image from 'next/image';
import { FiArrowUpRight, FiGithub, FiImage } from 'react-icons/fi';

import { PROJECTS, type ProjectStatus } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Projects | Changmin.dev',
  description: '인프라, 웹, AI를 연결해 만든 유창민의 프로젝트 모음입니다.',
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  done: '완료',
  wip: '진행 중',
  planned: '예정',
};

export default function ProjectsPage() {
  return (
    <main className="portfolio-page">
      <div className="portfolio-main projects-page">
        <section id="projects" className="projects-showcase" aria-labelledby="projects-title">
          <header className="page-intro projects-showcase__header">
            <p className="section-eyebrow">PROJECTS</p>
            <h1 id="projects-title">What I&apos;ve Built</h1>
            <p>시스템을 직접 세우고, 데이터를 관찰하고, 다시 더 단단하게 만드는 과정을 기록합니다.</p>
          </header>

          <div className="projects-grid">
            {PROJECTS.map((project, index) => (
              <article className="showcase-project-card" key={project.id}>
                <div className="showcase-project-card__media">
                  {project.thumbnail ? (
                    <Image src={project.thumbnail} alt={`${project.title} 프로젝트 화면`} fill sizes="(max-width: 767px) 100vw, 50vw" className="showcase-project-card__image" />
                  ) : (
                    <div className="showcase-project-card__placeholder">
                      <FiImage aria-hidden="true" />
                      <span>Coming soon</span>
                    </div>
                  )}
                </div>

                <div className="showcase-project-card__body">
                  <div className="showcase-project-card__meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span className={`project-status project-status--${project.status}`}>{STATUS_LABELS[project.status]}</span>
                  </div>
                  <h2>{project.title}</h2>
                  <p className="showcase-project-card__subtitle">{project.subtitle}</p>
                  <p className="showcase-project-card__description">{project.description}</p>
                  {project.highlight ? <p className="showcase-project-card__highlight">{'// '}{project.highlight}</p> : null}
                  <ul className="showcase-project-card__stack" aria-label="기술 스택">
                    {project.stack.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                  {project.links?.github || project.links?.demo ? (
                    <div className="showcase-project-card__links">
                      {project.links.github ? <a href={project.links.github} target="_blank" rel="noreferrer"><FiGithub aria-hidden="true" /> GitHub</a> : null}
                      {project.links.demo ? <a href={project.links.demo} target="_blank" rel="noreferrer"><FiArrowUpRight aria-hidden="true" /> Demo</a> : null}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
