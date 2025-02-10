import {
  GetPoolsSummaryQueryVariables,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
  useGetPoolsSummaryQuery,
} from '../__generated__/graphql-types';

const DEFAULT_POOLS_LIMIT = 100;
const DEFAULT_ORDER_BY = GqlPoolOrderBy.TotalLiquidity;
const DEFAULT_ORDER_DIRECTION = GqlPoolOrderDirection.Desc;
const DEFAULT_MIN_TVL = 10000;
const DEFAULT_SKIPPED_POOLS = 0;

export const useFetchPoolsSummaryByParams = (
  params: GetPoolsSummaryQueryVariables
) => {
  const { data, loading, error } = useGetPoolsSummaryQuery({
    variables: {
      first: DEFAULT_POOLS_LIMIT,
      orderBy: DEFAULT_ORDER_BY,
      orderDirection: DEFAULT_ORDER_DIRECTION,
      skip: DEFAULT_SKIPPED_POOLS,
      where: {
        minTvl: DEFAULT_MIN_TVL,
        ...params.where,
      },
      ...params,
    },
  });

  return {
    data,
    loading,
    error,
  };
};
