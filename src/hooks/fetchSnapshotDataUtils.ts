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

// Gather all unique chains
export const getChains = (pools: GqlPoolMinimal[]) => {
  const chainSet = new Set<string>();
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
): Promise<
  ApolloQueryResult<{ tokenGetCurrentPrices: GqlTokenPrice[] }>[]
> => {
  const pricesResponses = await Promise.all(
    chains.map((chain) => {
      const query = {
        query: gql`
          ${generateTokenPricesQuery([], chain as GqlChain, GqlTokenChartDataRange.All)}
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
    Record<
      string,
      Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]
    >
  >
): ProductTimeSeriesData[] => {
  const result: ProductTimeSeriesData[] = [];

  const products = Object.values(productMap);

  for (const product of products) {
    const poolAddress = product.id;
    const snapshots = poolSnapshotsMap["poolSnapshot_" + poolAddress] ?? [];
    
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
        ? product.chain.toUpperCase?.() ?? product.chain
        : String(product.chain);

    const constituents = product.poolConstituents ?? [];

    //const live_pools = CURRENT_LIVE_FACTSHEETS;

    // Build base time series with tokenPrices filled in
    const timeSeries: TimeSeriesData[] = snapshots.map((snapshot) => {
      const tokenPrices: Record<string, number> = {};

      for (const token of constituents) {
        const tokenAddress = getTokenAddress(token); // existing helper
        const priceHistory =
          tokenPricesMap[chainKey]?.[tokenAddress] ?? [];

        tokenPrices[tokenAddress] = findClosestPrice(priceHistory, snapshot.timestamp);;
      }

      // Keep the rest of the structure identical to before
      return {
        ...snapshot,
        tokenPrices,
        // sharePrice / hodlSharePrice will be recomputed below
      };
    });

    // Filter out timesteps where any token price is zero (as in the per-product function)
    const noZeroPriceTimeSeries = timeSeries.filter((timestep) => {
      return constituents.every((token, idx) => {
        const addr = getTokenAddress(token);
        const price = timestep.tokenPrices[addr];
        // allow zero amounts to have zero price, but otherwise require positive price
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

    // --- Updated hodl / sharePrice logic to match the individual function ---

    // Base timestep: first non-zero priced entry
    const base = noZeroPriceTimeSeries[0];

    // 1) Compute hodlAmounts and initialTotalShares
    // (mirroring the newer per-product behaviour)
    const baseAmounts = base.amounts ?? [];
    
    // Initial total shares:
    // - if snapshot has non-zero totalShares, use that
    // - otherwise fall back to DEFAULT_INITIAL_TOTAL_SHARES
    const initialTotalShares =
      base.totalShares && base.totalShares > 0
        ? base.totalShares
        : DEFAULT_INITIAL_TOTAL_SHARES;

    // Derive hodlAmounts to be consistent with base snapshot
    // (you can change this to any scheme your single-product function uses;
    // here we just stick to the base snapshot's amounts)
    const hodlAmounts = baseAmounts.slice();

    // 2) Recompute totalLiquidity, sharePrice and hodlSharePrice for each timestep
    for (const timestep of noZeroPriceTimeSeries) {
      const amounts = timestep.amounts ?? [];

      // Total liquidity of the product at this timestep
      let totalLiquidity = 0;
      for (let i = 0; i < amounts.length; i++) {
        const token = constituents[i];
        const addr = getTokenAddress(token);
        const price = timestep.tokenPrices[addr] ?? 0;
        totalLiquidity += amounts[i] * price;
      }

      // Share price: use real totalShares if available, otherwise normalise with initialTotalShares
      const effectiveTotalShares =
        timestep.totalShares && timestep.totalShares > 0
          ? timestep.totalShares
          : initialTotalShares;

      const sharePrice =
        effectiveTotalShares > 0 ? totalLiquidity / effectiveTotalShares : 0;

      // Hodl liquidity (fixed amounts from base, prices from this timestep)
      let hodlTotalLiquidity = 0;
      for (let i = 0; i < hodlAmounts.length; i++) {
        const token = constituents[i];
        const addr = getTokenAddress(token);
        const price = timestep.tokenPrices[addr] ?? 0;
        hodlTotalLiquidity += hodlAmounts[i] * price;
      }

      const hodlSharePrice =
        initialTotalShares > 0
          ? hodlTotalLiquidity / initialTotalShares
          : 0;

      timestep.sharePrice = sharePrice;
      timestep.hodlSharePrice = hodlSharePrice;
    }

    // Keep the outer structure identical – we still return per-product timeSeries
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
  let snapshots = poolSnapshotsMap[`poolSnapshot_${pool.poolGetPool?.id}`];
  
  const live_pools = CURRENT_LIVE_FACTSHEETS;
  snapshots = snapshots.filter((x) => x.timestamp >= (live_pools.factsheets.find(y => y.poolId == pool.poolGetPool?.id)?.launchUnixTimestamp ?? 0));
  
  let hodlAmounts: number[] | undefined;

  let initialTotalShares =
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

    const tokenPriceArray = pool.poolGetPool?.poolTokens.map((token: { address: string }) => {
      const priceData =
        tokenPricesMap[pool.poolGetPool?.chain]?.[getTokenAddress(token)] || [];
      return findClosestPrice(priceData, snapshot.timestamp);
    });
    
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
      tokenPriceArray: tokenPriceArray,
    };
  });

  const firstNonZeroPriceIndex = tempTimeSeries.findIndex((item) => {
    return Object.values(item.tokenPrices).some((price) => price > 0);
  });

  const noZeroPriceTimeSeries = tempTimeSeries.slice(firstNonZeroPriceIndex);


  if (noZeroPriceTimeSeries.length > 0) {
    const totalLiquidity = noZeroPriceTimeSeries[0].totalLiquidity;
    const initialSharePrice = noZeroPriceTimeSeries[0].sharePrice;

    hodlAmounts = pool.poolGetPool?.poolTokens.map((token) => {
      const priceData =
        tokenPricesMap[pool.poolGetPool?.chain.toUpperCase()]?.[
          getTokenAddress(token)
        ] || [];
      const closestPrice = findClosestPrice(priceData, snapshots[0].timestamp);
      
      return totalLiquidity / pool.poolGetPool?.poolTokens.length / closestPrice;
    });

    if (initialSharePrice > 0) {
      initialTotalShares = totalLiquidity / initialSharePrice;
    }
  }
  let totalLiquidityScalingFactor: number | undefined;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < noZeroPriceTimeSeries.length; i++) {
    const timestep = noZeroPriceTimeSeries[i];
    let hodlTotalLiquidity = 0;
    let totalLiquidity = 0;
    for (let j = 0; j < timestep.amounts.length; j++) {
      hodlTotalLiquidity +=
      hodlAmounts![j] *
      timestep.tokenPrices[pool.poolGetPool?.poolTokens[j].address];

      totalLiquidity +=
      timestep.amounts[j] *
      timestep.tokenPrices[pool.poolGetPool?.poolTokens[j].address];
    }

    if (i === 0) {
      totalLiquidityScalingFactor = hodlTotalLiquidity / totalLiquidity;
    }

    timestep.hodlSharePrice = (hodlTotalLiquidity / initialTotalShares) / (totalLiquidityScalingFactor ?? 1);

    timestep.sharePrice =
      (totalLiquidity / timestep.totalShares)

  }

  const timeSeriesData: ProductTimeSeriesData = {
    productId: pool.poolGetPool?.id,
    chain: pool.poolGetPool?.chain,
    timeSeries: noZeroPriceTimeSeries,
  };

  return timeSeriesData;
};
