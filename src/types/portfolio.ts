// 유저 기본 정보 타입
export type ResumeInfo = {
    name: string;
    title?: string;
    email?: string;
    links?: {
      github?: string;
      blog?: string;
      vercel?: string;
    };
  };
  
  // 출간물(Works) 데이터 타입
  export type Work = {
    title: string;
    description: string;
    image: string;
    url?: string;
  };
  
  // 활동(Activities) 데이터 타입
  export type Activity = {
    type: string;
    title: string;
    description: string;
    date: string;
  };