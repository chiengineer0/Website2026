import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReadTime(words: number) {
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function isOpenNow() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if (day === 0) return false;
  if (day === 6) return hour >= 8 && hour < 14;
  return hour >= 7 && hour < 18;
}
