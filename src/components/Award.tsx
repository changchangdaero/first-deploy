// 수상 섹션: 홈페이지에서 수상, 출판, 주요 성과를 강조하는 블록입니다.
import SectionHeader from '@/components/SectionHeader';

export default function Award() {
  const items = ['LG CNS AM INSPIRE CAMP 3th 최종 팀프로젝트 SentiStock 우수상 수상'];

  return (
    <section className="content-section" aria-labelledby="award-title">
      <SectionHeader eyebrow="Award" title="Award" titleId="award-title" />
      <div className="award-card">
        <ul className="award-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
