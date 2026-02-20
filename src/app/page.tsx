'use client';

import { useState, useEffect } from 'react';
import Profile from '@/components/profile';
import TechStack from '@/components/Techstack';
import Works from '@/components/Works';

const RESUME_URL = "https://raw.githubusercontent.com/changchangdaero/first-deploy/0.3general_info/service/resume_general_info_service.json";

export default function Home() {
  const [data, setData] = useState<any>(null);
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

  const skills = (data?.title ?? "").split(/\s*[,،]\s*/).filter(Boolean);

  // 데이터 배열은 따로 관리하거나 json에서 받아오게 수정 가능
  const myWorks = [
    { title: "사랑과 타박상", description: "포레스트웨일 출판사에서 출간했습니다.", image: "/love.png", url: "https://product.kyobobook.co.kr/detail/S000214415930" },
    { title: "휘어진 숲길을 오래도록 걸었다", description: "<청춘의 미학>이란 작품으로 참여했습니다.", image: "/forest.png", url: "https://product.kyobobook.co.kr/detail/S000203156852" },
    { title: "파도시집선 014<새벽>", description: "<해야 할 일>이라는 작품으로 참여했습니다.", image: "/013.png", url: "https://product.kyobobook.co.kr/detail/S000211708914" }
  ];

  return (
    <div className="font-sans min-h-screen p-8 pb-20 bg-[#062016] text-green-50">
      <main className="flex flex-col gap-10 items-center max-w-2xl mx-auto mt-10">
        
        <Profile name={data?.name ?? "유창민"} github={data?.links?.github ?? ""} />
        
        <TechStack skills={skills} />
        
        <Works items={myWorks} />

        {/* 나머지 Activities와 Contact도 이런 식으로 만들어서 추가하면 돼! */}

        <footer className="w-full text-center text-xs text-green-800/60 mt-10">
          © 2026 {data?.name}. Built with Next.js & Cursor.
        </footer>
      </main>
    </div>
  );
}