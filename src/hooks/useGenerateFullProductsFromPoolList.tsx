import { useEffect, useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ApolloError } from '@apollo/client';
import { GqlHistoricalTokenPriceEntry } from '../__generated__/graphql-types';
import { ProductTimeSeriesData, TimeSeriesData, ProductMap } from '../models';
import { getFullProductsFromSnapshots } from '../utils/mapPoolToProduct';
import { getTimeSeriesDataForProductList } from './fetchSnapshotDataUtils';
import { useAppSelector } from '../app/hooks';
import { selectQuantammSetPools } from '../features/productExplorer/productExplorerSlice';

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
  const quantammSetPools = useAppSelector(selectQuantammSetPools);

  useEffect(() => {
    if (baseProductsData && poolSnapshots && tokenPrices && !skip) {
      setFullProductsLoading(true);
      try {
        const timeSeriesData: ProductTimeSeriesData[] =
          getTimeSeriesDataForProductList(
            baseProductsData,
            poolSnapshots,
            tokenPrices,
            quantammSetPools
          );

        const productsData: ProductMap = getFullProductsFromSnapshots(
          baseProductsData,
          timeSeriesData
        );
        setFullProductsLoading(false);
        setFullProductsData(productsData);
      } catch (error) {
        setFullProductsError(
          error as FetchBaseQueryError | SerializedError | ApolloError
        );
        setFullProductsLoading(false);
      }
    }
  }, [baseProductsData, poolSnapshots, tokenPrices, skip]);

  return {
    fullProductsData,
    fullProductsLoading,
    fullProductsError,
  };
};
