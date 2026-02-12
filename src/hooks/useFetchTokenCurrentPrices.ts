import { useMemo } from 'react';
import {
  GetPoolsQuery,
  GqlChain,
  GetCurrentPricesQuery,
  useGetCurrentPricesQuery,
} from '../__generated__/graphql-types';

type TokenPriceItem = GetCurrentPricesQuery['tokenGetCurrentPrices'][number];

type TokenPricesMap = Record<string, TokenPriceItem>;

/**
 * Fetch current token prices for the chains present in the provided pool data.
 *
 * Returns:
 * - tokenPricesLoading: boolean
 * - tokenPrices: Record<lowercased token address, { address, price }>
 * - tokenPricesError: ApolloError | undefined
 */
export const useFetchTokenCurrentPrices = (
  poolData: GetPoolsQuery | undefined,
  { skip }: { skip: boolean }
) => {
  // Derive unique chains from pool data
  const chains = useMemo<GqlChain[]>(() => {
    const list = poolData?.poolGetPools ?? [];
    const uniq = new Set<GqlChain>();
    for (const p of list) {
      // p.chain is already a GqlChain in generated types
      if (p?.chain) uniq.add(p.chain);
    }
    return Array.from(uniq);
  }, [poolData]);

  const { data, loading, error } = useGetCurrentPricesQuery({
    variables: { chains },
    // Skip if explicitly told to, or if we don't have any chains to query yet
    skip: skip || chains.length === 0,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  // Normalize into a quick lookup table by lowercased token address
  const tokenPrices: TokenPricesMap = useMemo(() => {
    const map: TokenPricesMap = {};
    const items = data?.tokenGetCurrentPrices ?? [];
    for (const item of items) {
      if (!item?.address) continue;
      map[item.address.toLowerCase()] = item;
    }
    return map;
  }, [data]);

  return {
    tokenPricesLoading: loading,
    tokenPrices,
    tokenPricesError: error,
  };
};
