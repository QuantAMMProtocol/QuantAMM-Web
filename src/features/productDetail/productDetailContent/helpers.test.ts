import { afterEach, describe, expect, it, vi } from 'vitest';
import { filterByExtendedTimeRange, filterByTimeRange } from './helpers';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('productDetailContent/helpers view-model logic', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('filters by standard time ranges using current time boundaries', () => {
    vi.useFakeTimers();
    const now = new Date('2026-01-15T00:00:00.000Z');
    vi.setSystemTime(now);

    const within7Days = Math.floor((now.getTime() - 6 * DAY_MS) / 1000);
    const olderThan7Days = Math.floor((now.getTime() - 8 * DAY_MS) / 1000);
    const boundary7Days = Math.floor((now.getTime() - 7 * DAY_MS) / 1000);

    expect(filterByTimeRange(within7Days, '7d')).toBe(true);
    expect(filterByTimeRange(olderThan7Days, '7d')).toBe(false);
    expect(filterByTimeRange(boundary7Days, '7d')).toBe(false);
    expect(filterByTimeRange(olderThan7Days, 'max')).toBe(true);
  });

  it('supports the extended 6m range and keeps max always true', () => {
    vi.useFakeTimers();
    const now = new Date('2026-01-15T00:00:00.000Z');
    vi.setSystemTime(now);

    const within6Months = Math.floor((now.getTime() - 150 * DAY_MS) / 1000);
    const olderThan6Months = Math.floor((now.getTime() - 220 * DAY_MS) / 1000);

    expect(filterByExtendedTimeRange(within6Months, '6m')).toBe(true);
    expect(filterByExtendedTimeRange(olderThan6Months, '6m')).toBe(false);
    expect(filterByExtendedTimeRange(olderThan6Months, 'max')).toBe(true);
  });
});
