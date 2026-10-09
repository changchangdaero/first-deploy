// 프로젝트 카드: 메인(크게, 썸네일 포함)과 서브(짧게) 두 형태로 프로젝트를 요약하고 상세 페이지로 연결합니다.
import Image from 'next/image';
import Link from 'next/link';
import { FiImage } from 'react-icons/fi';

import { PROJECT_STATUS_LABELS, projectImagePath, type Project } from '@/data/engineering/projects';
import { publicFileExists } from '@/lib/public-file';

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isMain = project.tier === 'main';
  const thumbnail = project.thumbnail ? projectImagePath(project.slug, project.thumbnail) : '';
  const hasThumbnail = publicFileExists(thumbnail);

  return (
    <Link
      href={`/engineering/projects/${project.slug}`}
      className={`showcase-project-card showcase-project-card--link showcase-project-card--${project.tier}`}
    >
      {isMain ? (
        <div className="showcase-project-card__media">
          {hasThumbnail ? (
            <Image
              src={thumbnail}
              alt={`${project.title} 프로젝트 화면`}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="showcase-project-card__image"
            />
          ) : (
            <div className="showcase-project-card__placeholder">
              <FiImage aria-hidden="true" />
              <span>Coming soon</span>
            </div>
          )}
        </div>
      ) : null}

      <div className="showcase-project-card__body">
        <div className="showcase-project-card__meta">
          <span>{String(index + 1).padStart(2, '0')}</span>
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
