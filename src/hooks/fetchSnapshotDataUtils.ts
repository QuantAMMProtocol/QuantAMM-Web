import { ApolloQueryResult, gql } from '@apollo/client';
import {
  GetPoolByIdQuery,
  GqlChain,
  GqlHistoricalTokenPrice,
  GqlHistoricalTokenPriceEntry,
  GqlPoolMinimal,
  GqlPoolSnapshotDataRange,
  GqlTokenChartDataRange,
} from '../__generated__/graphql-types';
import {
  Product,
  ProductMap,
  ProductTimeSeriesData,
  TimeSeriesData,
} from '../models';
import { apolloClient } from '../queries/apolloClient';
import {
  findClosestPrice,
  generatePoolSnapshotsQuery,
  generateTokenPricesQuery,
  filterOutBptToken,
} from './utils';

export const DEFAULT_INITIAL_TOTAL_SHARES = 1;

export const getPoolSnapshotsMap = async (
  pools: {
    id: string;
    chain: GqlChain;
  }[]
): Promise<Record<string, TimeSeriesData[]>> => {
  if (pools.length === 0) {
    return {};
  }
  const [poolSnapshotsResponse] = await Promise.all([
    apolloClient.query({
      query: gql`
        ${generatePoolSnapshotsQuery(pools, GqlPoolSnapshotDataRange.AllTime)}
      `,
    }),
  ]);

  return poolSnapshotsResponse.data;
};

export const getTokenAddress = (token: { address: string }) => {
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
    pool.poolTokens.forEach((token) => {
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
  const tokensMap: Record<string, string[]> = {};

  tokens.forEach((token) => {
    const [chain, address] = token.split(':');
    tokensMap[chain] = [...(tokensMap[chain] || []), address];
  });

  const pricesResponses = await Promise.all(
    Object.entries(tokensMap).map(([chain, addresses]) => {
      const query = {
        query: gql`
          ${generateTokenPricesQuery(
            addresses,
            chain as GqlChain,
            GqlTokenChartDataRange.All
          )}
        `,
      };

      return apolloClient.query(query);
    })
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
        tokenGetHistoricalPrices.forEach(({ address, chain, prices }) => {
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
        });
      }
    }
  );

  return tokenPricesMap;
};

// TODO: getTimeSeriesDataForProductList and getTimeSeriesDataForProduct have some shared logic, can we abstract it out?
export const getTimeSeriesDataForProductList = (
  productMap: ProductMap,
  poolSnapshotsMap: Record<string, TimeSeriesData[]>,
  tokenPricesMap: Record<
    string,
    Record<string, Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]>
  >,
  isQuantAMMSetPool: boolean
): ProductTimeSeriesData[] => {
  return Object.values(productMap).map((product) => {
    let snapshots = poolSnapshotsMap[`poolSnapshot_${product.address}`];
    if (isQuantAMMSetPool) {
      snapshots = snapshots.filter((x) => x.timestamp >= 1747180800);
    }
    const hodlAmounts = snapshots[0]?.amounts;
    const initialTotalShares =
      snapshots[0]?.totalShares > 0
        ? snapshots[0]?.totalShares
        : DEFAULT_INITIAL_TOTAL_SHARES;
    const tempTimeSeries = snapshots.map((snapshot: TimeSeriesData) => {
      const tokenPrices = Object.fromEntries(
        product.poolConstituents.map((token: { address: string }) => {
          const priceData =
            tokenPricesMap[product.chain]?.[getTokenAddress(token)] || [];
          const closestPrice = findClosestPrice(priceData, snapshot.timestamp);
          return [token.address, closestPrice];
        })
      );

      const amounts = filterOutBptToken(product, snapshot);

      return {
        timestamp: snapshot.timestamp,
        amounts,
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

    const firstNonZeroPriceIndex = tempTimeSeries.findIndex((item) => {
      return Object.values(item.tokenPrices).some((price) => price > 0);
    });

    const noZeroPriceTimeSeries = tempTimeSeries.slice(firstNonZeroPriceIndex);

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < noZeroPriceTimeSeries.length; i++) {
      const timestep = noZeroPriceTimeSeries[i];
      let hodlTotalLiquidity = 0;
      for (let j = 0; j < timestep.amounts.length; j++) {
        hodlTotalLiquidity +=
          hodlAmounts[j] *
          timestep.tokenPrices[product.poolConstituents[j].address];
      }
      timestep.hodlSharePrice = hodlTotalLiquidity / initialTotalShares;
    }

    return {
      productId: product.id,
      chain: product.chain,
      timeSeries: noZeroPriceTimeSeries,
    };
  });
};

export const getTimeSeriesDataForProduct = (
  pool: GetPoolByIdQuery,
  poolSnapshotsMap: Record<string, TimeSeriesData[]>,
  tokenPricesMap: Record<
    string,
    Record<string, Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]>
  >,
  isQuantAMMSetPool: boolean
): ProductTimeSeriesData => {
  let snapshots = poolSnapshotsMap[`poolSnapshot_${pool.poolGetPool?.id}`];
  if (isQuantAMMSetPool) {
    //TODO launch date should really be per pool
    snapshots = snapshots.filter((x) => x.timestamp >= 1747180800);
  }
  let hodlAmounts: number[] | undefined;

  const initialTotalShares =
    snapshots[0]?.totalShares > 0
      ? snapshots[0]?.totalShares
      : DEFAULT_INITIAL_TOTAL_SHARES;

  const tempTimeSeries = snapshots.map((snapshot: TimeSeriesData) => {
    const tokenPrices = Object.fromEntries(
      pool.poolGetPool?.poolTokens.map((token) => {
        const priceData =
          tokenPricesMap[pool.poolGetPool?.chain.toUpperCase()]?.[
            getTokenAddress(token)
          ] || [];
        const closestPrice = findClosestPrice(priceData, snapshot.timestamp);
        return [token.address, closestPrice];
      })
    );

    const amounts = filterOutBptToken(
      {
        id: pool.poolGetPool?.id,
        chain: pool.poolGetPool?.chain,
        poolConstituents: pool.poolGetPool?.poolTokens.map((token) => ({
          address: token.address,
          weight: token.weight,
        })),
      } as Product,
      snapshot
    );

    if (!hodlAmounts) {
      hodlAmounts = amounts;
    }

    return {
      timestamp: snapshot.timestamp,
      amounts,
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

  const firstNonZeroPriceIndex = tempTimeSeries.findIndex((item) => {
    return Object.values(item.tokenPrices).some((price) => price > 0);
  });

  const noZeroPriceTimeSeries = tempTimeSeries.slice(firstNonZeroPriceIndex);

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < noZeroPriceTimeSeries.length; i++) {
    const timestep = noZeroPriceTimeSeries[i];
    let hodlTotalLiquidity = 0;
    for (let j = 0; j < timestep.amounts.length; j++) {
      hodlTotalLiquidity +=
        hodlAmounts![j] *
        timestep.tokenPrices[pool.poolGetPool?.poolTokens[j].address];
    }
    timestep.hodlSharePrice = hodlTotalLiquidity / initialTotalShares;
  }

  const timeSeriesData: ProductTimeSeriesData = {
    productId: pool.poolGetPool?.id,
    chain: pool.poolGetPool?.chain,
    timeSeries: noZeroPriceTimeSeries,
  };

  return timeSeriesData;
};
