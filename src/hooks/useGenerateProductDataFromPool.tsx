import { useEffect, useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { ApolloError } from '@apollo/client';
import { GetPoolByIdQuery } from '../__generated__/graphql-types';
import { Product, ProductTimeSeriesData } from '../models';
import { getProductFromPool } from '../utils/mapPoolToProduct';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  getPoolSnapshotsMap,
  getTimeSeriesDataForProduct,
  getTokenAddress,
  getTokenPriceMap,
  getHistoricalTokenPrices,
} from './fetchSnapshotDataUtils';

export const useGenerateProductDataFromPool = (
  poolData?: GetPoolByIdQuery,
  isLoadingPools?: boolean,
  poolError?: FetchBaseQueryError | SerializedError | ApolloError
) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<
    FetchBaseQueryError | SerializedError | ApolloError | undefined
  >(undefined);

  useEffect(() => {
    let isMounted = true;

    if (
      !isLoadingPools &&
      !poolError &&
      poolData?.poolGetPool?.id &&
      poolData.poolGetPool.id !== ''
    ) {
      const fetchData = async () => {
        setLoading(true);
        setError(undefined);
        try {
          const pool = {
            id: poolData.poolGetPool.id,
            chain: poolData.poolGetPool.chain,
          };

          const poolSnapshotsMap = await getPoolSnapshotsMap([pool]);

          const tokens = poolData.poolGetPool.poolTokens.map(
            (token) => `${pool.chain}:${getTokenAddress(token)}`
          );

          const pricesResponses = await getHistoricalTokenPrices(tokens);

          const tokenPricesMap = getTokenPriceMap(pricesResponses);

          const timeSeriesData: ProductTimeSeriesData =
            getTimeSeriesDataForProduct(
              poolData,
              poolSnapshotsMap,
              tokenPricesMap
            );

          const generatedProduct: Product = getProductFromPool(
            poolData,
            timeSeriesData
          );

          if (isMounted) {
            setProductData(generatedProduct);
          }
        } catch (error) {
          console.error(
            'useGenerateProductDataFromPool - Error fetching data:',
            error
          );
          if (isMounted) {
            setError(
              error as FetchBaseQueryError | SerializedError | ApolloError
            );
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      void fetchData();
    } else {
      if (poolError) {
        setError(poolError);
      }
      setLoading(Boolean(isLoadingPools));
    }

    return () => {
      isMounted = false;
    };
  }, [poolData, poolError, isLoadingPools]);

  return {
    productData,
    loading,
    error,
  };
};
