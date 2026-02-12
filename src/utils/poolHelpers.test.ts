import { describe, expect, it } from 'vitest';
import { GqlPoolType } from '../__generated__/graphql-types';
import {
  isCowAmmPool,
  isLBP,
  isLiquidityBootstrapping,
  isQuantAmmPool,
  isVebalPool,
} from './poolHelpers';

describe('poolHelpers view-model logic', () => {
  it('detects pool type predicates correctly', () => {
    expect(isCowAmmPool(GqlPoolType.CowAmm)).toBe(true);
    expect(isCowAmmPool(GqlPoolType.Weighted)).toBe(false);

    expect(isLiquidityBootstrapping(GqlPoolType.LiquidityBootstrapping)).toBe(
      true
    );
    expect(isLBP(GqlPoolType.LiquidityBootstrapping)).toBe(true);
    expect(isLBP(GqlPoolType.Stable)).toBe(false);

    expect(isQuantAmmPool(GqlPoolType.QuantAmmWeighted)).toBe(true);
    expect(isQuantAmmPool(GqlPoolType.Weighted)).toBe(false);
  });

  it('identifies the veBAL pool by canonical id ignoring case', () => {
    const veBalId =
      '0x5C6EE304399DBDB9C8EF030AB642B10820DB8F56000200000000000000000014';
    const otherId =
      '0x5C6EE304399DBDB9C8EF030AB642B10820DB8F56000200000000000000000099';

    expect(isVebalPool(veBalId)).toBe(true);
    expect(isVebalPool(otherId)).toBe(false);
  });
});
