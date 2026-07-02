// 홈 대표 프로젝트 섹션: 상세 프로젝트 페이지로 이어지는 요약 프로젝트 카드를 보여줍니다.
import Link from 'next/link';

import { projects } from '@/data/portfolio';
import SectionHeading from './SectionHeading';
import TagList from './TagList';

export default function FeaturedProjects() {
  return (
    <section id="projects" className="content-section">
      <SectionHeading
        eyebrow="Projects"
        title="<대표 프로젝트 섹션 제목>"
        description="<대표 프로젝트 3개를 요약해서 보여주는 설명>"
      />
      <div className="project-list">
        {projects.map((project) => (
          <article key={project.slug} className="project-card">
            <div className="project-card__header">
              <div>
                <p>{project.period}</p>
                <h3>{project.title}</h3>
              </div>
            </div>
            <p className="project-card__summary">{project.oneLine}</p>
            <dl className="project-card__meta">
              <div>
                <dt>문제</dt>
                <dd>{project.problem}</dd>
              </div>
              <div>
                <dt>내 역할</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>기록/문서화 포인트</dt>
                <dd>{project.documentation}</dd>
              </div>
              <div>
                <dt>배운 점</dt>
                <dd>{project.learned}</dd>
              </div>
            </dl>
            <TagList tags={project.stack} />
            <Link href={`/projects#${project.slug}`} className="text-link">
              자세히 보기
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
