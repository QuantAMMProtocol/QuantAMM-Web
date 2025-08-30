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
  getTokenPrices,
} from './fetchSnapshotDataUtils';
import { useAppSelector } from '../app/hooks';
import { selectQuantammSetPools } from '../features/productExplorer/productExplorerSlice';

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
  const quantammSetPools = useAppSelector(selectQuantammSetPools);

  useEffect(() => {
    if (
      !isLoadingPools &&
      !poolError &&
      poolData?.poolGetPool?.id &&
      poolData?.poolGetPool?.id != ''
    ) {
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
          const setPool = quantammSetPools[pool.id] != undefined;

          const timeSeriesData: ProductTimeSeriesData =
            getTimeSeriesDataForProduct(
              poolData,
              poolSnapshotsMap,
              tokenPricesMap,
              setPool
            );
          console.log('timeSeriesData', timeSeriesData);
          const generatedProduct: Product = getProductFromPool(
            poolData,
            timeSeriesData
          );
          console.log('generatedProduct', generatedProduct);
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
  }, [poolData, poolError, isLoadingPools, quantammSetPools]);

  return {
    productData,
    loading,
    error,
  };
};
