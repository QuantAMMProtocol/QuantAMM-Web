import { ApolloQueryResult, gql } from '@apollo/client';
import {
  GetPoolByIdQuery,
  GqlChain,
  GqlHistoricalTokenPrice,
  GqlHistoricalTokenPriceEntry,
  GqlPoolMinimal,
  GqlPoolSnapshotDataRange,
  GqlTokenChartDataRange,
  GqlTokenPrice,
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
import { CURRENT_LIVE_FACTSHEETS } from '../features/documentation/factSheets/liveFactsheets';

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
  const poolSnapshotsResponse = await apolloClient.query({
    query: gql`
      ${generatePoolSnapshotsQuery(pools, GqlPoolSnapshotDataRange.AllTime)}
    `,
  });

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

// Gather all unique chains
export const getChains = (pools: GqlPoolMinimal[]) => {
  const chainSet = new Set<GqlChain>();
  pools.forEach((pool) => {
    chainSet.add(pool.chain);
  });
  return Array.from(chainSet);
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
export const getCurrentTokenPrices = async (
  chains: string[]
): Promise<ApolloQueryResult<{ tokenGetCurrentPrices: GqlTokenPrice[] }>[]> => {
  const pricesResponses = await Promise.all(
    chains.map((chain) => {
      const query = {
        query: gql`
          ${generateTokenPricesQuery(
            [],
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

export const getHistoricalTokenPrices = async (
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

export const getTimeSeriesDataForProductList = (
  productMap: ProductMap,
  poolSnapshotsMap: Record<string, TimeSeriesData[]>,
  tokenPricesMap: Record<
    string,
    Record<string, Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]>
  >
): ProductTimeSeriesData[] => {
  const result: ProductTimeSeriesData[] = [];

  const products = Object.values(productMap);

  for (const product of products) {
    const poolAddress = product.id;
    const snapshots = poolSnapshotsMap[`poolSnapshot_${poolAddress}`] ?? [];

    if (!snapshots.length) {
      result.push({
        productId: product.id,
        chain: product.chain,
        timeSeries: [],
      });
      continue;
    }

    const chainKey =
      typeof product.chain === 'string'
        ? product.chain.toUpperCase()
        : String(product.chain);

    const constituents = product.poolConstituents ?? [];
    const timeSeries: TimeSeriesData[] = snapshots.map((snapshot) => {
      const tokenPrices: Record<string, number> = {};

      for (const token of constituents) {
        const tokenAddress = getTokenAddress(token);
        const priceHistory = tokenPricesMap[chainKey]?.[tokenAddress] ?? [];

        tokenPrices[tokenAddress] = findClosestPrice(
          priceHistory,
          snapshot.timestamp
        );
      }

      return {
        ...snapshot,
        tokenPrices,
      };
    });

    const noZeroPriceTimeSeries = timeSeries.filter((timestep) => {
      return constituents.every((token, idx) => {
        const addr = getTokenAddress(token);
        const price = timestep.tokenPrices[addr];
        if ((timestep.amounts?.[idx] ?? 0) === 0) {
          return true;
        }
        return price > 0;
      });
    });

    if (!noZeroPriceTimeSeries.length) {
      result.push({
        productId: product.id,
        chain: product.chain,
        timeSeries: [],
      });
      continue;
    }
    const base = noZeroPriceTimeSeries[0];

    const baseAmounts = base.amounts ?? [];

    const initialTotalShares =
      base.totalShares && base.totalShares > 0
        ? base.totalShares
        : DEFAULT_INITIAL_TOTAL_SHARES;

    const hodlAmounts = baseAmounts.slice();

    for (const timestep of noZeroPriceTimeSeries) {
      const amounts = timestep.amounts ?? [];

      let totalLiquidity = 0;
      for (let i = 0; i < amounts.length; i++) {
        const token = constituents[i];
        const addr = getTokenAddress(token);
        const price = timestep.tokenPrices[addr] ?? 0;
        totalLiquidity += amounts[i] * price;
      }

      const effectiveTotalShares =
        timestep.totalShares && timestep.totalShares > 0
          ? timestep.totalShares
          : initialTotalShares;

      const sharePrice =
        effectiveTotalShares > 0 ? totalLiquidity / effectiveTotalShares : 0;

      let hodlTotalLiquidity = 0;
      for (let i = 0; i < hodlAmounts.length; i++) {
        const token = constituents[i];
        const addr = getTokenAddress(token);
        const price = timestep.tokenPrices[addr] ?? 0;
        hodlTotalLiquidity += hodlAmounts[i] * price;
      }

      const hodlSharePrice =
        initialTotalShares > 0 ? hodlTotalLiquidity / initialTotalShares : 0;

      timestep.sharePrice = sharePrice;
      timestep.hodlSharePrice = hodlSharePrice;
    }

    result.push({
      productId: product.id,
      chain: product.chain,
      timeSeries: noZeroPriceTimeSeries,
    });
  }

  return result;
};

export const getTimeSeriesDataForProduct = (
  pool: GetPoolByIdQuery,
  poolSnapshotsMap: Record<string, TimeSeriesData[]>,
  tokenPricesMap: Record<
    string,
    Record<string, Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]>
  >
): ProductTimeSeriesData => {
  const poolId = pool.poolGetPool?.id ?? '';
  const poolChain = pool.poolGetPool?.chain ?? '';
  const poolTokens = pool.poolGetPool?.poolTokens ?? [];
  const launchUnixTimestamp =
    CURRENT_LIVE_FACTSHEETS.factsheets.find(
      (factSheet) => factSheet.poolId === poolId
    )?.launchUnixTimestamp ?? 0;

  const snapshots = (poolSnapshotsMap[`poolSnapshot_${poolId}`] ?? []).filter(
    (snapshot) => snapshot.timestamp >= launchUnixTimestamp
  );

  if (snapshots.length === 0) {
    return {
      productId: poolId,
      chain: poolChain,
      timeSeries: [],
    };
  }

  let hodlAmounts: number[] | undefined;

  let initialTotalShares =
    snapshots[0]?.totalShares > 0
      ? snapshots[0]?.totalShares
      : DEFAULT_INITIAL_TOTAL_SHARES;

  const tempTimeSeries = snapshots.map((snapshot: TimeSeriesData) => {
    const tokenPrices = Object.fromEntries(
      poolTokens.map((token) => {
        const priceData =
          tokenPricesMap[poolChain.toUpperCase()]?.[getTokenAddress(token)] ||
          [];
        const closestPrice = findClosestPrice(priceData, snapshot.timestamp);
        return [token.address, closestPrice];
      })
    );

    const tokenPriceArray = poolTokens.map((token: { address: string }) => {
      const priceData =
        tokenPricesMap[poolChain.toUpperCase()]?.[getTokenAddress(token)] || [];
      return findClosestPrice(priceData, snapshot.timestamp);
    });

    const amounts = filterOutBptToken(
      {
        id: poolId,
        chain: poolChain,
        poolConstituents: poolTokens.map((token) => ({
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
      tokenPriceArray,
    };
  });

  const firstNonZeroPriceIndex = tempTimeSeries.findIndex((item) => {
    return Object.values(item.tokenPrices).some((price) => price > 0);
  });

  const noZeroPriceTimeSeries =
    firstNonZeroPriceIndex === -1
      ? []
      : tempTimeSeries.slice(firstNonZeroPriceIndex);

  if (noZeroPriceTimeSeries.length > 0) {
    const totalLiquidity = noZeroPriceTimeSeries[0].totalLiquidity;
    const initialSharePrice = noZeroPriceTimeSeries[0].sharePrice;
    const baseTimestamp = noZeroPriceTimeSeries[0].timestamp;

    hodlAmounts = poolTokens.map((token) => {
      const priceData =
        tokenPricesMap[poolChain.toUpperCase()]?.[getTokenAddress(token)] || [];
      const closestPrice = findClosestPrice(priceData, baseTimestamp);
      if (closestPrice <= 0) {
        return 0;
      }

      return totalLiquidity / poolTokens.length / closestPrice;
    });

    if (initialSharePrice > 0) {
      initialTotalShares = totalLiquidity / initialSharePrice;
    }
  }

  let totalLiquidityScalingFactor: number | undefined;
  for (let i = 0; i < noZeroPriceTimeSeries.length; i++) {
    const timestep = noZeroPriceTimeSeries[i];
    let hodlTotalLiquidity = 0;
    let totalLiquidity = 0;
    for (let j = 0; j < timestep.amounts.length; j++) {
      hodlTotalLiquidity +=
        (hodlAmounts?.[j] ?? 0) * timestep.tokenPrices[poolTokens[j].address];

      totalLiquidity +=
        timestep.amounts[j] * timestep.tokenPrices[poolTokens[j].address];
    }

    if (i === 0) {
      totalLiquidityScalingFactor = hodlTotalLiquidity / totalLiquidity;
    }

    timestep.hodlSharePrice =
      hodlTotalLiquidity /
      initialTotalShares /
      (totalLiquidityScalingFactor ?? 1);

    timestep.sharePrice =
      timestep.totalShares > 0 ? totalLiquidity / timestep.totalShares : 0;
  }

  const timeSeriesData: ProductTimeSeriesData = {
    productId: poolId,
    chain: poolChain,
    timeSeries: noZeroPriceTimeSeries,
  };

  return timeSeriesData;
};
