import { useState, useEffect } from 'react';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="#main"
      data-menu-inert
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={`fixed bottom-5 right-5 sm:bottom-10 sm:right-10 z-40 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full
        bg-ink text-paper text-[1.4rem] font-light shadow-lg ring-1 ring-paper/25 transition-[opacity,transform] duration-200 hover:-translate-y-2.5 ${
        isVisible ? 'opacity-100' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      aria-label="Back to top"
      title="Back to top"
    >
      <span aria-hidden="true">↑</span>
    </a>
  );
}

export default ScrollToTop;
