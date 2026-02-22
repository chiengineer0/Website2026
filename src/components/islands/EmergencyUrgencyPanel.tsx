import { useEffect, useMemo, useState } from 'react';

export function EmergencyUrgencyPanel() {
  const [seconds, setSeconds] = useState(900);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => (value <= 0 ? 900 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }, [seconds]);

  return (
    <div className="rounded-xl border border-red-300/45 bg-black/35 p-4">
      <p className="text-sm font-semibold text-red-100">Active emergency queue refreshes every 15 minutes</p>
      <p className="mt-2 text-2xl font-black text-[var(--color-amber)]">{countdown}</p>
      <p className="mt-1 text-xs text-red-100/80">For immediate electrical hazards, call now to skip form intake.</p>
      <ul className="mt-3 grid gap-1 text-xs text-red-100/85 sm:grid-cols-2">
        <li>• Burning smell / smoke</li>
        <li>• Main breaker overheating</li>
        <li>• Repeated arc/sparking</li>
        <li>• Total outage with safety risk</li>
      </ul>
    </div>
  );
}
