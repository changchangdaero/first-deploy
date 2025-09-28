import Image from "next/image";

// 1) 깃허브 raw JSON 경로 (브랜치/파일경로 형식)
const RESUME_URL =
  "https://raw.githubusercontent.com/changchangdaero/first-deploy/0.3general_info/service/resume_general_info_service.json";

// 2) 타입(원하는 필드 더 추가 가능)
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

// 3) 서버에서 이력서 JSON 불러오기
async function getResumeInfo(): Promise<ResumeInfo | null> {
  try {
    // 개발 중 매번 최신 보려면 { cache: "no-store" } 또는 revalidate 조절
    const res = await fetch(RESUME_URL, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// 필요 시 포트폴리오도 같은 방식으로 만들면 됨
// async function getPortfolioInfo() { ... }

export default async function Home() {
  const data = await getResumeInfo();

  // 안전한 기본값
  const name = data?.name ?? "유창민";
  const title = data?.title ?? "Java/Spring , 리눅스 , SQLD";
  const email = data?.email ?? "changchangdaero@naver.com";
  const github = data?.links?.github ?? "https://github.com/changchangdaero";

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-3xl">
        {/* 로고(로컬 이미지) -> public/diginori_logo.png */}
<Image
  src="/me.jpg"        // public/me.jpg
  alt="Profile photo"
  width={160}
  height={160}
  className="rounded-full border shadow-md"
  priority
/>



        {/* 헤더 */}
        <section className="w-full">
          <h1 className="text-3xl font-bold mb-1">{name}</h1>
          <p className="text-gray-600">{title}</p>
          <p className="text-sm text-gray-500">
            ✉️ <a className="underline" href={`mailto:${email}`}>{email}</a> ·{" "}
            🔗 <a className="underline" href={github} target="_blank">GitHub</a>
          </p>
        </section>

        {/* 소개 문구(원하면 JSON으로 뺄 수 있음) */}
        <section className="w-full">
          <ol className="font-mono list-inside list-decimal text-sm/6">
            <li className="mb-2 tracking-[-.01em]">
              안녕하세요 {name} 입니다.
            </li>
            <li className="tracking-[-.01em]">열심히 해보겠습니다!</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
