// 프로젝트 페이지: "/projects" 화면에 프로젝트 상세 카드와 기술 스택 링크를 보여줍니다.
import Link from 'next/link';

import SectionHeading from '@/components/home/SectionHeading';
import TagList from '@/components/home/TagList';
import { futureProjects, projects } from '@/data/portfolio';

export default function ProjectsPage() {
  return (
    <main className="portfolio-page">
      <div className="portfolio-main">
        <header className="page-intro">
          <p className="section-eyebrow">Projects</p>
          <h1>Project</h1>
          <p>{'<프로젝트별 문제, 역할, 기술, 결과, 회고를 정리하는 페이지 설명>'}</p>
        </header>

        <section className="content-section">
          <SectionHeading
            eyebrow="Selected"
            title="<프로젝트 상세 섹션 제목>"
            description="<대표 프로젝트를 상세히 읽을 수 있다는 설명>"
          />
          <div className="project-list">
            {projects.map((project) => (
              <article id={project.slug} key={project.slug} className="project-card project-card--detail">
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
                    <dt>기술</dt>
                    <dd>
                      <TagList tags={project.stack} />
                    </dd>
                  </div>
                  <div>
                    <dt>결과</dt>
                    <dd>{project.result}</dd>
                  </div>
                  <div>
                    <dt>회고</dt>
                    <dd>{project.learned}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <SectionHeading
            eyebrow="Next"
            title="<추가 예정 프로젝트 섹션 제목>"
            description="<이후 추가 가능한 프로젝트를 정리하는 설명>"
          />
          <div className="note-list">
            {futureProjects.map((project) => (
              <article key={project} className="note-card">
                <h3>{project}</h3>
                <p>{'<추가 예정 프로젝트 설명>'}</p>
              </article>
            ))}
          </div>
        </section>

        <Link href="/contact" className="text-link">
          Contact
        </Link>
      </div>
    </main>
  );
}
