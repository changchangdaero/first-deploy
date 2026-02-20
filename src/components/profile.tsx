import Image from "next/image";

interface ProfileProps {
  name: string;
  github: string;
}

export default function Profile({ name, github }: ProfileProps) {
  return (
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
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-green-200/70">
          <a className="hover:text-white underline underline-offset-4" href="https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&x_csa=%7B%22fromUi%22%3A%22kb%22%7D&pkid=1&os=35402807&qvt=0&query=%EC%9C%A0%EC%B0%BD%EB%AF%BC" target="_blank" rel="noopener noreferrer">Profile</a>
          <a className="hover:text-white underline underline-offset-4" href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="hover:text-white underline underline-offset-4" href="https://brunch.co.kr/@changchangdaero" target="_blank" rel="noopener noreferrer">Brunch</a>
          <a className="hover:text-white underline underline-offset-4" href="https://www.instagram.com/chang_y.u/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </section>
  );
}