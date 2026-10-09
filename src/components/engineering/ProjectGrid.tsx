// 프로젝트 목록: 메인 프로젝트는 크게, 서브 프로젝트는 짧은 카드로 나눠 보여줍니다.
import ProjectCard from '@/components/engineering/ProjectCard';
import SectionHeader from '@/components/SectionHeader';
import { projects } from '@/data/engineering/projects';
import { engineeringSections as sections } from '@/data/engineering/sections';

export default function ProjectGrid() {
  const mainProjects = projects.filter((project) => project.tier === 'main');
  const subProjects = projects.filter((project) => project.tier === 'sub');

  return (
    <section id="projects" className="content-section" aria-labelledby="projects-title">
      <SectionHeader
        eyebrow={sections.projects.eyebrow}
        title={sections.projects.title}
        description={sections.projects.description}
        titleId="projects-title"
      />

      <h3 className="projects-group-label">{sections.projects.mainLabel}</h3>
      <div className="projects-grid projects-grid--main">
        {mainProjects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>

      <h3 className="projects-group-label">{sections.projects.subLabel}</h3>
      <div className="projects-grid projects-grid--sub">
        {subProjects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={mainProjects.length + index} />
        ))}
      </div>
    </section>
  );
}
