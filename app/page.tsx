import Image from "next/image";

// 서버 컴포넌트에서 직접 API 호출
async function getResumeInfo() {
  const res = await fetch('https://raw.githubusercontent.com/changchangdaero/first-deploy/refs/heads/0.3general_info/service/resume_general_info_service.json');
  // API 응답이 성공적인지 확인
  if (!res.ok) {
    // 응답이 실패하면 오류를 던져 Next.js가 오류 페이지를 보여주도록 함
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

// 서버 컴포넌트에서 직접 API 호출
async function getPortfolioInfo() {
  const res = await fetch('');
  // API 응답이 성공적인지 확인
  if (!res.ok) {
    // 응답이 실패하면 오류를 던져 Next.js가 오류 페이지를 보여주도록 함
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Home() {
  // getResumeInfo 함수를 호출하여 데이터를 기다림
  const data = await getResumeInfo();

  const dataPortfolio = await getResumeInfo();

data.name
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/diginori_logo.png"
          alt="Next.js logo"
          width={333}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            안녕하세요{" "} {data.name} 입니다.
          </li>
          <li className="tracking-[-.01em]">
            테스트 할 수 없는 건 만들 수 없다
          </li>
        </ol>
      </main>
    </div>
  );
}