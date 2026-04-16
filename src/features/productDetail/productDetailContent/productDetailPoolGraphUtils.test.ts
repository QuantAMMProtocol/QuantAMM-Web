import { describe, expect, it } from 'vitest';
import { getProductDetailTimeAxisPreset } from './productDetailPoolGraphUtils';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('productDetailPoolGraphUtils', () => {
  it('uses daily ticks for short spans', () => {
    expect(getProductDetailTimeAxisPreset(7 * DAY_MS, false)).toEqual({
      intervalUnit: 'day',
      intervalStep: 1,
      intervalMinSpacing: 72,
      labelFormat: '%d %b',
      labelMinSpacing: 14,
    });
  });

  it('uses weekly ticks with shorter date labels for 1m and 3m views', () => {
    expect(getProductDetailTimeAxisPreset(30 * DAY_MS, false)).toEqual({
      intervalUnit: 'week',
      intervalStep: 1,
      intervalMinSpacing: 80,
      labelFormat: '%d %b',
      labelMinSpacing: 16,
    });

    expect(getProductDetailTimeAxisPreset(90 * DAY_MS, false)).toEqual({
      intervalUnit: 'week',
      intervalStep: 2,
      intervalMinSpacing: 88,
      labelFormat: '%d %b',
      labelMinSpacing: 16,
    });
  });

  it('broadens long-range labels to months or years', () => {
    expect(getProductDetailTimeAxisPreset(300 * DAY_MS, false)).toEqual({
      intervalUnit: 'month',
      intervalStep: 1,
      intervalMinSpacing: 92,
      labelFormat: '%b %Y',
      labelMinSpacing: 16,
    });

    expect(getProductDetailTimeAxisPreset(800 * DAY_MS, false)).toEqual({
      intervalUnit: 'month',
      intervalStep: 3,
      intervalMinSpacing: 96,
      labelFormat: '%b %Y',
      labelMinSpacing: 16,
    });

    expect(getProductDetailTimeAxisPreset(1500 * DAY_MS, false)).toEqual({
      intervalUnit: 'year',
      intervalStep: 1,
      intervalMinSpacing: 104,
      labelFormat: '%Y',
      labelMinSpacing: 16,
    });
  });

  it('coarsens intervals further on mobile layouts', () => {
    expect(getProductDetailTimeAxisPreset(90 * DAY_MS, true)).toEqual({
      intervalUnit: 'week',
      intervalStep: 3,
      intervalMinSpacing: 72,
      labelFormat: '%d %b',
      labelMinSpacing: 12,
    });

    expect(getProductDetailTimeAxisPreset(300 * DAY_MS, true)).toEqual({
      intervalUnit: 'month',
      intervalStep: 2,
      intervalMinSpacing: 76,
      labelFormat: '%b %Y',
      labelMinSpacing: 12,
    });
  });
});
