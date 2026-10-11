'use client';

// 스크롤 리빌: data-reveal 표시가 붙은 요소가 화면에 들어오면 아래에서 살짝 올라오며 나타나게 합니다.
// 같은 순간에 함께 들어온 요소들은 0.07초 간격으로 차례차례(스태거) 올라옵니다. 한 번 나타나면 다시 숨기지 않습니다.
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 5;

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    // "동작 줄이기"를 켠 사용자나 IntersectionObserver가 없는 환경에서는 숨기지 않고 그대로 보여줍니다.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      root.classList.remove('reveal-ready', 'reveal-active');
      return;
    }

    // reveal-ready는 layout의 head 스크립트가 미리 붙입니다. reveal-active는 감시가 실제로 시작됐다는 표시로,
    // 이 표시가 없으면 CSS가 2.5초 뒤 모든 요소를 보여줍니다. (스크립트가 실패해도 내용이 숨겨진 채로 남지 않음)
    root.classList.add('reveal-ready', 'reveal-active');

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

        visible.forEach((element, index) => {
          element.style.animationDelay = `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS}ms`;
          element.classList.add('is-revealed');
          observer.unobserve(element);
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
