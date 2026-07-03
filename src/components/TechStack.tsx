// 기술 스택 섹션: 홈페이지에 기술 아이콘과 출간/활동 기록을 보여줍니다.
import Image from 'next/image';

import SectionHeader from '@/components/SectionHeader';

type Skill = {
  name: string;
  icon: string;
};

type Publication = {
  title: string;
  description: string;
  image: string;
  href: string;
  label: string;
};

type Activity = {
  title: string;
  description: string;
  image: string;
  label: string;
  year: string;
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

const publications: Publication[] = [
  {
    title: '사랑과 타박상',
    description: '포레스트웨일 출판사에서 출간했습니다.',
    label: 'Essay',
    image: '/love.png',
    href: 'https://product.kyobobook.co.kr/detail/S000214415930',
  },
  {
    title: '휘어진 숲길을 오래도록 걸었다',
    description: '<청춘의 미학>이라는 작품으로 참여했습니다.',
    label: 'Poetry',
    image: '/forest.png',
    href: 'https://product.kyobobook.co.kr/detail/S000203156852',
  },
  {
    title: '파도시집선 014<새벽>',
    description: '<해야 할 일>이라는 작품으로 참여했습니다.',
    label: 'Poetry',
    image: '/013.png',
    href: 'https://product.kyobobook.co.kr/detail/S000211708914',
  },
];

const activities: Activity[] = [
  {
    title: '독립출판 서포터즈',
    description: '독립출판 플랫폼 인디펍의 도서들을 읽고 블로그에 서평을 작성했습니다.',
    label: 'Supporters',
    year: '2024',
    image: '/indiepub-supporters.png',
  },
  {
    title: '딥앤와이드 출판사 서포터즈 9기',
    description: '딥앤와이드 출판사의 신간들을 읽고 서평 작성 및 SNS 홍보를 진행하였습니다.',
    label: 'Supporters',
    year: '2025',
    image: '/deep-and-wide-supporters.png',
  },
  {
    title: '빈칸 <낮과 밤> 글 전시',
    description: "복합문화공간 '빈칸'에서 개최한 글 전시에 참여하였습니다.",
    label: 'Exhibition',
    year: '2024',
    image: '/binkan-day-and-night.png',
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

function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <a
      href={publication.href}
      className="publication-card"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${publication.title} 외부 링크 열기`}
    >
      <span className="publication-card__cover-wrap">
        <Image
          src={publication.image}
          alt={`${publication.title} 책 표지`}
          width={104}
          height={150}
          className="publication-card__cover"
        />
      </span>

      <span className="publication-card__body">
        <span className="publication-card__title">{publication.title}</span>
        <span className="publication-card__description">{publication.description}</span>
        <span className="publication-card__footer">
          <span className="publication-card__label">{publication.label}</span>
          <span className="publication-card__arrow" aria-hidden="true">
            →
          </span>
        </span>
      </span>
    </a>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="activity-showcase-card">
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

export default function TechStack() {
  return (
    <section id="tech-stack" className="content-section tech-stack-section" aria-labelledby="tech-stack-title">
      <SectionHeader eyebrow="SKILLS" title="Tech Stack" titleId="tech-stack-title" />
      <div className="tech-stack-group">
        <h3>Languages / Frameworks</h3>
        <SkillGrid skills={languageFrameworks} />
      </div>

      <div className="tech-stack-group">
        <h3>Tools / Infra</h3>
        <SkillGrid skills={toolsInfra} />
      </div>

      <section id="writing" className="works-publications-section" aria-labelledby="works-publications-title">
        <SectionHeader
          eyebrow="WRITING"
          title="Works & Publications"
          titleId="works-publications-title"
        />
        <div className="publication-grid">
          {publications.map((publication) => (
            <PublicationCard key={publication.title} publication={publication} />
          ))}
        </div>
      </section>

      <section className="activities-exhibition-section" aria-labelledby="activities-exhibition-title">
        <SectionHeader
          eyebrow="ACTIVITIES"
          title="Activities & Exhibition"
          titleId="activities-exhibition-title"
        />
        <div className="activity-showcase-grid">
          {activities.map((activity) => (
            <ActivityCard key={activity.title} activity={activity} />
          ))}
        </div>
      </section>
    </section>
  );
}
