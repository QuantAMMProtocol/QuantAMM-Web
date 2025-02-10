import { useEffect, useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { ApolloError } from '@apollo/client';
import { GetPoolsQuery, GqlPoolMinimal } from '../__generated__/graphql-types';
import { PoolTimeSeriesData, Product } from '../models';
import { getProductRecordFromPoolList } from '../features/productExplorer/utils';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  getPoolSnapshotsMap,
  getTimeSeriesDataForProductList,
  getTokenPriceMap,
  getTokenPrices,
  getTokens,
} from './fetchSnapshotDataUtils';

export const useGenerateProductsFromPoolList = (
  poolData?: GetPoolsQuery,
  isLoadingPools?: boolean,
  poolError?: FetchBaseQueryError | SerializedError | ApolloError
) => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<
    FetchBaseQueryError | SerializedError | ApolloError | undefined
  >(undefined);

  useEffect(() => {
    if (!isLoadingPools && !poolError && poolData) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const pools = poolData.poolGetPools.map((pool) => ({
            id: pool.id,
            chain: pool.chain,
          }));

          const poolSnapshotsMap = await getPoolSnapshotsMap(pools);

          const tokens = getTokens(poolData.poolGetPools as GqlPoolMinimal[]);

          const pricesResponses = await getTokenPrices(tokens);

          const tokenPricesMap = getTokenPriceMap(pricesResponses);

          const timeSeriesData: PoolTimeSeriesData[] =
            getTimeSeriesDataForProductList(
              poolData,
              poolSnapshotsMap,
              tokenPricesMap
            );

          const productsRecord: Record<string, Product> =
            getProductRecordFromPoolList(
              poolData.poolGetPools as GqlPoolMinimal[],
              timeSeriesData
            );

          setProductsData(Object.values(productsRecord));
        } catch (error) {
          console.error(
            'useGenerateProductsFromPoolList -Error fetching data:',
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
          'useGenerateProductsFromPoolList - Error in fetchData:',
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
    productsData,
    loading,
    error,
  };
};
