import { describe, expect, it } from 'vitest';
import { formatReadTime } from '@/lib/utils';

describe('formatReadTime', () => {
  it('returns at least one minute', () => {
    expect(formatReadTime(50)).toBe('1 min read');
  });

  it('rounds large values', () => {
    expect(formatReadTime(420)).toBe('2 min read');
  });
});
