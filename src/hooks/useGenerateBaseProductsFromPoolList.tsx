import { useEffect, useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ApolloError } from '@apollo/client';
import { GetPoolsQuery, GqlPoolMinimal } from '../__generated__/graphql-types';
import { mapPoolToBaseProduct } from '../utils/mapPoolToProduct';
import { ProductMap } from '../models';

export const useGenerateBaseProductsFromPoolList = (
  poolData?: GetPoolsQuery,
  isLoadingPools?: boolean,
  poolError?: FetchBaseQueryError | SerializedError | ApolloError
) => {
  const [baseProductsData, setBaseProductsData] = useState<ProductMap>({});
  const [baseProductsLoading, setBaseProductsLoading] = useState<boolean>(true);
  const [baseProductsError, setBaseProductsError] = useState<
    FetchBaseQueryError | SerializedError | ApolloError | undefined
  >(undefined);

  useEffect(() => {
    if (!isLoadingPools && !poolError && poolData) {
      const fetchData = () => {
        try {
          const productData: ProductMap = mapPoolToBaseProduct(
            poolData.poolGetPools as GqlPoolMinimal[]
          );

          setBaseProductsData(productData);
        } catch (error) {
          console.error(
            'useGenerateProductsFromPoolList -Error fetching data:',
            error
          );
          setBaseProductsError(
            error as FetchBaseQueryError | SerializedError | ApolloError
          );
        } finally {
          setBaseProductsLoading(false);
        }
      };
      setBaseProductsLoading(true);
      fetchData();
    } else {
      setBaseProductsLoading(false);
    }
  }, [poolData, poolError, isLoadingPools]);

  return {
    baseProductsData,
    baseProductsLoading,
    baseProductsError,
  };
};
