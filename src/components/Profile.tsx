import Image from "next/image";

interface ProfileProps {
  name: string;
  github: string;
}

export default function Profile({ name, github }: ProfileProps) {
  const blogUrl = "https://blog.naver.com/changchangdaero";

  const links = [
    { label: "Profile", href: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&x_csa=%7B%22fromUi%22%3A%22kb%22%7D&pkid=1&os=35402807&qvt=0&query=%EC%9C%A0%EC%B0%BD%EB%AF%BC" },
    { label: "GitHub", href: github },
    { label: "Blog", href: blogUrl },
    { label: "Brunch", href: "https://brunch.co.kr/@changchangdaero" },
    { label: "Instagram", href: "https://www.instagram.com/chang_y.u/" },
  ];

  return (
    <section className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-10 w-full">
      <Image
        src="/me.jpg"
        alt="Profile photo"
        width={144}
        height={144}
        className="rounded-full border border-[var(--border-default)] shadow-[var(--shadow-md)] object-cover h-[144px] w-[144px] shrink-0"
        priority
      />
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1 gap-3">
        <h1 className="text-[clamp(1.875rem,4vw,2.5rem)] font-bold tracking-tight text-[var(--text-heading)] leading-tight">
          {name}
        </h1>
        <p className="text-base sm:text-[0.95rem] text-[var(--text-muted)] leading-relaxed max-w-prose font-normal not-italic">
          글을 쓰고 있습니다. 개발도 공부하고 있어요!
        </p>
        <nav
          className="flex flex-wrap gap-2 justify-center sm:justify-start w-full pt-1"
          aria-label="외부 프로필 링크"
        >
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-pill"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
