'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

// 1) 깃허브 데이터 경로
const RESUME_URL =
  "https://raw.githubusercontent.com/changchangdaero/first-deploy/0.3general_info/service/resume_general_info_service.json";

type ResumeInfo = {
  name: string;
  title?: string;
  email?: string;
  links?: {
    github?: string;
    blog?: string;
    vercel?: string;
  };
};

// 출간물 데이터 타입
type Work = {
  title: string;
  description: string;
  image: string;
  url?: string;
};

// 활동 데이터 타입
type Activity = {
  type: string;
  title: string;
  description: string;
  date: string;
};

// 2) 아이콘 URL 생성 함수
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

export default function Home() {
  const [data, setData] = useState<ResumeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isWorksOpen, setIsWorksOpen] = useState(false);
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);

  const myWorks: Work[] = [
    {
      title: "사랑과 타박상",
      description: "포레스트웨일 출판사에서 출간했습니다.",
      image: "/love.png",
      url: "https://product.kyobobook.co.kr/detail/S000214415930",
    },
    {
      title: "휘어진 숲길을 오래도록 걸었다",
      description: "<청춘의 미학>이란 작품으로 참여했습니다.",
      image: "/forest.png",
      url: "https://product.kyobobook.co.kr/detail/S000203156852",
    },
    {
      title: "파도시집선 014<새벽>",
      description: "<해야 할 일>이라는 작품으로 참여했습니다.",
      image: "/013.png",
      url: "https://product.kyobobook.co.kr/detail/S000211708914",
    }
  ];

  const myActivities: Activity[] = [
    {
      type: "Exhibition",
      title: "빈칸 <낮과 밤> 글 전시",
      description: "복합문화공간 '빈칸'에서 개최한 글 전시에 참여하였습니다.",
      date: "2024"
    },
    {
      type: "Supporters",
      title: "인디펍 독립출판 서포터즈 46기",
      description: "독립출판 플랫폼 인디펍의 도서들을 읽고 블로그에 서평을 작성했습니다.",
      date: "2024"
    },
    {
      type: "Supporters",
      title: "딥앤와이드 출판사 서포터즈 9기",
      description: "딥앤와이드 출판사의 신간들을 읽고 서평 작성 및 SNS 홍보를 진행하였습니다.",
      date: "2025"
    }
  ];

  useEffect(() => {
    fetch(RESUME_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const name = data?.name ?? "유창민";
  const title = data?.title ?? "Java, Spring, Linux, SQL, Docker, Next.js, React, Grafana, Prometheus, Python, JavaScript, Jenkins";
  const email = data?.email ?? "changchangdaero@naver.com";
  const github = data?.links?.github ?? "https://github.com/changchangdaero";

  const skills = title.split(/\s*[,،]\s*/).map((s) => s.trim()).filter(Boolean);

  if (loading) return (
    <div className="min-h-screen bg-[#062016] flex items-center justify-center text-green-100 italic">
      Loading...
    </div>
  );

  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-12 sm:p-20 bg-[#062016] text-green-50">
      <main className="flex flex-col gap-10 items-center sm:items-start max-w-2xl w-full mt-10">
        
        {/* 프로필 섹션 */}
        <section className="flex flex-col sm:flex-row items-center gap-8 w-full">
          <Image
            src="/me.jpg"
            alt="Profile photo"
            width={140}
            height={140}
            className="rounded-full border-2 border-green-700 shadow-xl object-cover h-[140px]"
            priority
          />
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{name}</h1>
            <p className="text-green-400 font-medium mb-4 text-lg italic">글을 쓰고 있습니다. 개발도 공부하고 있어요!</p>
            {/* 🔗 링크 섹션: Profile(Naver), GitHub, Brunch, Instagram */}
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-green-200/70">
              <a className="hover:text-white underline underline-offset-4" href="https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&pkid=1&os=35402807&qvt=0&query=%EC%9C%A0%EC%B0%BD%EB%AF%BC" target="_blank" rel="noopener noreferrer">Profile</a>
              <a className="hover:text-white underline underline-offset-4" href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="hover:text-white underline underline-offset-4" href="https://brunch.co.kr/@changchangdaero" target="_blank" rel="noopener noreferrer">Brunch</a>
              <a className="hover:text-white underline underline-offset-4" href="https://www.instagram.com/chang_y.u/" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </section>

        {/* 소개 섹션 */}
        <section className="w-full space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg text-left">
          <h2 className="text-xl font-semibold text-green-300">About Me</h2>
          <ul className="space-y-3 text-sm sm:text-base text-green-50/90 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">▹</span>
              <span>명지대학교 정보통신공학 & 인공지능·ICT융합전공</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">▹</span>
              <span>LG CNS AM INSPIRE CAMP 3th 최종 팀프로젝트 SentiStock 우수상 수상</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">▹</span>
              <span>교보문고 시·에세이 분야 주간베스트 도서 [사랑과 타박상] 저자</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">▹</span>
              <span>브런치스토리 작가</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">▹</span>
              <span>한국예술인복지재단 신진예술인</span>
            </li>
          </ul>
        </section>

        {/* 기술 스택 섹션 */}
        <section className="w-full">
          <h2 className="text-xl font-semibold text-green-300 mb-4 text-left">Tech Experience (한번은 써봤어요)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-green-800/40 text-green-100 border border-green-700/50 hover:bg-green-700/60 transition-all"
              >
                <img src={getIconUrl(skill)} alt={skill} className="w-4 h-4" onError={(e) => (e.currentTarget.style.display = 'none')} />
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* 출간물 섹션 */}
        <section className="w-full">
          <button onClick={() => setIsWorksOpen(!isWorksOpen)} className="flex items-center justify-between w-full p-4 rounded-xl border border-green-600/50 bg-green-900/30 hover:bg-green-800/40 transition-all">
            <h2 className="text-xl font-semibold text-green-300">Works & Publications</h2>
            <span className={`text-green-500 transition-transform duration-300 ${isWorksOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {isWorksOpen && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {myWorks.map((work, index) => (
                <a key={index} href={work.url || "#"} target={work.url ? "_blank" : "_self"} rel="noopener noreferrer" className={`flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 items-center transition-all ${work.url ? "hover:bg-white/10 cursor-pointer" : "cursor-default"}`}>
                  <div className="w-16 h-24 bg-gray-800 rounded shadow-md flex-shrink-0 relative overflow-hidden border border-white/10">
                    {work.image ? <Image src={work.image} alt={work.title} fill className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-500 italic">No Image</div>}
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="font-bold text-green-100 text-sm">{work.title}</h3>
                    <p className="text-[11px] text-green-200/70 mt-1 leading-snug">{work.description}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* 활동 섹션 */}
        <section className="w-full">
          <button onClick={() => setIsActivitiesOpen(!isActivitiesOpen)} className="flex items-center justify-between w-full p-4 rounded-xl border border-green-600/50 bg-green-900/30 hover:bg-green-800/40 transition-all">
            <h2 className="text-xl font-semibold text-green-300">Activities & Exhibition</h2>
            <span className={`text-green-500 transition-transform duration-300 ${isActivitiesOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {isActivitiesOpen && (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 text-left">
              {myActivities.map((act, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-green-700/30 text-green-400 uppercase tracking-wider">{act.type}</span>
                    <span className="text-[9px] text-green-500/60 font-mono">{act.date}</span>
                  </div>
                  <h3 className="font-bold text-green-100 mt-1">{act.title}</h3>
                  <p className="text-xs text-green-200/70 leading-relaxed">{act.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- 하단 Contact 섹션 --- */}
        <section className="w-full text-left space-y-4">
          <h2 className="text-xl font-semibold text-green-300">Contact</h2>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg group">
            <p className="text-sm text-green-200/70 mb-2 italic">글쓰기/개발 관련 제안 및 문의는 여기로 보내주세요!</p>
            <a 
              href={`mailto:${email}`} 
              className="text-lg font-medium text-green-50 group-hover:text-green-400 transition-colors underline underline-offset-4 break-all"
            >
              {email}
            </a>
          </div>
        </section>

        <footer className="w-full text-center text-xs text-green-800/60 mt-10">
          © 2026 {name}. Built with Next.js & Cursor.
        </footer>
      </main>
    </div>
  );
}