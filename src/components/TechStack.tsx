// 기술 스택 섹션: 홈페이지에 기술 아이콘과 이름을 그리드로 보여줍니다.
import Image from 'next/image';
import Link from 'next/link';

import SectionHeader from '@/components/SectionHeader';

type Skill = {
  name: string;
  icon: string;
};

type TechCta = {
  title: string;
  subtitle: string;
  href: string;
  ariaLabel: string;
};

const languageFrameworks: Skill[] = [
  { name: 'Java', icon: '/tech-icons/java.svg' },
  { name: 'Spring', icon: '/tech-icons/spring.svg' },
  { name: 'SQL', icon: '/tech-icons/sql.svg' },
  { name: 'React', icon: '/tech-icons/react.svg' },
  { name: 'JavaScript', icon: '/tech-icons/javascript.svg' },
  { name: 'Python', icon: '/tech-icons/python.svg' },
];

const toolsInfra: Skill[] = [
  { name: 'Linux', icon: '/tech-icons/linux.svg' },
  { name: 'Docker', icon: '/tech-icons/docker.svg' },
  { name: 'AWS', icon: '/tech-icons/aws.svg' },
];

const techCtas: TechCta[] = [
  {
    title: 'Projects',
    subtitle: '프로젝트 기록',
    href: '/projects',
    ariaLabel: 'Projects 페이지로 이동',
  },
  {
    title: 'Technical Archive',
    subtitle: '실습기록',
    href: '/archive',
    ariaLabel: 'Technical Archive 페이지로 이동',
  },
];

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <span className="tech-skill-card">
      <Image
        src={skill.icon}
        alt=""
        width={28}
        height={28}
        className="tech-skill-card__icon"
        aria-hidden="true"
      />
      <span>{skill.name}</span>
    </span>
  );
}

function SkillGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="tech-skill-grid">
      {skills.map((skill) => (
        <SkillCard key={skill.name} skill={skill} />
      ))}
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="content-section tech-stack-section" aria-labelledby="tech-stack-title">
      <SectionHeader eyebrow="Tech Stack" title="Tech Stack" titleId="tech-stack-title" />
      <div className="tech-stack-group">
        <h3>Languages / Frameworks</h3>
        <SkillGrid skills={languageFrameworks} />
      </div>

      <div className="tech-stack-group">
        <h3>Tools / Infra</h3>
        <SkillGrid skills={toolsInfra} />
      </div>

      <nav className="tech-cta-list" aria-label="포트폴리오 주요 페이지">
        {techCtas.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="tech-cta-card"
            aria-label={item.ariaLabel}
          >
            <span className="tech-cta-card__text">
              <span className="tech-cta-card__title">{item.title}</span>
              <span className="tech-cta-card__subtitle">{item.subtitle}</span>
            </span>
            <span className="tech-cta-card__icon" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
