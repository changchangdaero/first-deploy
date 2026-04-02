import fs from 'fs/promises';
import path from 'path';

import Profile from '@/components/Profile';
import AboutMe from '@/components/AboutMe';
import Award from '@/components/Award';
import TechStack from '@/components/TechStack';
import Works from '@/components/Works';
import Activities from '@/components/Activities';
import Practice from '@/components/practice/Practice';
import Contact from '@/components/Contact';
import { ResumeInfo, Work, Activity } from '@/types/portfolio';

export default async function Home() {
  let data: ResumeInfo | null = null;

  try {
    const filePath = path.join(process.cwd(), 'public', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error('Data load error:', error);
  }

  const defaultSkills = [
    'Java',
    'Spring',
    'Linux',
    'SQL',
    'Docker',
    'Next.js',
    'React',
    'Grafana',
    'Prometheus',
    'Python',
    'JavaScript',
    'Jenkins',
  ];

  const skills = defaultSkills;

  const myWorks: Work[] = [
    {
      title: '사랑과 타박상',
      description: '포레스트웨일 출판사에서 출간했습니다.',
      image: '/love.png',
      url: 'https://product.kyobobook.co.kr/detail/S000214415930',
    },
    {
      title: '휘어진 숲길을 오래도록 걸었다',
      description: '<청춘의 미학>이란 작품으로 참여했습니다.',
      image: '/forest.png',
      url: 'https://product.kyobobook.co.kr/detail/S000203156852',
    },
    {
      title: '파도시집선 014<새벽>',
      description: '<해야 할 일>이라는 작품으로 참여했습니다.',
      image: '/013.png',
      url: 'https://product.kyobobook.co.kr/detail/S000211708914',
    },
  ];

  const myActivities: Activity[] = [
    {
      type: 'Exhibition',
      title: '빈칸 <낮과 밤> 글 전시',
      description: "복합문화공간 '빈칸'에서 개최한 글 전시에 참여하였습니다.",
      date: '2024',
    },
    {
      type: 'Supporters',
      title: '인디펍 독립출판 서포터즈 46기',
      description: '독립출판 플랫폼 인디펍의 도서들을 읽고 블로그에 서평을 작성했습니다.',
      date: '2024',
    },
    {
      type: 'Supporters',
      title: '딥앤와이드 출판사 서포터즈 9기',
      description: '딥앤와이드 출판사의 신간들을 읽고 서평 작성 및 SNS 홍보를 진행하였습니다.',
      date: '2025',
    },
  ];

  return (
    <div className="portfolio-page font-sans">
      <main className="portfolio-main">
        <Profile
          name={data?.name ?? '유창민'}
          github={data?.links?.github ?? 'https://github.com/changchangdaero'}
        />
        <AboutMe />
        <Award />
        <TechStack skills={skills} />
        <Practice />
        <Works items={myWorks} />
        <Activities items={myActivities} />
        <Contact />

        <footer className="w-full text-center mt-10 flex flex-col gap-2">
          <p className="portfolio-footer-copy">
            © 2026 {data?.name ?? '유창민'}. Written with Words, Built with Next.js & TypeScript
          </p>
        </footer>
      </main>
    </div>
  );
}