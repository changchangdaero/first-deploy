// 프로젝트 상세: 요약 → 기본 정보 → 스택 → 아키텍처 → 내가 한 일 → 트러블슈팅 → 결과 → 배운 점/한계 → 링크 순서로 보여줍니다.
// 데이터가 비어 있거나 이미지 파일이 없는 섹션은 통째로 숨깁니다.
import Image from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FiArrowUpRight, FiFileText, FiGithub, FiPlayCircle } from 'react-icons/fi';

import {
  PROJECT_STATUS_LABELS,
  getAdjacentProjects,
  projectImagePath,
  type Project,
  type ProjectImage,
} from '@/data/engineering/projects';
import { engineeringSections } from '@/data/engineering/sections';
import { publicFileExists } from '@/lib/public-file';

const labels = engineeringSections.projectDetail;

type LinkKey = keyof NonNullable<Project['links']>;

const LINK_ORDER: LinkKey[] = ['github', 'video', 'slides', 'demo'];

const LINK_ICONS: Record<LinkKey, IconType> = {
  github: FiGithub,
  video: FiPlayCircle,
  slides: FiFileText,
  demo: FiArrowUpRight,
};

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="project-detail__section">
      <h2 className="project-detail__heading">{title}</h2>
      {children}
    </section>
  );
}

function Figure({ slug, image, priority }: { slug: string; image: ProjectImage; priority?: boolean }) {
  return (
    <figure className="project-detail__figure">
      <Image
        src={projectImagePath(slug, image.file)}
        alt={image.caption}
        width={1600}
        height={900}
        sizes="(max-width: 880px) 100vw, 880px"
        className="project-detail__image"
        priority={priority}
      />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}

function hasImage(slug: string, image?: ProjectImage) {
  return Boolean(image) && publicFileExists(projectImagePath(slug, image!.file));
}

export default function ProjectDetail({ project }: { project: Project }) {
  const { slug } = project;
  const showArchitecture = hasImage(slug, project.architecture);
  const screenshots = (project.screenshots ?? []).filter((image) => hasImage(slug, image));
  const metrics = project.metrics ?? [];
  const troubleshooting = project.troubleshooting ?? [];
  const learnings = project.learnings ?? [];
  const limitations = project.limitations ?? [];
  const links = LINK_ORDER.filter((key) => project.links?.[key]);
  const { previous, next } = getAdjacentProjects(slug);

  return (
    <article className="project-detail">
      <Link href="/engineering#projects" className="text-link project-detail__back">
        ← {labels.back}
      </Link>

      {/* ① 요약 */}
      <header className="project-detail__header">
        <div className="project-detail__meta">
          <span className={`project-status project-status--${project.status}`}>
            {PROJECT_STATUS_LABELS[project.status]}
          </span>
          <span>{project.context}</span>
        </div>
        <h1 className="project-detail__title">{project.title}</h1>
        <p className="project-detail__summary">{project.summary}</p>
        {project.award ? <p className="showcase-project-card__highlight">{'// '}{project.award}</p> : null}
        {project.background ? <p className="project-detail__background">{project.background}</p> : null}
      </header>

      {/* ② 기본 정보 */}
      <dl className="project-detail__facts">
        {(['period', 'team', 'role'] as const).map((key) => (
          <div key={key} className="project-detail__fact">
            <dt>{labels.facts[key]}</dt>
            <dd>{project[key]}</dd>
          </div>
        ))}
      </dl>

      {/* ③ 기술 스택 */}
      {project.stack.length > 0 ? (
        <DetailSection title={labels.stack}>
          <ul className="showcase-project-card__stack project-detail__stack">
            {project.stack.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </DetailSection>
      ) : null}

      {/* ④ 아키텍처 */}
      {showArchitecture && project.architecture ? (
        <DetailSection title={labels.architecture}>
          <Figure slug={slug} image={project.architecture} priority />
        </DetailSection>
      ) : null}

      {/* ⑤ 내가 한 일 */}
      {project.contributions.length > 0 ? (
        <DetailSection title={labels.contributions}>
          <ul className="profile-list project-detail__list">
            {project.contributions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {project.teamContext ? (
            <div className="project-detail__note">
              <strong>{labels.teamContext}</strong>
              <p>{project.teamContext}</p>
            </div>
          ) : null}
        </DetailSection>
      ) : null}

      {/* ⑤-2 트러블슈팅 */}
      {troubleshooting.length > 0 ? (
        <DetailSection title={labels.troubleshooting}>
          <div className="project-detail__troubles">
            {troubleshooting.map((item, index) => (
              <dl key={`${item.problem}-${index}`} className="project-detail__trouble">
                {(['problem', 'cause', 'solution', 'result'] as const).map((step) => (
                  <div key={step} className={`project-detail__trouble-row project-detail__trouble-row--${step}`}>
                    <dt>{labels.troubleshootingSteps[step]}</dt>
                    <dd>{item[step]}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </div>
        </DetailSection>
      ) : null}

      {/* ⑥ 결과 */}
      {metrics.length > 0 || screenshots.length > 0 ? (
        <DetailSection title={labels.results}>
          {metrics.length > 0 ? (
            <dl className="project-detail__metrics">
              {metrics.map((metric) => (
                <div key={metric.label} className="project-detail__metric">
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {screenshots.length > 0 ? (
            <div className="project-detail__gallery">
              {screenshots.map((image) => (
                <Figure key={image.file} slug={slug} image={image} />
              ))}
            </div>
          ) : null}
        </DetailSection>
      ) : null}

      {/* ⑦ 배운 점 / 한계 */}
      {learnings.length > 0 || limitations.length > 0 ? (
        <div className="project-detail__reflection">
          {learnings.length > 0 ? (
            <DetailSection title={labels.learnings}>
              <ul className="profile-list project-detail__list">
                {learnings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailSection>
          ) : null}
          {limitations.length > 0 ? (
            <DetailSection title={labels.limitations}>
              <ul className="profile-list project-detail__list">
                {limitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailSection>
          ) : null}
        </div>
      ) : null}

      {/* ⑧ 링크 */}
      {links.length > 0 ? (
        <DetailSection title={labels.links}>
          <div className="showcase-project-card__links project-detail__links">
            {links.map((key) => {
              const Icon = LINK_ICONS[key];
              return (
                <a key={key} href={project.links?.[key]} target="_blank" rel="noopener noreferrer">
                  <Icon aria-hidden="true" /> {labels.linkLabels[key]}
                </a>
              );
            })}
          </div>
        </DetailSection>
      ) : null}

      {/* 이전 / 다음 프로젝트 */}
      <nav className="project-detail__pager" aria-label="프로젝트 이동">
        {previous ? (
          <Link href={`/engineering/projects/${previous.slug}`} className="project-detail__pager-link">
            <span>← {labels.previous}</span>
            <strong>{previous.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/engineering/projects/${next.slug}`}
            className="project-detail__pager-link project-detail__pager-link--next"
          >
            <span>{labels.next} →</span>
            <strong>{next.title}</strong>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
