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
import { useGenerateBaseProductsFromPoolList } from './useGenerateBaseProductsFromPoolList';
import { useFetchSnapshotData } from './useFetchSnapshotData';
import { useFetchTokenPrices } from './useFetchTokenPrices';
import { useGenerateFullProductsFromPoolList } from './useGenerateFullProductsFromPoolList';
import { ApolloError } from '@apollo/client';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const IS_STUB_DATA = import.meta.env.VITE_USE_STUBS_DATA === 'true';

export const useFetchProductListData = (poolsToLoad: number) => {
  const [productList, setProductList] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    FetchBaseQueryError | SerializedError | ApolloError | null
  >(null);

  const activeFilters = useAppSelector<FilterMap>(selectActiveFilters);

  // if IS_STUB_DATA is true, use the stub data
  const {
    data: stubData,
    isLoading: stubDataLoading,
    error: stubDataError,
  } = useRetrieveProductsQuery(undefined, { skip: !IS_STUB_DATA });

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

  // if IS_STUB_DATA is false, use the stub data
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
    skip: IS_STUB_DATA,
  });

  // generate the base products from the pool data
  const { baseProductsData, baseProductsLoading, baseProductsError } =
    useGenerateBaseProductsFromPoolList(
      IS_STUB_DATA ? stubData : poolData,
      IS_STUB_DATA ? stubDataLoading : isLoadingPools,
      IS_STUB_DATA ? stubDataError : poolError
    );

  // fetch the snapshot data for the pool data
  const { poolSnapshotsMap, poolSnapshotsMapLoading } = useFetchSnapshotData(
    poolData!,
    {
      skip: IS_STUB_DATA,
    }
  );

  // fetch the token prices for the pool data
  const { tokenPrices, tokenPricesLoading } = useFetchTokenPrices(poolData!, {
    skip: IS_STUB_DATA,
  });

  // generate the full products from the pool data
  const { fullProductsData, fullProductsLoading, fullProductsError } =
    useGenerateFullProductsFromPoolList(
      baseProductsData,
      poolSnapshotsMap,
      tokenPrices,
      {
        skip: IS_STUB_DATA && poolSnapshotsMapLoading && tokenPricesLoading,
      }
    );

  useEffect(() => {
    if (baseProductsError) {
      setError(baseProductsError);
    }
    if (!baseProductsLoading && !baseProductsError && baseProductsData) {
      setProductList(baseProductsData);
      setLoading(false);
    }
    if (!fullProductsLoading && !fullProductsError && fullProductsData) {
      setProductList(fullProductsData);
    }
  }, [
    baseProductsData,
    baseProductsLoading,
    baseProductsError,
    fullProductsData,
    fullProductsLoading,
    fullProductsError,
  ]);

  useEffect(() => {
    setProductList([]);
    setLoading(true);
  }, [activeFilters]);

  const productListLoading = useMemo(() => {
    if (IS_STUB_DATA) {
      return loading ?? stubDataLoading;
    }
    return loading ?? baseProductsLoading;
  }, [stubDataLoading, baseProductsLoading, loading]);

  return {
    productList,
    productListLoading,
    productListError: IS_STUB_DATA ? stubDataError : error,
  };
};
