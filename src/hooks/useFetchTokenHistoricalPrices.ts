import { useEffect, useState } from 'react';
import {
  GetPoolsQuery,
  GqlHistoricalTokenPriceEntry,
  GqlPoolMinimal,
} from '../__generated__/graphql-types';
import {
  getTokenPriceMap,
  getHistoricalTokenPrices,
  getTokens,
} from './fetchSnapshotDataUtils';

export const useFetchTokenHistoricalPrices = (
  poolData: GetPoolsQuery | undefined,
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
    let isMounted = true;

    const fetchData = async () => {
      if (!poolData) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const tokens = getTokens(poolData.poolGetPools as GqlPoolMinimal[]);
        const pricesResponses = await getHistoricalTokenPrices(tokens);

        const tokenPricesMap = getTokenPriceMap(pricesResponses);

        if (isMounted) {
          setTokenPrices(tokenPricesMap);
        }
      } catch (error) {
        console.error('useFetchTokenPrices:', error);
        if (isMounted) {
          setError(error instanceof Error ? error : new Error(String(error)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (skip) {
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [poolData, skip]);

  return {
    tokenPricesLoading: loading,
    tokenPrices,
    tokenPricesError: error,
  };
};
