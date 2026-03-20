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
  params: GetPoolsSummaryQueryVariables,
  options?: {
    skip?: boolean;
    includeDefaultWhereFilters?: boolean;
  }
) => {
  const { first, orderBy, orderDirection, skip, where } = params;
  const includeDefaultWhereFilters = options?.includeDefaultWhereFilters ?? true;

  const whereWithDefaults = includeDefaultWhereFilters
    ? {
        minTvl: DEFAULT_MIN_TVL,
        tagNotIn: ['BLACK_LISTED'],
        ...where,
      }
    : where;

  const { data, loading, error } = useGetPoolsSummaryQuery({
    skip: options?.skip ?? false,
    variables: {
      first: first ?? DEFAULT_POOLS_LIMIT,
      orderBy: orderBy ?? DEFAULT_ORDER_BY,
      orderDirection: orderDirection ?? DEFAULT_ORDER_DIRECTION,
      skip: skip ?? DEFAULT_SKIPPED_POOLS,
      where: whereWithDefaults,
    },
  });

  return {
    data,
    loading,
    error,
  };
};
