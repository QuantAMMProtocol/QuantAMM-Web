import { useEffect, useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { ApolloError } from '@apollo/client';
import { GetPoolByIdQuery } from '../__generated__/graphql-types';
import { PoolTimeSeriesData, Product } from '../models';
import { getProductFromPool } from '../features/productExplorer/utils';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  getPoolSnapshotsMap,
  getTimeSeriesDataForProduct,
  getTokenAddress,
  getTokenPriceMap,
  getTokenPrices,
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
    if (!isLoadingPools && !poolError && poolData) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const pool = {
            id: poolData.poolGetPool?.id,
            chain: poolData.poolGetPool?.chain,
          };

          const poolSnapshotsMap = await getPoolSnapshotsMap([pool]);

          const tokens = poolData.poolGetPool?.poolTokens.map(
            (token) => `${pool.chain}:${getTokenAddress(token)}`
          );

          const pricesResponses = await getTokenPrices(tokens);

          const tokenPricesMap = getTokenPriceMap(pricesResponses);

          const timeSeriesData: PoolTimeSeriesData =
            getTimeSeriesDataForProduct(
              poolData,
              poolSnapshotsMap,
              tokenPricesMap
            );

          const generatedProduct: Product = getProductFromPool(
            poolData,
            timeSeriesData
          );

          setProductData(generatedProduct);
        } catch (error) {
          console.error(
            'useGenerateProductDataFromPool - Error fetching data:',
            error
          );
          setError(
            error as FetchBaseQueryError | SerializedError | ApolloError
          );
        } finally {
          setLoading(false);
        }
      };

      fetchData().catch((error) => {
        console.error(
          'useGenerateProductDataFromPool - Error in fetchData:',
          error
        );
        setError(error as FetchBaseQueryError | SerializedError | ApolloError);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [poolData, poolError, isLoadingPools]);

  return {
    productData,
    loading,
    error,
  };
};
