// Engineering Tech Stack: 기존 홈 화면의 아이콘 카드 그리드 디자인으로 그룹별 기술 스택을 보여줍니다.
import Image from 'next/image';

import SectionHeader from '@/components/SectionHeader';
import { engineeringSections as sections } from '@/data/engineering/sections';
import { techStackGroups, type Skill } from '@/data/engineering/techStack';

function SkillCard({ skill }: { skill: Skill }) {
  const SkillIcon = skill.icon;

  return (
    <span className="tech-skill-card" data-reveal>
      {typeof SkillIcon === 'string' ? (
        <Image
          src={SkillIcon}
          alt=""
          width={28}
          height={28}
          className="tech-skill-card__icon"
          aria-hidden="true"
        />
      ) : (
        <SkillIcon className="tech-skill-card__icon" aria-hidden="true" focusable="false" />
      )}
      <span>{skill.name}</span>
    </span>
  );
}

export default function EngTechStack() {
  return (
    <section id="tech-stack" className="content-section tech-stack-section" aria-labelledby="tech-stack-title">
      <SectionHeader
        eyebrow={sections.techStack.eyebrow}
        title={sections.techStack.title}
        titleId="tech-stack-title"
      />
      {techStackGroups.map((group) => (
        <div key={group.title} className="tech-stack-group">
          <h3 data-reveal>{group.title}</h3>
          <div className="tech-skill-grid">
            {group.skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
