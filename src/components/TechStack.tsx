'use client';

const ICON_HEX = '4b5563';

const getIconUrl = (skill: string) => {
  const s = skill.toLowerCase().trim();
  let slug = s;

  if (s === 'java') slug = 'openjdk';
  else if (s === 'next.js') slug = 'nextdotjs';
  else if (s === 'spring') slug = 'springboot';
  else if (s === 'javascript') slug = 'javascript';
  else if (s === 'sql') slug = 'sqlite';
  else if (s === 'jenkins') slug = 'jenkins';
  else if (s === 'python') slug = 'python';
  else if (s === 'docker') slug = 'docker';
  else if (s === 'react') slug = 'react';
  else if (s === 'grafana') slug = 'grafana';
  else if (s === 'prometheus') slug = 'prometheus';
  else if (s === 'linux') slug = 'linux';

  return `https://cdn.simpleicons.org/${slug}/${ICON_HEX}`;
};

function SkillGrid({ skills }: { skills: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
      {skills.map((skill) => (
        <span key={skill} className="skill-card">
          <img
            src={getIconUrl(skill)}
            alt={skill}
            width={18}
            height={18}
            className="w-[18px] h-[18px] shrink-0 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="truncate">{skill}</span>
        </span>
      ))}
    </div>
  );
}

export default function TechStack({ skills }: { skills: string[] }) {
  const coreOrder = ['Java', 'Spring', 'SQL', 'React', 'Next.js', 'JavaScript'];
  const toolOrder = ['Linux', 'Docker', 'Jenkins', 'Grafana', 'Prometheus', 'Python'];

  const skillSet = new Set(skills);

  const coreSkills = coreOrder.filter((skill) => skillSet.has(skill));
  const toolSkills = toolOrder.filter((skill) => skillSet.has(skill));

  return (
    <section className="w-full space-y-6">
      <h2 className="section-title">Tech Stack</h2>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
          Languages / Frameworks
        </h3>
        <SkillGrid skills={coreSkills} />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
          Tools / Infra
        </h3>
        <SkillGrid skills={toolSkills} />
      </div>
    </section>
  );
}