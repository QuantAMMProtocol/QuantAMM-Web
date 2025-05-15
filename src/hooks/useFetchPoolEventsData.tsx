import { ApolloError } from '@apollo/client';
import {
  GqlChain,
  GqlPoolEvent,
  GqlPoolEventsDataRange,
  useGetPoolEventsQuery,
} from '../__generated__/graphql-types';
import { useAppSelector } from '../app/hooks';
import { selectQuantammSetPools } from '../features/productExplorer/productExplorerSlice';

export const useFetchPoolEventsData = ({
  first,
  skip,
  poolId,
  chain,
  range,
}: {
  first: number | undefined;
  skip: number | undefined;
  poolId: string;
  chain: GqlChain;
  range: GqlPoolEventsDataRange;
}): {
  poolEvents: GqlPoolEvent[];
  loading: boolean;
  error: ApolloError | undefined;
} => {
  const isQuantammSetPool = useAppSelector(selectQuantammSetPools);
  const { data, loading, error } = useGetPoolEventsQuery({
    variables: {
      first,
      skip,
      where: {
        poolIdIn: [poolId],
        chainIn: [chain],
        range: range,
      },
    },
  });

  return {
    poolEvents: (data?.poolEvents ?? []).map((event) => ({
      ...event,
      logIndex: 0,
      userAddress: '',
      //TODO make pool specific and not hardcoded
      //because of gauges and integration tests launch date != creation date
      //this sets the true launch date for quantamm initial products
    })).filter(x => !isQuantammSetPool[poolId] || x.timestamp >= 1747180800),
    loading,
    error: error ?? new ApolloError({ errorMessage: 'Unknown error' }),
  };
};
