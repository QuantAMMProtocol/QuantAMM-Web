import { ApolloQueryResult, gql } from '@apollo/client';
import {
  GetPoolsQuery,
  GqlChain,
  GqlHistoricalTokenPrice,
  GqlHistoricalTokenPriceEntry,
  GqlPoolMinimal,
  GqlPoolSnapshotDataRange,
  GqlTokenChartDataRange,
} from '../__generated__/graphql-types';
import { PoolTimeSeriesData, TimeSeriesData } from '../models';
import { apolloClient } from '../queries/apolloClient';
import {
  findClosestPrice,
  generatePoolSnapshotsQuery,
  generateTokenPricesQuery,
} from './utils';

export const getPoolSnapshotsMap = async (
  pools: {
    id: string;
    chain: GqlChain;
  }[]
): Promise<Record<string, TimeSeriesData[]>> => {
  const [poolSnapshotsResponse] = await Promise.all([
    apolloClient.query({
      query: gql`
        ${generatePoolSnapshotsQuery(pools, GqlPoolSnapshotDataRange.AllTime)}
      `,
    }),
  ]);

  return poolSnapshotsResponse.data;
};

const getTokenAddress = (token: { address: string }) => {
  if (
    token.address.toLowerCase() === '0x9b570fb4f1b4ad1138b4613f98a4928833437a9b'
  ) {
    // Wrapped ETH ARBITRUM
    return '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
  }
  return token.address;
};

// Gather all unique tokens
export const getTokens = (pools: GqlPoolMinimal[]) => {
  const tokenSet = new Set<string>();
  pools.forEach((pool) => {
    pool.allTokens.forEach((token) => {
      tokenSet.add(`${pool.chain}:${getTokenAddress(token)}`);
    });
  });

  return Array.from(tokenSet);
};

export const getTokenPrices = async (
  tokens: string[]
): Promise<
  ApolloQueryResult<{ tokenGetHistoricalPrices: GqlHistoricalTokenPrice[] }>[]
> => {
  const pricesResponses = await Promise.all(
    tokens.map((token: string) =>
      apolloClient.query({
        query: gql`
          ${generateTokenPricesQuery(token, GqlTokenChartDataRange.OneYear)}
        `,
      })
    )
  );

  return pricesResponses;
};

export const getTokenPriceMap = (
  pricesResponses: ApolloQueryResult<{
    tokenGetHistoricalPrices: GqlHistoricalTokenPrice[];
  }>[]
) => {
  const tokenPricesMap: Record<
    string,
    Record<string, Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]>
  > = {};

  pricesResponses.forEach(
    (
      response: ApolloQueryResult<{
        tokenGetHistoricalPrices: GqlHistoricalTokenPrice[];
      }>
    ) => {
      const { tokenGetHistoricalPrices } = response.data;

      if (tokenGetHistoricalPrices.length > 0) {
        const [{ address, chain, prices }] = tokenGetHistoricalPrices;

        if (tokenPricesMap[chain] === undefined) {
          tokenPricesMap[chain] = {};
        }

        if (tokenPricesMap[chain][address] === undefined) {
          tokenPricesMap[chain][address] = [];
        }

        tokenPricesMap[chain][address] = prices.map((price) => ({
          timestamp: price.timestamp,
          price: price.price,
        }));
      }
    }
  );

  return tokenPricesMap;
};

const DEFAULT_INITIAL_TOTAL_SHARES = 1;

export const getTimeSeriesData = (
  pools: GetPoolsQuery,
  poolSnapshotsMap: Record<string, TimeSeriesData[]>,
  tokenPricesMap: Record<
    string,
    Record<string, Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]>
  >
): PoolTimeSeriesData[] => {
  return pools.poolGetPools.map((pool, index) => {
    const snapshots = poolSnapshotsMap[`poolSnapshot${index + 1}`];
    const hodlAmounts = snapshots[0]?.amounts;
    const initialTotalShares =
      snapshots[0]?.totalShares > 0
        ? snapshots[0]?.totalShares
        : DEFAULT_INITIAL_TOTAL_SHARES;

    const tempTimeSeries = snapshots.map((snapshot: TimeSeriesData) => {
      const tokenPrices = Object.fromEntries(
        pool.allTokens.map((token) => {
          const priceData =
            tokenPricesMap[pool.chain.toUpperCase()]?.[
              getTokenAddress(token)
            ] || [];

          const closestPrice = findClosestPrice(priceData, snapshot.timestamp);

          return [token.address, closestPrice];
        })
      );

      return {
        timestamp: snapshot.timestamp,
        amounts: snapshot.amounts.map(Number),
        fees24h: Number(snapshot.fees24h),
        totalLiquidity: Number(snapshot.totalLiquidity),
        sharePrice: Number(snapshot.sharePrice),
        totalShares: Number(snapshot.totalShares),
        totalSwapVolume: Number(snapshot.totalSwapVolume),
        volume24h: Number(snapshot.volume24h),
        tokenPrices,
        hodlSharePrice: 0,
      };
    });

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < tempTimeSeries.length; i++) {
      const timestep = tempTimeSeries[i];
      let hodlTotalLiquidity = 0;
      for (let j = 0; j < timestep.amounts.length; j++) {
        hodlTotalLiquidity +=
          hodlAmounts[j] * timestep.tokenPrices[pool.allTokens[j].address];
      }
      timestep.hodlSharePrice = hodlTotalLiquidity / initialTotalShares;
    }

    return {
      poolId: pool.id,
      chain: pool.chain,
      timeSeries: tempTimeSeries,
    };
  });
};
