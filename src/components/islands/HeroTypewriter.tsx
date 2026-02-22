import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

const lines = ['Licensed & Insured', '24/7 Emergency Service', 'Commercial & Residential', 'Panel Upgrades & EV Chargers'];

export function HeroTypewriter() {
  const letters = useMemo(() => '[BRAND NAME] Electric'.split(''), []);
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const target = lines[lineIndex];
    let cursor = 0;
    const interval = window.setInterval(() => {
      cursor += 1;
      setTyped(target.slice(0, cursor));
      if (cursor >= target.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setTyped('');
          setLineIndex((current) => (current + 1) % lines.length);
        }, 1400);
      }
    }, 55);
    return () => window.clearInterval(interval);
  }, [lineIndex]);

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
        {letters.map((letter, index) => (
          <motion.span key={`${letter}-${index}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            {letter}
          </motion.span>
        ))}
      </h1>
      <p className="mt-4 min-h-7 text-lg text-white/90">
        {typed}
        <span className="ml-1 animate-pulse">|</span>
      </p>
    </div>
  );
}
