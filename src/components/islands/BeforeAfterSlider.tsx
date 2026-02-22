import { useState } from 'react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

export function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/35">
      <img src={beforeSrc} alt={beforeAlt} className="block w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={afterSrc} alt={afterAlt} className="h-full w-full object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
        <div className="h-full w-[2px] -translate-x-1/2 bg-[var(--color-amber)] shadow-[0_0_14px_#ffb30080]" />
      </div>
      <input
        aria-label="Slide to compare before and after"
        type="range"
        min={15}
        max={85}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-x-0 bottom-3 mx-auto w-[90%] accent-[var(--color-amber)]"
      />
      <div className="pointer-events-none absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wide text-white">Before</div>
      <div className="pointer-events-none absolute right-2 top-2 rounded bg-[var(--color-amber)]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">After</div>
    </div>
  );
}
