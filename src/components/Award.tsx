export default function Award() {
  const items = [
    "LG CNS AM INSPIRE CAMP 3th 최종 팀프로젝트 SentiStock 우수상 수상",
  ];

  return (
    <section className="w-full">
      <div className="section-card space-y-5">
        <h2 className="section-title">Award</h2>
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-body)] leading-relaxed">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
