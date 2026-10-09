// 프로젝트 목록: 모든 프로젝트를 같은 형식의 가로 카드로 나열합니다. 순서는 데이터 파일의 순서를 따릅니다.
import ProjectCard from '@/components/engineering/ProjectCard';
import SectionHeader from '@/components/SectionHeader';
import { projects } from '@/data/engineering/projects';
import { engineeringSections as sections } from '@/data/engineering/sections';

export default function ProjectGrid() {
  return (
    <section id="projects" className="content-section" aria-labelledby="projects-title">
      <SectionHeader
        eyebrow={sections.projects.eyebrow}
        title={sections.projects.title}
        description={sections.projects.description}
        titleId="projects-title"
      />

      <div className="projects-grid projects-grid--list">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
