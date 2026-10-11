// 문학 활동 섹션: 서포터즈, 전시 등 활동 이력을 이미지 카드로 보여줍니다.
import Image from 'next/image';

import SectionHeader from '@/components/SectionHeader';
import { activities, type LiteratureActivity } from '@/data/literature/activities';
import { literatureSections as sections } from '@/data/literature/sections';

function ActivityCard({ activity }: { activity: LiteratureActivity }) {
  return (
    <article className="activity-showcase-card" data-reveal>
      <div className="activity-showcase-card__image-frame">
        <Image
          src={activity.image}
          alt={`${activity.title} 활동 이미지`}
          width={180}
          height={240}
          className="activity-showcase-card__image"
        />
      </div>

      <div className="activity-showcase-card__body">
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        <div className="activity-showcase-card__meta">
          <span>{activity.label}</span>
          <time dateTime={activity.year}>{activity.year}</time>
        </div>
      </div>
    </article>
  );
}

export default function Activities() {
  return (
    <section
      id="activities"
      className="content-section activities-exhibition-section"
      aria-labelledby="activities-title"
    >
      <SectionHeader
        eyebrow={sections.activities.eyebrow}
        title={sections.activities.title}
        titleId="activities-title"
      />
      <div className="activity-showcase-grid">
        {activities.map((activity) => (
          <ActivityCard key={activity.title} activity={activity} />
        ))}
      </div>
    </section>
  );
}
