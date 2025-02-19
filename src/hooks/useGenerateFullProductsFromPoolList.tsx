import { useEffect, useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ApolloError } from '@apollo/client';
import { GqlHistoricalTokenPriceEntry } from '../__generated__/graphql-types';
import {
  ProductTimeSeriesData,
  Product,
  ProductDto,
  TimeSeriesData,
} from '../models';
import { getFullProductsFromSnapshots } from '../utils/mapPoolToProduct';
import { getTimeSeriesDataForProductList } from './fetchSnapshotDataUtils';

export const useGenerateFullProductsFromPoolList = (
  baseProductsData?: Product[],
  poolSnapshots?: Record<string, TimeSeriesData[]>,
  tokenPrices?: Record<
    string,
    Record<string, Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]>
  >,
  options?: { skip: boolean }
) => {
  const { skip } = options ?? { skip: false };
  const [fullProductsData, setFullProductsData] = useState<ProductDto[]>([]);
  const [fullProductsLoading, setFullProductsLoading] = useState<boolean>(true);
  const [fullProductsError, setFullProductsError] = useState<
    FetchBaseQueryError | SerializedError | ApolloError | undefined
  >(undefined);

  useEffect(() => {
    if (baseProductsData && poolSnapshots && tokenPrices && !skip) {
      setFullProductsLoading(true);
      try {
        const timeSeriesData: ProductTimeSeriesData[] =
          getTimeSeriesDataForProductList(
            baseProductsData,
            poolSnapshots,
            tokenPrices
          );

        const productsData: Product[] = getFullProductsFromSnapshots(
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
