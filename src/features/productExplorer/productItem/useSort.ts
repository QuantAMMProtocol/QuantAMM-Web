import { useCallback } from 'react';
import { Product } from '../../../models';
import { useAppSelector } from '../../../app/hooks';
import {
  selectSortingDirection,
  selectSortingMetric,
} from '../productExplorerSlice';

export const useSort = () => {
  const sortingMetric = useAppSelector(selectSortingMetric);
  const sortingDirection = useAppSelector(selectSortingDirection);

  const toComparableNumber = useCallback((value: unknown) => {
    const parsed =
      typeof value === 'number'
        ? value
        : value == null
          ? Number.NaN
          : parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : 0;
  }, []);

  const sort = useCallback(
    (productList: Product[] = []) => {
      const localProductList = [...productList];
      return localProductList.sort((productA, productB) => {
        let comparableA = 0;
        let comparableB = 0;
        if (
          sortingMetric === 'adaptability' ||
          sortingMetric === 'diversification'
        ) {
          comparableA =
            productA.overview.find((item) => item.metric === sortingMetric)
              ?.value ?? 0;
          comparableB =
            productB.overview.find((item) => item.metric === sortingMetric)
              ?.value ?? 0;
        } else if (sortingMetric === 'performance') {
          comparableA = productA.currentPerformance ?? 0;
          comparableB = productB.currentPerformance ?? 0;
        } else if (sortingMetric === 'tvl') {
          comparableA = toComparableNumber(
            productA.dynamicData?.totalLiquidity
          );
          comparableB = toComparableNumber(
            productB.dynamicData?.totalLiquidity
          );
        } else if (sortingMetric === 'yield') {
          comparableA = toComparableNumber(
            productA.dynamicData?.yieldCapture48h
          );
          comparableB = toComparableNumber(
            productB.dynamicData?.yieldCapture48h
          );
        } else if (sortingMetric === 'sharePrice') {
          comparableA =
            productA.timeSeries?.[productA.timeSeries?.length - 1]
              ?.sharePrice ?? 0;
          comparableB =
            productB.timeSeries?.[productB.timeSeries?.length - 1]
              ?.sharePrice ?? 0;
        } else if (sortingMetric === 'age') {
          comparableA = productA.createTime
            ? new Date(productA.createTime).getTime()
            : 0;
          comparableB = productB.createTime
            ? new Date(productB.createTime).getTime()
            : 0;
        } else if (sortingMetric === 'apr') {
          comparableA = productA.sortableApr ?? 0;
          comparableB = productB.sortableApr ?? 0;
        }

        if (comparableA < comparableB) {
          return sortingDirection === 'asc' ? -1 : 1;
        }

        if (comparableA > comparableB) {
          return sortingDirection === 'asc' ? 1 : -1;
        }

        const totalA = productA.overview.reduce(
          (total, next) => (total += next.value ?? 0),
          0
        );
        const totalB = productB.overview.reduce(
          (total, next) => (total += next.value ?? 0),
          0
        );

        if (totalA === totalB) {
          return 0;
        }
        return totalA < totalB ? 1 : -1;
      });
    },
    [sortingMetric, sortingDirection, toComparableNumber]
  );

  return { sort };
};
