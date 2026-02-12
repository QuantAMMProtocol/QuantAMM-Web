import { describe, expect, it } from 'vitest';
import { Product } from '../../../../models';
import { getCurrentPrice, getTvl } from './productItemHelpers';

describe('productItemHelpers view-model logic', () => {
  it('formats TVL as compact USD and returns undefined when missing', () => {
    const withTvl = {
      dynamicData: { totalLiquidity: 1_250_000 },
    } as unknown as Product;
    const withoutTvl = {} as Product;

    expect(getTvl(withTvl)).toBe('$1.25M');
    expect(getTvl(withoutTvl)).toBeUndefined();
  });

  it('returns undefined current price when no time series is present', () => {
    const product = {} as Product;
    expect(getCurrentPrice(product)).toBeUndefined();
  });

  it('formats current share price from the last time-series entry and defaults null to $0.0', () => {
    const withPrice = {
      timeSeries: [{ sharePrice: 12.349 }],
    } as unknown as Product;
    const withNullPrice = {
      timeSeries: [{}],
    } as unknown as Product;

    expect(getCurrentPrice(withPrice)).toBe('$12.4');
    expect(getCurrentPrice(withNullPrice)).toBe('$0');
  });
});
