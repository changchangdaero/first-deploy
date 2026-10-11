// 프로젝트 카드: 이미지와 요약을 가로로 놓은 카드로 프로젝트를 소개하고 상세 페이지로 연결합니다.
// 이미지 칸은 썸네일 → 아키텍처 그림 → 이름과 스택을 넣은 대체 칸 순서로 채웁니다.
import Image from 'next/image';
import Link from 'next/link';

import { PROJECT_STATUS_LABELS, projectImagePath, type Project } from '@/data/engineering/projects';
import { publicFileExists } from '@/lib/public-file';

type ProjectCardProps = {
  project: Project;
  index: number;
};

function pickCardImage(project: Project) {
  const candidates = [
    project.thumbnail ? { file: project.thumbnail, isDiagram: false } : null,
    project.architecture ? { file: project.architecture.file, isDiagram: true } : null,
  ];

  for (const candidate of candidates) {
    if (candidate && publicFileExists(projectImagePath(project.slug, candidate.file))) {
      return { src: projectImagePath(project.slug, candidate.file), isDiagram: candidate.isDiagram };
    }
  }

  return null;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const image = pickCardImage(project);

  return (
    <Link href={`/engineering/projects/${project.slug}`} className="showcase-project-card showcase-project-card--link"
      data-reveal
    >
      <div className="showcase-project-card__media">
        {image ? (
          <Image
            src={image.src}
            alt={`${project.title} ${image.isDiagram ? '구성도' : '프로젝트 화면'}`}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className={
              image.isDiagram
                ? 'showcase-project-card__image showcase-project-card__image--diagram'
                : 'showcase-project-card__image'
            }
          />
        ) : (
          <div className="showcase-project-card__fallback" aria-hidden="true">
            <span className="showcase-project-card__fallback-title">{project.title}</span>
            <span className="showcase-project-card__fallback-stack">{project.stack.slice(0, 3).join(' · ')}</span>
          </div>
        )}
      </div>

      <div className="showcase-project-card__body">
        <div className="showcase-project-card__meta">
          <span className="showcase-project-card__index">
            {String(index + 1).padStart(2, '0')}
            <span className="showcase-project-card__category">{project.category}</span>
          </span>
          <span className={`project-status project-status--${project.status}`}>
            {PROJECT_STATUS_LABELS[project.status]}
          </span>
        </div>
        <h3 className="showcase-project-card__title">{project.title}</h3>
        <p className="showcase-project-card__subtitle">{project.summary}</p>
        <p className="showcase-project-card__description">{project.context}</p>
        {project.award ? <p className="showcase-project-card__highlight">{'// '}{project.award}</p> : null}
        <ul className="showcase-project-card__stack" aria-label="기술 스택">
          {project.stack.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
