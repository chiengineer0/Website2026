import { useEffect, useState } from 'react';

interface StickyQuoteCtaProps {
  label?: string;
}

export function StickyQuoteCta({ label = 'Get My Fast Estimate' }: StickyQuoteCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="/Website2026/quote/"
      className={`fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[var(--color-amber)] px-5 py-3 text-sm font-bold text-black shadow-xl transition-all md:bottom-8 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      {label}
    </a>
  );
}
