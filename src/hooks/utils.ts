import {
  GqlChain,
  GqlPoolSnapshotDataRange,
  GqlTokenChartDataRange,
} from '../__generated__/graphql-types';
import { Product, TimeSeriesData } from '../models';

export const generatePoolSnapshotsQuery = (
  pools: { id: string; chain: string }[],
  range: GqlPoolSnapshotDataRange,
) => {
  const baseQuery = `
    poolId
    amounts
    fees24h
    sharePrice
    timestamp
    totalShares
    totalLiquidity
    holdersCount
    totalSwapVolume
    volume24h
    chain
  `;

  const queries = pools.map(
    (pool) => `
    poolSnapshot_${pool.id}: poolGetSnapshots(chain: ${
      pool.chain
    }, range: ${range}, id: "${pool.id}") {
      ${baseQuery}
    }
  `
  );

  return `
    query GetPoolSnapshots {
      ${queries.join('\n')}
    }
  `;
};

export const generateTokenPricesQuery = (
  addresses: string[],
  chain: GqlChain,
  range: GqlTokenChartDataRange
) => {
  return `query getTokenPrices {
    tokenGetHistoricalPrices(
        addresses: [${addresses.map((address) => `"${address}"`).join(',')}],
        chain: ${chain}
        range: ${range}
    ) {
        address
        chain
        prices {
        timestamp
        price
      }
    }
  }`;
};

export const findClosestPrice = (
  prices: { timestamp: string; price: number }[],
  targetTimestamp: number
) => {
  const range = 24 * 60 * 60; // 24 hours in seconds

  if (!prices) return 0;

  for (const priceEntry of prices) {
    const diff = Math.abs(Number(priceEntry.timestamp) - targetTimestamp);
    if (diff <= range) {
      return priceEntry.price;
    }
  }
  return 0;
};

export const filterOutBptToken = (
  product: Product,
  snapshot: TimeSeriesData
): number[] => {
  const poolBptTokenAddress = product.id.substring(0, 42);

  const bptIndex = product.poolConstituents.findIndex(
    (token: { address: string }) => token.address === poolBptTokenAddress
  );

  let filteredAmounts;
  if (bptIndex !== undefined) {
    filteredAmounts = snapshot.amounts.filter((_, index) => index !== bptIndex);
  } else {
    filteredAmounts = snapshot.amounts;
  }

  return filteredAmounts.map(Number);
};
