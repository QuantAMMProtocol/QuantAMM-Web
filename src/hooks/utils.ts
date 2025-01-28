import {
  GqlPoolSnapshotDataRange,
  GqlTokenChartDataRange,
} from '../__generated__/graphql-types';

export const generatePoolSnapshotsQuery = (
  pools: { id: string; chain: string }[],
  range: GqlPoolSnapshotDataRange
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
    (pool, index) => `
    poolSnapshot${index + 1}: poolGetSnapshots(chain: ${
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
  token: string,
  range: GqlTokenChartDataRange
) => {
  const [chain, address] = token.split(':');

  return `query getTokenPrices {
    tokenGetHistoricalPrices(
        addresses: "${address}",
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
