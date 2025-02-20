import { useEffect, useState } from 'react';
import {
  GetPoolsQuery,
  GqlHistoricalTokenPriceEntry,
  GqlPoolMinimal,
} from '../__generated__/graphql-types';
import {
  getTokenPriceMap,
  getTokenPrices,
  getTokens,
} from './fetchSnapshotDataUtils';

export const useFetchTokenPrices = (
  poolData: GetPoolsQuery,
  { skip }: { skip: boolean }
) => {
  const [tokenPrices, setTokenPrices] = useState<
    Record<
      string,
      Record<
        string,
        Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]
      >
    >
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!poolData) {
        return;
      }

      const tokens = getTokens(poolData.poolGetPools as GqlPoolMinimal[]);
      const pricesResponses = await getTokenPrices(tokens);

      const tokenPricesMap = getTokenPriceMap(pricesResponses);

      setTokenPrices(tokenPricesMap);
      setLoading(false);
    };

    if (!skip) {
      setLoading(true);
      fetchData().catch((error) => {
        console.error('useFetchTokenPrices:', error);
        setError(error);
      });
    }
  }, [poolData, skip]);

  return {
    tokenPricesLoading: loading,
    tokenPrices,
    tokenPricesError: error,
  };
};
