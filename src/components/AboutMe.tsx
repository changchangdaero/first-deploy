'use client';

export default function AboutMe() {
  const items = [
    "명지대학교 정보통신공학 & 인공지능·ICT융합전공",
    "LG CNS AM INSPIRE CAMP 3th 최종 팀프로젝트 SentiStock 우수상 수상",
    "교보문고 시·에세이 분야 주간베스트 도서 [사랑과 타박상] 저자",
    "브런치스토리 작가",
    "한국예술인복지재단 신진예술인"
  ];

  return (
    <section className="w-full">
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
        <h2 className="text-xl font-bold text-green-400">About Me</h2>
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-green-50 leading-relaxed">
              <span className="text-green-500 mt-1">▷</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}