import BigNumber from 'bignumber.js';
import {
  GqlPoolAprItem,
  GqlPoolAprItemType,
} from '../../../../../__generated__/graphql-types';
import { bn, fNum } from '../../../../../utils/numbers';
import { TOTAL_APR_TYPES } from './useAprTooltip';

/**
 * Calculates the total APR based on the array of APR items and an optional boost value.
 *
 * @param {GqlPoolAprItem[]} aprItems - The array of APR items to calculate the total APR from.
 * @param {string} [vebalBoost] - An optional boost value for calculation.
 * @returns {[BigNumber, BigNumber]} The total APR range.
 */
export function getTotalApr(
  aprItems: GqlPoolAprItem[],
  vebalBoost?: string
): [BigNumber, BigNumber] {
  let minTotal = bn(0);
  let maxTotal = bn(0);
  const boost = vebalBoost ?? 1;

  aprItems
    // Filter known APR types to avoid including new unknown API types that are not yet displayed in the APR tooltip
    .filter((item) => TOTAL_APR_TYPES.includes(item.type))
    .forEach((item) => {
      if (item.type === GqlPoolAprItemType.StakingBoost) {
        maxTotal = bn(item.apr).times(boost).plus(maxTotal);
        return;
      }

      if (item.type === GqlPoolAprItemType.VebalEmissions) {
        minTotal = bn(item.apr).plus(minTotal);
        maxTotal = bn(item.apr).plus(maxTotal);
        return;
      }

      if (item.type === GqlPoolAprItemType.MabeetsEmissions) {
        minTotal = bn(item.apr).plus(minTotal);
        maxTotal = bn(item.apr).plus(maxTotal);
        return;
      }

      minTotal = bn(item.apr).plus(minTotal);
      maxTotal = bn(item.apr).plus(maxTotal);
    });

  return [minTotal, maxTotal];
}

export function getTotalAprLabel(
  aprItems: GqlPoolAprItem[],
  vebalBoost?: string
): string {
  const [minTotal, maxTotal] = getTotalApr(aprItems, vebalBoost);

  if (minTotal.eq(maxTotal) || vebalBoost) {
    return fNum('apr', minTotal.toString());
  } else {
    return `${fNum('apr', minTotal.toString())} - ${fNum('apr', maxTotal.toString())}`;
  }
}
