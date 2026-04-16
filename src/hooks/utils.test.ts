import { describe, expect, it } from 'vitest';
import {
  GqlChain,
  GqlPoolSnapshotDataRange,
  GqlTokenChartDataRange,
} from '../__generated__/graphql-types';
import { Product, TimeSeriesData } from '../models';
import {
  filterOutBptToken,
  findClosestPrice,
  generatePoolSnapshotsQuery,
  generateTokenPricesQuery,
} from './utils';

describe('hooks/utils view-model logic', () => {
  it('generates a multi-pool snapshots query with aliased result keys', () => {
    const query = generatePoolSnapshotsQuery(
      [
        { id: '0xpool1', chain: GqlChain.Mainnet },
        { id: '0xpool2', chain: GqlChain.Arbitrum },
      ],
      GqlPoolSnapshotDataRange.AllTime
    );

    expect(query).toContain('query GetPoolSnapshots');
    expect(query).toContain('poolSnapshot_0xpool1: poolGetSnapshots');
    expect(query).toContain('poolSnapshot_0xpool2: poolGetSnapshots');
    expect(query).toContain('chain: MAINNET');
    expect(query).toContain('chain: ARBITRUM');
    expect(query).toContain('range: ALL_TIME');
  });

  it('generates token prices query with quoted addresses', () => {
    const query = generateTokenPricesQuery(
      ['0xabc', '0xdef'],
      GqlChain.Base,
      GqlTokenChartDataRange.All
    );

    expect(query).toContain('addresses: ["0xabc","0xdef"]');
    expect(query).toContain('chain: BASE');
    expect(query).toContain('range: ALL');
  });

  it('returns nearest price within one-day tolerance', () => {
    const prices = [
      { timestamp: '1704067200', price: 100 },
      { timestamp: '1704153600', price: 110 },
    ];

    expect(findClosestPrice(prices, 1704067200)).toBe(100);
    expect(findClosestPrice(prices, 1704067200 + 60 * 60 * 20)).toBe(110);
    expect(findClosestPrice(prices, 1704067200 + 60 * 60 * 24)).toBe(110);
    expect(findClosestPrice(prices, 1704067200 + 60 * 60 * 80)).toBe(0);
  });

  it('filters out the BPT token amount from snapshots when present', () => {
    const bptAddress = '0x1234567890123456789012345678901234567890';
    const product = {
      id: `${bptAddress}-suffix`,
      poolConstituents: [
        { coin: 'BPT', weight: 10, address: bptAddress },
        { coin: 'ETH', weight: 45, address: '0x111' },
        { coin: 'USDC', weight: 45, address: '0x222' },
      ],
    } as unknown as Product;

    const snapshot = {
      amounts: [99, 40, 60],
    } as TimeSeriesData;

    const result = filterOutBptToken(product, snapshot);

    expect(result).toEqual([40, 60]);
  });
});
