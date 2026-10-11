// Literature About: 사진, 한 줄 소개, 문학 이력, 링크 버튼을 보여줍니다.
import Image from 'next/image';

import LinkPills from '@/components/LinkPills';
import SectionHeader from '@/components/SectionHeader';
import { literatureProfile as profile } from '@/data/literature/profile';
import { literatureSections as sections } from '@/data/literature/sections';
import { publicFileExists } from '@/lib/public-file';

export default function LitAbout() {
  const hasImage = publicFileExists(profile.image);

  return (
    <section id="about" className="content-section" aria-labelledby="lit-about-title">
      <SectionHeader eyebrow={sections.about.eyebrow} title={sections.about.title} titleId="lit-about-title" />
      <div className={hasImage ? 'about-summary' : 'about-summary about-summary--no-image'} data-reveal>
        {hasImage ? (
          <div className="about-summary__image">
            <Image src={profile.image} alt={`${profile.name} 프로필 사진`} width={180} height={180} priority />
          </div>
        ) : null}
        <div className="about-summary__content">
          <h1 className="about-summary__name">{profile.name}</h1>
          <p className="about-summary__headline">{profile.headline}</p>
          {profile.summary ? <p className="about-summary__text">{profile.summary}</p> : null}
          <ul className="profile-list">
            {profile.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <LinkPills items={profile.links} label="Literature 링크" />
        </div>
      </div>
    </section>
  );
}
