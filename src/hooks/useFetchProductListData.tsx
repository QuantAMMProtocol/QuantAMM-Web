import { useEffect, useMemo, useState } from 'react';
import { useRetrieveProductsQuery } from '../services/productRetrievalService';
import {
  GqlChain,
  GqlPoolFilter,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
  GqlPoolType,
  useGetPoolsQuery,
} from '../__generated__/graphql-types';
import { useAppSelector } from '../app/hooks';
import { selectActiveFilters } from '../features/productExplorer/productExplorerSlice';
import { FilterMap, ProductDto } from '../models';
import { useGenerateProductsFromPoolList } from './useGenerateProductsFromPoolList';

const IS_STUB_DATA = import.meta.env.VITE_USE_STUBS_DATA === 'true';

export const useFetchProductListData = (poolsToLoad: number) => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeFilters = useAppSelector<FilterMap>(selectActiveFilters);

  const {
    data: stubData,
    isLoading: stubDataLoading,
    error: stubDataError,
  } = useRetrieveProductsQuery();

  const where: GqlPoolFilter = useMemo(() => {
    const filter: GqlPoolFilter = {};
    if (activeFilters.chain) {
      filter.chainIn = activeFilters.chain as GqlChain[];
    } else if (activeFilters.chain === undefined) {
      delete filter.chainIn;
    }

    if (activeFilters.poolType) {
      filter.poolTypeIn = activeFilters.poolType as GqlPoolType[];
    } else if (activeFilters.poolType === undefined) {
      delete filter.poolTypeIn;
    }

    if (activeFilters.minTvl) {
      filter.minTvl = parseFloat(activeFilters.minTvl[0]);
    } else if (activeFilters.minTvl === undefined) {
      delete filter.minTvl;
    }

    return filter;
  }, [activeFilters.chain, activeFilters.poolType, activeFilters.minTvl]);

  const {
    data: poolData,
    loading: isLoadingPools,
    error: poolError,
  } = useGetPoolsQuery({
    variables: {
      first: poolsToLoad,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where,
    },
  });

  const {
    productsData,
    error: productsDataError,
    loading: productsDataLoading,
  } = useGenerateProductsFromPoolList(
    IS_STUB_DATA ? stubData : poolData,
    IS_STUB_DATA ? stubDataLoading : isLoadingPools,
    IS_STUB_DATA ? stubDataError : poolError
  );

  useEffect(() => {
    if (!productsDataLoading && !productsDataError && productsData) {
      setProducts(productsData);
      setIsLoading(false);
    }
  }, [productsData, productsDataLoading, productsDataError]);

  useEffect(() => {
    setProducts([]);
    setIsLoading(true);
  }, [activeFilters]);

  const loading = useMemo(() => {
    if (IS_STUB_DATA) {
      return isLoading ?? stubDataLoading;
    }
    return isLoading ?? productsDataLoading;
  }, [stubDataLoading, productsDataLoading, isLoading]);

  return {
    data: products,
    loading,
    error: IS_STUB_DATA ? stubDataError : productsDataError,
  };
};
