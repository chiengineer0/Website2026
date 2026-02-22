import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]" aria-hidden="true">
      <div className="flex flex-col items-center gap-4">
        <svg width="140" height="56" viewBox="0 0 140 56" fill="none" className="loading-circuit">
          <path d="M4 28h28l8-16h18l8 32 8-16h18l8 16h36" stroke="#0066FF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="4" cy="28" r="4" fill="#FFB300" />
          <circle cx="136" cy="28" r="4" fill="#FFB300" />
        </svg>
        <p className="text-sm tracking-wide text-white/80">Wiring for Excellence...</p>
      </div>
    </div>
  );
}
