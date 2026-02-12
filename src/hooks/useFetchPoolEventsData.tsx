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
  const launchUnixTimestamp =
    CURRENT_LIVE_FACTSHEETS.factsheets.find(
      (factSheet) => factSheet.poolId === poolId
    )?.launchUnixTimestamp ?? 0;

  const { data, loading, error } = useGetPoolEventsQuery({
    variables: {
      first,
      skip,
      where: {
        poolId,
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
      .filter((event) => event.timestamp >= launchUnixTimestamp),
    loading,
    error,
  };
};
