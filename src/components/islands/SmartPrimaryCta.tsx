import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

const variants = ['Get a Free Quote', 'Request Priority Estimate'] as const;

export function SmartPrimaryCta() {
  const [label, setLabel] = useState<(typeof variants)[number]>(variants[0]);

  useEffect(() => {
    const key = 'cta-variant';
    const stored = localStorage.getItem(key);
    if (stored === 'A' || stored === 'B') {
      setLabel(stored === 'A' ? variants[0] : variants[1]);
      return;
    }

    const variant = Math.random() > 0.5 ? 'A' : 'B';
    localStorage.setItem(key, variant);
    setLabel(variant === 'A' ? variants[0] : variants[1]);
  }, []);

  return (
    <a
      href="/Website2026/quote/"
      className="pulse-amber glow-hover inline-flex min-h-12 items-center rounded-md bg-[var(--color-amber)] px-6 font-bold text-black"
      onClick={() => trackEvent('hero_primary_cta_click', { label })}
    >
      {label}
    </a>
  );
}
