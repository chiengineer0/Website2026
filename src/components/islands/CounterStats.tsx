import { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Projects Completed', value: 500, suffix: '+' },
  { label: 'Years Experience', value: 20, suffix: '+' },
  { label: 'Average Rating', value: 4.9, suffix: '★' },
  { label: 'Emergency Coverage', value: 24, suffix: '/7' },
] as const;

export function CounterStats() {
  const [active, setActive] = useState(false);
  const [display, setDisplay] = useState<number[]>(stats.map(() => 0));
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const timer = window.setInterval(() => {
      const progress = Math.min((performance.now() - start) / 1200, 1);
      setDisplay(
        stats.map((item) => {
          const value = item.value * progress;
          return Number.isInteger(item.value) ? Math.round(value) : Number(value.toFixed(1));
        }),
      );
      if (progress === 1) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <article key={item.label} className="rounded-xl border border-white/15 bg-white/5 p-6 text-center">
          <p className="text-3xl font-bold text-[var(--color-amber)]">
            {display[index]}
            {item.suffix}
          </p>
          <p className="mt-2 text-sm text-white/80">{item.label}</p>
        </article>
      ))}
    </div>
  );
}
