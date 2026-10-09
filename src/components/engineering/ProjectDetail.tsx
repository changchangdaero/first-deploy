// 프로젝트 상세: 요약 → 대표 사진 → 기본 정보 → 스택 → 아키텍처 → 내가 한 일 → 트러블슈팅 → 설계 결정
// → 표 → 코드 → 결과 → 배운 점/한계/다음 과제 → 링크 순서로 보여줍니다.
// 데이터가 비어 있거나 이미지 파일이 없는 섹션은 통째로 숨깁니다.
import Image from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FiAlertCircle, FiArrowUpRight, FiBox, FiFileText, FiGithub, FiPlayCircle } from 'react-icons/fi';

import CodeBlock from '@/components/engineering/CodeBlock';
import RichText from '@/components/engineering/RichText';
import {
  PROJECT_STATUS_LABELS,
  getAdjacentProjects,
  projectImagePath,
  type Project,
  type ProjectImage,
  type ProjectTroubleshooting,
} from '@/data/engineering/projects';
import { engineeringSections } from '@/data/engineering/sections';
import { publicFileExists } from '@/lib/public-file';

const labels = engineeringSections.projectDetail;

type LinkKey = keyof NonNullable<Project['links']>;

const LINK_ORDER: LinkKey[] = ['github', 'issue', 'dockerhub', 'video', 'slides', 'demo'];

const LINK_ICONS: Record<LinkKey, IconType> = {
  github: FiGithub,
  issue: FiAlertCircle,
  dockerhub: FiBox,
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

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="profile-list project-detail__list">
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}

