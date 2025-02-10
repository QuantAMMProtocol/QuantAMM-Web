import { useEffect, useState } from 'react';
import { GqlChain, useGetPoolByIdQuery } from '../__generated__/graphql-types';
import { ProductDto } from '../models';
import { useGenerateProductDataFromPool } from './useGenerateProductDataFromPool';

export const useFetchProductData = (id: string, chain: GqlChain) => {
  const [product, setProduct] = useState<ProductDto | null>(null);

  const {
    data: poolData,
    loading: isLoadingPools,
    error: poolError,
  } = useGetPoolByIdQuery({
    variables: {
      id,
      chain,
    },
  });

  const {
    productData,
    error: balancerDataError,
    loading: balancerDataLoading,
  } = useGenerateProductDataFromPool(poolData, isLoadingPools, poolError);

  useEffect(() => {
    if (!balancerDataLoading && !balancerDataError && productData) {
      setProduct(productData);
    }
  }, [productData, balancerDataLoading, balancerDataError]);

  return {
    data: product,
    loading: balancerDataLoading,
    error: balancerDataError,
  };
};
