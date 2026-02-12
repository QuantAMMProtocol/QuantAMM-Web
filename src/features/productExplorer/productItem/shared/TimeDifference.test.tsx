import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { getTimeDifference } from './TimeDifference';

describe('productItem/shared/TimeDifference view-model logic', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns N/A when date input is invalid', () => {
    expect(getTimeDifference('not-a-date')).toBe('N/A');
  });

  it('renders compact year/month/day difference text from current time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

    const twoYears = renderToStaticMarkup(
      <>{getTimeDifference('2024-01-01T00:00:00.000Z')}</>
    );
    const oneMonthAndDays = renderToStaticMarkup(
      <>{getTimeDifference('2025-12-01T00:00:00.000Z')}</>
    );

    expect(twoYears).toContain('2y');
    expect(oneMonthAndDays).toContain('1m');
    expect(oneMonthAndDays).toContain('1d');
  });
});