// 이미지는 최대 높이 안에서 비율을 유지해 보여주고, 누르면 원본을 새 탭에서 엽니다.
function Figure({
  slug,
  image,
  priority,
  fallbackAlt,
}: {
  slug: string;
  image: ProjectImage;
  priority?: boolean;
  fallbackAlt?: string;
}) {
  const src = projectImagePath(slug, image.file);
  const alt = image.caption || fallbackAlt || '';

  return (
    <figure className="project-detail__figure">
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="project-detail__image-link"
        aria-label={`${alt} 원본 보기`}
      >
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          sizes="(max-width: 880px) 100vw, 880px"
          className="project-detail__image"
          priority={priority}
        />
      </a>
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}

function ProjectLinks({ project, keys }: { project: Project; keys: LinkKey[] }) {
  return (
    <div className="showcase-project-card__links project-detail__links">
      {keys.map((key) => {
        const Icon = LINK_ICONS[key];
        return (
          <a key={key} href={project.links?.[key]} target="_blank" rel="noopener noreferrer">
            <Icon aria-hidden="true" /> {labels.linkLabels[key]}
          </a>
        );
      })}
    </div>
  );
}

function hasImage(slug: string, image?: ProjectImage) {
  return Boolean(image) && publicFileExists(projectImagePath(slug, image!.file));
}

// 트러블슈팅 한 항목: 증상 / 원인 / 대응 / 원인 가설 / 해결 / 배운 점 중 채워진 칸만 보여줍니다.
function TroubleItem({ slug, item, index }: { slug: string; item: ProjectTroubleshooting; index: number }) {
  const steps = labels.troubleshootingSteps;
  const textRows = (['symptom', 'cause', 'response'] as const).filter((key) => item[key]);
  const afterRows = (['solution', 'lesson'] as const).filter((key) => item[key]);

  return (
    <div className="project-detail__trouble-item">
      {item.title ? (
        <h3 className="project-detail__trouble-title">
          <span>{String(index + 1).padStart(2, '0')}</span>
          {item.title}
        </h3>
      ) : null}
      <dl className="project-detail__trouble">
        {textRows.map((key) => (
          <div key={key} className={`project-detail__trouble-row project-detail__trouble-row--${key}`}>
            <dt>{steps[key]}</dt>
            <dd>
              <RichText text={item[key]!} />
            </dd>
          </div>
        ))}
        {item.hypotheses && item.hypotheses.length > 0 ? (
          <div className="project-detail__trouble-row">
            <dt>{steps.hypotheses}</dt>
            <dd>
              <ol className="project-detail__hypotheses">
                {item.hypotheses.map((hypothesis) => (
                  <li key={hypothesis}>
                    <RichText text={hypothesis} />
                  </li>
                ))}
              </ol>
            </dd>
          </div>
        ) : null}
        {afterRows.map((key) => (
          <div key={key} className={`project-detail__trouble-row project-detail__trouble-row--${key}`}>
            <dt>{steps[key]}</dt>
            <dd>
              <RichText text={item[key]!} />
            </dd>
          </div>
        ))}
      </dl>
      {item.notes && item.notes.length > 0 ? (
        <ul className="project-detail__notes">
          {item.notes.map((note) => (
            <li key={note}>
              <RichText text={note} />
            </li>
          ))}
        </ul>
      ) : null}
      {/* 항목별 증거 사진 (예: 에러 화면, 해결 후 정상 화면). 파일이 없으면 숨깁니다. */}
      {item.image && hasImage(slug, item.image) ? <Figure slug={slug} image={item.image} /> : null}
    </div>
  );
}

export default function ProjectDetail({ project }: { project: Project }) {
  const { slug } = project;
  const heroImage = project.thumbnail ? { file: project.thumbnail, caption: '' } : undefined;
  const showHero = hasImage(slug, heroImage);
  const showArchitecture = hasImage(slug, project.architecture);
  const techChoices = project.techChoices ?? [];
  const screenshots = (project.screenshots ?? []).filter((image) => hasImage(slug, image));
  const metrics = project.metrics ?? [];
  const troubleshooting = project.troubleshooting ?? [];
  const decisions = project.decisions ?? [];
  const learnings = project.learnings ?? [];
  const limitations = project.limitations ?? [];
  const nextSteps = project.nextSteps ?? [];
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
        {project.background ? (
          <p className="project-detail__background">
            <RichText text={project.background} />
          </p>
        ) : null}
        {links.length > 0 ? <ProjectLinks project={project} keys={links} /> : null}
      </header>

      {/* 대표 사진: 목록 카드의 썸네일을 상세 페이지 맨 위에도 크게 보여줍니다. */}
      {showHero && heroImage ? (
        <Figure slug={slug} image={heroImage} fallbackAlt={`${project.title} 대표 화면`} priority />
      ) : null}

      {/* ② 기본 정보 */}
      <dl className="project-detail__facts">
        {(['period', 'team', 'role'] as const).map((key) => (
          <div key={key} className="project-detail__fact">
            <dt>{labels.facts[key]}</dt>
            <dd>{project[key]}</dd>
          </div>
        ))}
      </dl>

      {/* ③ 기술 스택 + 기술 선택 이유 */}
      {project.stack.length > 0 || techChoices.length > 0 ? (
        <DetailSection title={labels.stack}>
          {project.stack.length > 0 ? (
            <ul className="showcase-project-card__stack project-detail__stack">
              {project.stack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          ) : null}
          {techChoices.length > 0 ? (
            <div className="project-detail__choices">
              <h3 className="project-detail__subheading">{labels.techChoices}</h3>
              <dl>
                {techChoices.map((choice) => (
                  <div key={choice.tech} className="project-detail__choice">
                    <dt>{choice.tech}</dt>
                    <dd>{choice.reason}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </DetailSection>
      ) : null}

      {/* ④ 아키텍처 */}
      {showArchitecture && project.architecture ? (
        <DetailSection title={labels.architecture}>
          <Figure slug={slug} image={project.architecture} priority={!showHero} />
        </DetailSection>
      ) : null}

      {/* ⑤ 내가 한 일 */}
      {project.contributions.length > 0 || project.teamContext ? (
        <DetailSection title={labels.contributions}>
          {project.contributions.length > 0 ? <TextList items={project.contributions} /> : null}
          {project.teamContext ? (
            <div className="project-detail__note">
              <strong>{labels.teamContext}</strong>
              <p>
                <RichText text={project.teamContext} />
              </p>
            </div>
          ) : null}
        </DetailSection>
      ) : null}

      {/* ⑤-2 트러블슈팅 */}
      {troubleshooting.length > 0 ? (
        <DetailSection title={labels.troubleshooting}>
          <div className="project-detail__troubles">
            {troubleshooting.map((item, index) => (
              <TroubleItem key={`${item.symptom}-${index}`} slug={slug} item={item} index={index} />
            ))}
          </div>
        </DetailSection>
      ) : null}

      {/* 설계 결정 */}
      {decisions.length > 0 ? (
        <DetailSection title={labels.decisions}>
          <div className="project-detail__troubles">
            {decisions.map((decision) => (
              <div key={decision.title} className="project-detail__trouble-item">
                <h3 className="project-detail__trouble-title">{decision.title}</h3>
                <dl className="project-detail__trouble">
                  {(['options', 'decision', 'tradeoff'] as const)
                    .filter((key) => decision[key])
                    .map((key) => (
                      <div key={key} className={`project-detail__trouble-row project-detail__trouble-row--${key}`}>
                        <dt>{labels.decisionSteps[key]}</dt>
                        <dd>
                          <RichText text={decision[key]!} />
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>
            ))}
          </div>
        </DetailSection>
      ) : null}

      {/* 표: 모바일에서는 행마다 카드처럼 쌓여 가로 스크롤이 생기지 않습니다. */}
      {project.table && project.table.rows.length > 0 ? (
        <DetailSection title={project.table.title}>
          <table className="project-detail__table">
            <thead>
              <tr>
                <th scope="col">{project.table.columns[0]}</th>
                <th scope="col">{project.table.columns[1]}</th>
              </tr>
            </thead>
            <tbody>
              {project.table.rows.map(([left, right]) => (
                <tr key={left}>
                  <th scope="row" data-label={project.table!.columns[0]}>
                    <RichText text={left} />
                  </th>
                  <td data-label={project.table!.columns[1]}>
                    <RichText text={right} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DetailSection>
      ) : null}

      {/* 코드 */}
      {project.code ? (
        <DetailSection title={project.code.title}>
          <CodeBlock code={project.code} />
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
            <div
              className={
                screenshots.length > 1 ? 'project-detail__gallery project-detail__gallery--multi' : 'project-detail__gallery'
              }
            >
              {screenshots.map((image) => (
                <Figure key={image.file} slug={slug} image={image} />
              ))}
            </div>
          ) : null}
        </DetailSection>
      ) : null}

      {/* ⑦ 배운 점 / 한계 / 다음 개선 과제 */}
      {learnings.length > 0 || limitations.length > 0 || nextSteps.length > 0 ? (
        <div className="project-detail__reflection">
          {learnings.length > 0 ? (
            <DetailSection title={labels.learnings}>
              <TextList items={learnings} />
            </DetailSection>
          ) : null}
          {limitations.length > 0 ? (
            <DetailSection title={labels.limitations}>
              <TextList items={limitations} />
            </DetailSection>
          ) : null}
          {nextSteps.length > 0 ? (
            <DetailSection title={labels.nextSteps}>
              <TextList items={nextSteps} />
            </DetailSection>
          ) : null}
        </div>
      ) : null}

      {/* ⑧ 링크 */}
      {links.length > 0 ? (
        <DetailSection title={labels.links}>
          <ProjectLinks project={project} keys={links} />
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
