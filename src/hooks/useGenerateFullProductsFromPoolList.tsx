import { useEffect, useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ApolloError } from '@apollo/client';
import { GqlHistoricalTokenPriceEntry } from '../__generated__/graphql-types';
import { ProductTimeSeriesData, TimeSeriesData, ProductMap } from '../models';
import { getFullProductsFromSnapshots } from '../utils/mapPoolToProduct';
import { getTimeSeriesDataForProductList } from './fetchSnapshotDataUtils';

export const useGenerateFullProductsFromPoolList = (
  baseProductsData: ProductMap,
  poolSnapshots?: Record<string, TimeSeriesData[]>,
  tokenPrices?: Record<
    string,
    Record<string, Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]>
  >,
  options?: { skip: boolean }
) => {
  const { skip } = options ?? { skip: false };
  const [fullProductsData, setFullProductsData] = useState<ProductMap>({});
  const [fullProductsLoading, setFullProductsLoading] = useState<boolean>(true);
  const [fullProductsError, setFullProductsError] = useState<
    FetchBaseQueryError | SerializedError | ApolloError | undefined
  >(undefined);

  useEffect(() => {
    if (skip) {
      setFullProductsLoading(false);
      return;
    }

    if (
      !poolSnapshots ||
      Object.keys(poolSnapshots).length === 0 ||
      !tokenPrices
    ) {
      setFullProductsLoading(false);
      return;
    }

    setFullProductsLoading(true);
    try {
      const timeSeriesData: ProductTimeSeriesData[] =
        getTimeSeriesDataForProductList(
          baseProductsData,
          poolSnapshots,
          tokenPrices
        );

      const productsData: ProductMap = getFullProductsFromSnapshots(
        baseProductsData,
        timeSeriesData
      );

      setFullProductsError(undefined);
      setFullProductsData(productsData);
    } catch (error) {
      console.error('Error generating full products from pool list:', error);
      setFullProductsError(
        error as FetchBaseQueryError | SerializedError | ApolloError
      );
    } finally {
      setFullProductsLoading(false);
    }
  }, [baseProductsData, poolSnapshots, tokenPrices, skip]);

  return {
    fullProductsData,
    fullProductsLoading,
    fullProductsError,
  };
};
