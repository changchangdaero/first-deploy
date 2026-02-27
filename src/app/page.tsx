import fs from 'fs/promises';
import path from 'path';
import { getAndIncrViews } from '@/app/lib/redis';
import Profile from '@/components/Profile';
import AboutMe from '@/components/AboutMe';
import TechStack from '@/components/TechStack';
import Works from '@/components/Works';
import Activities from '@/components/Activities'; 
import Practice from '@/components/practice/Practice';
import Contact from '@/components/Contact';
import { ResumeInfo, Work, Activity } from '@/types/portfolio';

export default async function Home() {
  // 1. 조회수 가져오기
  const views = await getAndIncrViews();

  // 2. data.json 읽어오기 (서버에서 직접 읽기)
  let data: ResumeInfo | null = null;
  try {
    const filePath = path.join(process.cwd(), 'public', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error("Data load error:", error);
  }

  const defaultSkills = "Java, Spring, Linux, SQL, Docker, Next.js, React, Grafana, Prometheus, Python, JavaScript, Jenkins";
  const skills = (data?.title || defaultSkills).split(/\s*[,،]\s*/).map(s => s.trim()).filter(Boolean);

  const myWorks: Work[] = [
    { title: "사랑과 타박상", description: "포레스트웨일 출판사에서 출간했습니다.", image: "/love.png", url: "https://product.kyobobook.co.kr/detail/S000214415930" },
    { title: "휘어진 숲길을 오래도록 걸었다", description: "<청춘의 미학>이란 작품으로 참여했습니다.", image: "/forest.png", url: "https://product.kyobobook.co.kr/detail/S000203156852" },
    { title: "파도시집선 014<새벽>", description: "<해야 할 일>이라는 작품으로 참여했습니다.", image: "/013.png", url: "https://product.kyobobook.co.kr/detail/S000211708914" }
  ];

  const myActivities: Activity[] = [
    { type: "Exhibition", title: "빈칸 <낮과 밤> 글 전시", description: "복합문화공간 '빈칸'에서 개최한 글 전시에 참여하였습니다.", date: "2024" },
    { type: "Supporters", title: "인디펍 독립출판 서포터즈 46기", description: "독립출판 플랫폼 인디펍의 도서들을 읽고 블로그에 서평을 작성했습니다.", date: "2024" },
    { type: "Supporters", title: "딥앤와이드 출판사 서포터즈 9기", description: "딥앤와이드 출판사의 신간들을 읽고 서평 작성 및 SNS 홍보를 진행하였습니다.", date: "2025" }
  ];

  return (
    <div className="font-sans min-h-screen p-8 pb-20 bg-[#062016] text-green-50">
      <main className="flex flex-col gap-14 items-center max-w-2xl mx-auto mt-10">
        <Profile name={data?.name ?? "유창민"} github={data?.links?.github ?? "https://github.com/changchangdaero"} />
        <AboutMe />
        <TechStack skills={skills} />
        <Practice />
        <Works items={myWorks} />
        <Activities items={myActivities} />
        <Contact />

        <footer className="w-full text-center mt-10 flex flex-col gap-2">
          {/* 하단에 방문자 수 표시 */}
          <p className="text-green-400 text-[11px] font-mono tracking-widest uppercase">
            Total Visitors: {views.toLocaleString()}
          </p>
          <p className="text-[10px] text-green-900/40">
            © 2026 {data?.name ?? "유창민"}. Written with Words, Built with Next.js & TypeScript
          </p>
        </footer>
      </main>
    </div>
  );
}