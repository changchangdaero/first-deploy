const getIconUrl = (skill: string) => {
    const s = skill.toLowerCase().trim();
    let slug = s;
    if (s === "java") slug = "openjdk";
    else if (s === "next.js") slug = "nextdotjs";
    else if (s === "spring") slug = "springboot";
    else if (s === "javascript") slug = "javascript";
    else if (s === "sql") slug = "sqlite";
    else if (s === "jenkins") slug = "jenkins";
    else if (s === "python") slug = "python";
    else if (s === "docker") slug = "docker";
    else if (s === "react") slug = "react";
    else if (s === "grafana") slug = "grafana";
    else if (s === "prometheus") slug = "prometheus";
    else if (s === "linux") slug = "linux";
  
    return `https://cdn.simpleicons.org/${slug}/white`;
  };
  
  export default function TechStack({ skills }: { skills: string[] }) {
    return (
      <section className="w-full">
        <h2 className="text-xl font-semibold text-green-300 mb-4 text-left">Tech Experience (한 번씩은 다 써봤어요)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-green-800/40 text-green-100 border border-green-700/50 hover:bg-green-700/60 transition-all">
              <img src={getIconUrl(skill)} alt={skill} className="w-4 h-4" onError={(e) => (e.currentTarget.style.display = 'none')} />
              {skill}
            </span>
          ))}
        </div>
      </section>
    );
  }