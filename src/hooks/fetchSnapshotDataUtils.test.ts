import { describe, expect, it } from 'vitest';
import { ApolloQueryResult } from '@apollo/client';
import {
  GqlChain,
  GetPoolByIdQuery,
  GqlHistoricalTokenPrice,
  GqlHistoricalTokenPriceEntry,
  GqlPoolMinimal,
} from '../__generated__/graphql-types';
import { Product, ProductMap, TimeSeriesData } from '../models';
import {
  getChains,
  getTokenAddress,
  getTokenPriceMap,
  getTimeSeriesDataForProduct,
  getTimeSeriesDataForProductList,
  getTokens,
} from './fetchSnapshotDataUtils';

const ARBITRUM_WETH_ALIAS = '0x9b570fb4f1b4ad1138b4613f98a4928833437a9b';
const ARBITRUM_WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';

const createMinimalPool = (
  id: string,
  chain: GqlChain,
  tokenAddresses: string[]
): GqlPoolMinimal =>
  ({
    id,
    chain,
    poolTokens: tokenAddresses.map((address) => ({ address })),
  }) as unknown as GqlPoolMinimal;

const createSnapshot = (
  timestamp: number,
  amounts: number[],
  totalShares: number
): TimeSeriesData =>
  ({
    timestamp,
    amounts,
    fees24h: 0,
    sharePrice: 0,
    totalShares,
    totalLiquidity: 0,
    totalSwapVolume: 0,
    volume24h: 0,
    tokenPrices: {},
    tokenPriceArray: [],
    hodlSharePrice: 0,
  }) as TimeSeriesData;

describe('fetchSnapshotDataUtils view-model logic', () => {
  it('maps the known arbitrum wrapped ETH alias address', () => {
    expect(getTokenAddress({ address: ARBITRUM_WETH_ALIAS })).toBe(
      ARBITRUM_WETH
    );
    expect(getTokenAddress({ address: '0xabc' })).toBe('0xabc');
  });

  it('deduplicates chains and chain-address tokens across pools', () => {
    const pools = [
      createMinimalPool('p1', GqlChain.Arbitrum, [
        ARBITRUM_WETH_ALIAS,
        '0xabc',
      ]),
      createMinimalPool('p2', GqlChain.Arbitrum, ['0xabc']),
      createMinimalPool('p3', GqlChain.Base, ['0xdef']),
    ];

    const chains = getChains(pools);
    const tokens = getTokens(pools);

    expect(chains).toEqual(
      expect.arrayContaining([GqlChain.Arbitrum, GqlChain.Base])
    );
    expect(tokens).toEqual(
      expect.arrayContaining([
        `${GqlChain.Arbitrum}:${ARBITRUM_WETH}`,
        `${GqlChain.Arbitrum}:0xabc`,
        `${GqlChain.Base}:0xdef`,
      ])
    );
    expect(
      tokens.filter((token) => token === `${GqlChain.Arbitrum}:0xabc`)
    ).toHaveLength(1);
  });

  it('builds a chain-address price history map from historical token responses', () => {
    const responses = [
      {
        data: {
          tokenGetHistoricalPrices: [
            {
              address: '0xabc',
              chain: GqlChain.Base,
              prices: [
                { timestamp: '100', price: 1.1 },
                { timestamp: '200', price: 2.2 },
              ],
            },
            {
              address: '0xdef',
              chain: GqlChain.Arbitrum,
              prices: [{ timestamp: '300', price: 3.3 }],
            },
          ],
        },
      } as ApolloQueryResult<{
        tokenGetHistoricalPrices: GqlHistoricalTokenPrice[];
      }>,
    ];

    const map = getTokenPriceMap(responses);

    expect(map[GqlChain.Base]['0xabc']).toEqual([
      { timestamp: '100', price: 1.1 },
      { timestamp: '200', price: 2.2 },
    ]);
    expect(map[GqlChain.Arbitrum]['0xdef']).toEqual([
      { timestamp: '300', price: 3.3 },
    ]);
  });

  it('computes sharePrice/hodlSharePrice for product list and filters out zero-price timesteps', () => {
    const tokenAddress = '0x111';
    const productMap: ProductMap = {
      pool1: {
        id: 'pool1',
        chain: GqlChain.Base,
        poolConstituents: [{ address: tokenAddress, coin: 'AAA', weight: 100 }],
      } as unknown as Product,
    };

    const poolSnapshotsMap: Record<string, TimeSeriesData[]> = {
      poolSnapshot_pool1: [
        createSnapshot(100, [10], 5),
        createSnapshot(200, [10], 5),
        createSnapshot(400000, [10], 5),
      ],
    };

    const tokenPricesMap: Record<
      string,
      Record<
        string,
        Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]
      >
    > = {
      [GqlChain.Base]: {
        [tokenAddress]: [
          { timestamp: '100', price: 2 },
          { timestamp: '200', price: 4 },
        ],
      },
    };

    const result = getTimeSeriesDataForProductList(
      productMap,
      poolSnapshotsMap,
      tokenPricesMap
    );

    expect(result).toHaveLength(1);
    expect(result[0].timeSeries).toHaveLength(2);
    expect(result[0].timeSeries[0].sharePrice).toBe(4);
    expect(result[0].timeSeries[0].hodlSharePrice).toBe(4);
    expect(result[0].timeSeries[1].sharePrice).toBe(8);
    expect(result[0].timeSeries[1].hodlSharePrice).toBe(8);
  });

  it('generates product time-series from snapshots and token prices after first non-zero price point', () => {
    const tokenA = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const tokenB = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

    const pool = {
      poolGetPool: {
        id: 'pool-test',
        chain: GqlChain.Base,
        poolTokens: [
          { address: tokenA, weight: '0.5' },
          { address: tokenB, weight: '0.5' },
        ],
      },
    } as unknown as GetPoolByIdQuery;

    const poolSnapshotsMap: Record<string, TimeSeriesData[]> = {
      'poolSnapshot_pool-test': [
        createSnapshot(1, [10, 10], 100),
        {
          ...createSnapshot(200000, [10, 10], 100),
          totalLiquidity: 300,
          sharePrice: 3,
        },
        {
          ...createSnapshot(300000, [10, 10], 100),
          totalLiquidity: 400,
          sharePrice: 4,
        },
      ],
    };

    const tokenPricesMap: Record<
      string,
      Record<
        string,
        Pick<GqlHistoricalTokenPriceEntry, 'timestamp' | 'price'>[]
      >
    > = {
      [GqlChain.Base]: {
        [tokenA]: [
          { timestamp: '200000', price: 10 },
          { timestamp: '300000', price: 20 },
        ],
        [tokenB]: [
          { timestamp: '200000', price: 20 },
          { timestamp: '300000', price: 20 },
        ],
      },
    };

    const result = getTimeSeriesDataForProduct(
      pool,
      poolSnapshotsMap,
      tokenPricesMap
    );

    expect(result.productId).toBe('pool-test');
    expect(result.chain).toBe(GqlChain.Base);
    expect(result.timeSeries).toHaveLength(2);
    expect(result.timeSeries[0].timestamp).toBe(200000);
    expect(result.timeSeries[0].sharePrice).toBe(3);
    expect(result.timeSeries[0].hodlSharePrice).toBe(3);
    expect(result.timeSeries[1].timestamp).toBe(300000);
    expect(result.timeSeries[1].sharePrice).toBe(4);
    expect(result.timeSeries[1].hodlSharePrice).toBe(4.5);
  });
});
