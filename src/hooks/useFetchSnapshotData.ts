import { useEffect, useState } from 'react';
import { GetPoolsQuery } from '../__generated__/graphql-types';
import { TimeSeriesData } from '../models';
import { getPoolSnapshotsMap } from './fetchSnapshotDataUtils';

export const useFetchSnapshotData = (
  poolData: GetPoolsQuery | undefined,
  { skip }: { skip: boolean }
) => {
  const [poolSnapshotsMap, setPoolSnapshotsMap] = useState<
    Record<string, TimeSeriesData[]>
  >({});

  const [loading, setLoading] = useState(false);
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
        const pools = poolData.poolGetPools.map((pool) => ({
          id: pool.id,
          chain: pool.chain,
        }));

        const poolSnapshotsMap = await getPoolSnapshotsMap(pools);

        if (isMounted) {
          setPoolSnapshotsMap(poolSnapshotsMap);
        }
      } catch (error) {
        console.error('useFetchSnapshotData:', error);
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
    poolSnapshotsMapLoading: loading,
    poolSnapshotsMap,
    poolSnapshotsMapError: error,
  };
};
