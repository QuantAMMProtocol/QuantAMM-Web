import { useEffect, useState } from 'react';
import { GetPoolsQuery } from '../__generated__/graphql-types';
import { TimeSeriesData } from '../models';
import { getPoolSnapshotsMap } from './fetchSnapshotDataUtils';

export const useFetchSnapshotData = (
  poolData: GetPoolsQuery,
  { skip }: { skip: boolean }
) => {
  const [poolSnapshotsMap, setPoolSnapshotsMap] = useState<
    Record<string, TimeSeriesData[]>
  >({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!poolData || loading) {
        return;
      }

      setLoading(true);

      const pools = poolData.poolGetPools.map((pool) => ({
        id: pool.id,
        chain: pool.chain,
      }));

      const poolSnapshotsMap = await getPoolSnapshotsMap(pools);

      setPoolSnapshotsMap(poolSnapshotsMap);
      setLoading(false);
    };

    if (!skip) {
      fetchData().catch((error) => {
        console.error('useFetchSnapshotData:', error);
        setError(error);
      });
    }
  }, [poolData, skip, loading]);

  return {
    poolSnapshotsMapLoading: loading,
    poolSnapshotsMap,
    poolSnapshotsMapError: error,
  };
};
