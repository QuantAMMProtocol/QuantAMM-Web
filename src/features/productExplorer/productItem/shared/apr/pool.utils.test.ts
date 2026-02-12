import { describe, expect, it } from 'vitest';
import { GqlPoolAprItem, GqlPoolAprItemType } from '../../../../../__generated__/graphql-types';
import { getTotalApr, getTotalAprLabel, isProduct } from './pool.utils';

const createAprItem = (
  type: GqlPoolAprItemType,
  apr: number,
  id = `${type}-${apr}`
): GqlPoolAprItem =>
  ({
    id,
    apr,
    type,
    title: '',
  }) as GqlPoolAprItem;

describe('pool.utils view-model logic', () => {
  it('computes total APR min/max and applies staking boost only to max', () => {
    const aprItems = [
      createAprItem(GqlPoolAprItemType.SwapFee_24H, 0.1),
      createAprItem(GqlPoolAprItemType.Staking, 0.03),
      createAprItem(GqlPoolAprItemType.VebalEmissions, 0.02),
      createAprItem(GqlPoolAprItemType.StakingBoost, 0.05),
      createAprItem(GqlPoolAprItemType.Aura, 1), // ignored, not in TOTAL_APR_TYPES
    ];

    const [minTotal, maxTotal] = getTotalApr(aprItems, '2');

    expect(minTotal.toNumber()).toBeCloseTo(0.15, 10);
    expect(maxTotal.toNumber()).toBeCloseTo(0.25, 10);
  });

  it('formats APR labels as range when min/max differ and no explicit boost is passed', () => {
    const aprItems = [
      createAprItem(GqlPoolAprItemType.SwapFee_24H, 0.1),
      createAprItem(GqlPoolAprItemType.StakingBoost, 0.05),
    ];

    expect(getTotalAprLabel(aprItems)).toBe('10.00% - 15.00%');
  });

  it('formats APR label as a single value when explicit boost argument is passed', () => {
    const aprItems = [
      createAprItem(GqlPoolAprItemType.SwapFee_24H, 0.1),
      createAprItem(GqlPoolAprItemType.StakingBoost, 0.05),
    ];

    expect(getTotalAprLabel(aprItems, '2')).toBe('10.00%');
  });

  it('detects product-like objects by poolConstituents presence', () => {
    expect(isProduct({ poolConstituents: [] })).toBe(true);
    expect(isProduct({})).toBe(false);
  });
});
