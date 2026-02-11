import { useEffect, useState } from 'react';
import { GqlChain, useGetPoolByIdQuery } from '../__generated__/graphql-types';
import { Product } from '../models';
import { useGenerateProductDataFromPool } from './useGenerateProductDataFromPool';
import { shallowEqual } from 'react-redux';

export const useFetchProductData = (id: string, chain: GqlChain) => {
  const [product, setProduct] = useState<Product | null>(null);
  const {
    data: poolData,
    loading: isLoadingPools,
    error: poolError,
  } = useGetPoolByIdQuery({
    variables: {
      id,
      chain,
    },
    skip: !id || !chain || id === '',
  });

  const { productData, error, loading } = useGenerateProductDataFromPool(
    poolData,
    isLoadingPools,
    poolError
  );

  useEffect(() => {
    if (!loading && !error && productData?.id && productData.id !== '') {
      setProduct((prev) => {
        if (prev && shallowEqual(prev, productData)) {
          return prev;
        }
        return productData;
      });
    }
  }, [loading, error, productData]);

  return {
    product,
    productLoading: loading,
    productError: error,
  };
};
