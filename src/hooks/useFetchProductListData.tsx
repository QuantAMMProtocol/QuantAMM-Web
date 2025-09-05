import { useEffect, useMemo, useState } from 'react';
import { useRetrieveProductsQuery } from '../services/productRetrievalService';
import {
  GqlChain,
  GqlPoolFilter,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
  GqlPoolType,
  useGetPoolsCountQuery,
  useGetPoolsQuery,
} from '../__generated__/graphql-types';
import { useAppSelector } from '../app/hooks';
import {
  selectActiveFilters,
  selectTextSearch,
} from '../features/productExplorer/productExplorerSlice';
import { FilterMap, INITIAL_PAGE, ProductMap } from '../models';
import { useGenerateBaseProductsFromPoolList } from './useGenerateBaseProductsFromPoolList';
import { useFetchSnapshotData } from './useFetchSnapshotData';
import { useFetchTokenHistoricalPrices } from './useFetchTokenHistoricalPrices';
import { useGenerateFullProductsFromPoolList } from './useGenerateFullProductsFromPoolList';
import { ApolloError } from '@apollo/client';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const IS_STUB_DATA = import.meta.env.VITE_USE_STUBS_DATA === 'true';

export const useFetchProductListData = (
  pageSize: number,
  page = INITIAL_PAGE
) => {
  const [productMap, setProductMap] = useState<ProductMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    FetchBaseQueryError | SerializedError | ApolloError | null
  >(null);

  const activeFilters = useAppSelector<FilterMap>(selectActiveFilters);
  const textSearch = useAppSelector<string>(selectTextSearch);

  // if IS_STUB_DATA is true, use the stub data
  const {
    data: stubData,
    isLoading: stubDataLoading,
    error: stubDataError,
  } = useRetrieveProductsQuery(undefined, { skip: !IS_STUB_DATA });

  const where: GqlPoolFilter = useMemo(() => {
    const whereClause: GqlPoolFilter = {};
    if (activeFilters.chain) {
      whereClause.chainIn = activeFilters.chain as GqlChain[];
    } else if (activeFilters.chain === undefined) {
      delete whereClause.chainIn;
    }

    if (activeFilters.poolType) {
      whereClause.poolTypeIn = activeFilters.poolType as GqlPoolType[];
    } else if (activeFilters.poolType === undefined) {
      delete whereClause.poolTypeIn;
    }

    if (activeFilters.minTvl) {
      whereClause.minTvl = parseFloat(activeFilters.minTvl[0]);
    } else if (activeFilters.minTvl === undefined) {
      delete whereClause.minTvl;
    }

    whereClause.tagNotIn = ['BLACK_LISTED']

    return whereClause;
  }, [activeFilters.chain, activeFilters.poolType, activeFilters.minTvl]);

  const count = useGetPoolsCountQuery({
    variables: {
      where,
    },
    skip: IS_STUB_DATA,
  });

  // if IS_STUB_DATA is false, use the stub data
  const {
    data: poolData,
    loading: isLoadingPools,
    error: poolError,
  } = useGetPoolsQuery({
    variables: {
      first: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where,
      textSearch,
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
  const { tokenPrices, tokenPricesLoading } = useFetchTokenHistoricalPrices(poolData!, {
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
  }, [baseProductsError]);

  useEffect(() => {
    if (!baseProductsLoading && !baseProductsError && baseProductsData) {
      setProductMap(baseProductsData);
      setLoading(false);
    }
  }, [baseProductsData, baseProductsLoading, baseProductsError]);

  useEffect(() => {
    if (!fullProductsLoading && !fullProductsError && fullProductsData) {
      setProductMap(fullProductsData);
      setLoading(false);
    }
  }, [fullProductsData, fullProductsLoading, fullProductsError]);

  useEffect(() => {
    setProductMap({});
    setLoading(true);
  }, [activeFilters]);

  const productMapLoading = useMemo(() => {
    if (IS_STUB_DATA) {
      return loading ?? stubDataLoading;
    }
    return loading ?? baseProductsLoading;
  }, [stubDataLoading, baseProductsLoading, loading]);

  return {
    productMap,
    productMapLoading,
    productMapError: IS_STUB_DATA ? stubDataError : error,
    count: count.data?.poolGetPoolsCount,
  };
};
