const DAY_MS = 24 * 60 * 60 * 1000;

export type ProductDetailAxisIntervalUnit = 'day' | 'week' | 'month' | 'year';

export interface ProductDetailTimeAxisPreset {
  intervalUnit: ProductDetailAxisIntervalUnit;
  intervalStep: number;
  intervalMinSpacing: number;
  labelFormat: string;
  labelMinSpacing: number;
}

export const getProductDetailTimeAxisPreset = (
  totalSpanMs: number,
  isMobile: boolean
): ProductDetailTimeAxisPreset => {
  if (totalSpanMs <= 14 * DAY_MS) {
    return {
      intervalUnit: 'day',
      intervalStep: isMobile ? 2 : 1,
      intervalMinSpacing: isMobile ? 56 : 72,
      labelFormat: '%d %b',
      labelMinSpacing: isMobile ? 10 : 14,
    };
  }

  if (totalSpanMs <= 45 * DAY_MS) {
    return {
      intervalUnit: 'week',
      intervalStep: 1,
      intervalMinSpacing: isMobile ? 64 : 80,
      labelFormat: '%d %b',
      labelMinSpacing: isMobile ? 12 : 16,
    };
  }

  if (totalSpanMs <= 120 * DAY_MS) {
    return {
      intervalUnit: 'week',
      intervalStep: isMobile ? 3 : 2,
      intervalMinSpacing: isMobile ? 72 : 88,
      labelFormat: '%d %b',
      labelMinSpacing: isMobile ? 12 : 16,
    };
  }

  if (totalSpanMs <= 370 * DAY_MS) {
    return {
      intervalUnit: 'month',
      intervalStep: isMobile ? 2 : 1,
      intervalMinSpacing: isMobile ? 76 : 92,
      labelFormat: '%b %Y',
      labelMinSpacing: isMobile ? 12 : 16,
    };
  }

  if (totalSpanMs <= 3 * 365 * DAY_MS) {
    return {
      intervalUnit: 'month',
      intervalStep: isMobile ? 6 : 3,
      intervalMinSpacing: isMobile ? 84 : 96,
      labelFormat: '%b %Y',
      labelMinSpacing: isMobile ? 12 : 16,
    };
  }

  return {
    intervalUnit: 'year',
    intervalStep: 1,
    intervalMinSpacing: isMobile ? 88 : 104,
    labelFormat: '%Y',
    labelMinSpacing: isMobile ? 12 : 16,
  };
};
