'use client';

import { useState, useEffect } from 'react';
import Profile from '@/components/Profile';
import TechStack from '@/components/TechStack';
import Works from '@/components/Works';
import Activities from '@/components/Activities'; 
import { ResumeInfo, Work, Activity } from '@/types/portfolio';
const RESUME_URL = "/data.json";


export default function Home() {
  const [data, setData] = useState<ResumeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(RESUME_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-[#062016] flex items-center justify-center text-green-100 italic">Loading...</div>;

  const defaultSkills = "Java, Spring, Linux, SQL, Docker, Next.js, React, Grafana, Prometheus, Python, JavaScript, Jenkins";
  const skills = (data?.title || defaultSkills).split(/\s*[,،]\s*/).map(s => s.trim()).filter(Boolean);

  const myWorks: Work[] = [
    { title: "사랑과 타박상", 
      description: "포레스트웨일 출판사에서 출간했습니다.", 
      image: "/love.png", 
      url: "https://product.kyobobook.co.kr/detail/S000214415930" },
    { title: "휘어진 숲길을 오래도록 걸었다", 
      description: "<청춘의 미학>이란 작품으로 참여했습니다.", 
      image: "/forest.png", 
      url: "https://product.kyobobook.co.kr/detail/S000203156852" },
    { title: "파도시집선 014<새벽>", 
      description: "<해야 할 일>이라는 작품으로 참여했습니다.", 
      image: "/013.png", 
      url: "https://product.kyobobook.co.kr/detail/S000211708914" }
  ];

  // 2. 활동 데이터 배열 (이제 Activity 타입을 실제로 사용!)
  const myActivities: Activity[] = [
    { type: "Exhibition", 
      title: "빈칸 <낮과 밤> 글 전시", 
      description: "복합문화공간 '빈칸'에서 개최한 글 전시에 참여하였습니다.", 
      date: "2024" },
    { type: "Supporters", 
      title: "인디펍 독립출판 서포터즈 46기", 
      description: "독립출판 플랫폼 인디펍의 도서들을 읽고 블로그에 서평을 작성했습니다.", 
      date: "2024" },
    { type: "Supporters", 
      title: "딥앤와이드 출판사 서포터즈 9기", 
      description: "딥앤와이드 출판사의 신간들을 읽고 서평 작성 및 SNS 홍보를 진행하였습니다.", 
      date: "2025" }
  ];

  return (
    <div className="font-sans min-h-screen p-8 pb-20 bg-[#062016] text-green-50">
      <main className="flex flex-col gap-10 items-center max-w-2xl mx-auto mt-10">
        <Profile name={data?.name ?? "유창민"} github={data?.links?.github ?? ""} />
        <TechStack skills={skills} />
        <Works items={myWorks} />
        
        {/* 3. 활동 섹션 추가! */}
        <Activities items={myActivities} />

        <footer className="w-full text-center text-xs text-green-800/60 mt-10">
          © 2026 {data?.name ?? "유창민"}. Built with Next.js & Tailwind CSS.
        </footer>
      </main>
    </div>
  );
}