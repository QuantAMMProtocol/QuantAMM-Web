import { ApolloError } from '@apollo/client';
import {
  GqlChain,
  GqlPoolEvent,
  useGetPoolEventsQuery,
} from '../__generated__/graphql-types';
import { CURRENT_LIVE_FACTSHEETS } from '../features/documentation/factSheets/liveFactsheets';

export const useFetchPoolEventsData = ({
  first,
  skip,
  poolId,
  chain,
}: {
  first: number | undefined;
  skip: number | undefined;
  poolId: string;
  chain: GqlChain;
}): {
  poolEvents: GqlPoolEvent[];
  loading: boolean;
  error: ApolloError | undefined;
} => {
  const live_pools = CURRENT_LIVE_FACTSHEETS;

  const { data, loading, error } = useGetPoolEventsQuery({
    variables: {
      first,
      skip,
      where: {
        poolId: poolId,
        chainIn: [chain],
      },
    },
  });

  return {
    poolEvents: (data?.poolEvents ?? [])
      .map((event) => ({
        ...event,
        logIndex: 0,
        userAddress: '',
      }))
      .filter((x) => !live_pools.factsheets.find(x => x.poolId == poolId) || x.timestamp >= (live_pools.factsheets.find(x => x.poolId == poolId)?.launchUnixTimestamp ?? 0)),
    loading,
    error: error,
  };
};
