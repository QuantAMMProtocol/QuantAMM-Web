import { describe, expect, it } from 'vitest';
import {
  Product,
  ProductPoolConstituents,
  TimeSeriesData,
} from '../../../models';
import {
  getBenchmarkEqualWeightedAmounts,
  getFilteredConstituents,
  getNormalisedAreaData,
  getNormalisedAreaSeries,
  getTimeAxisOption,
  normalisedTokenName,
} from './productTokenWeightChangeOverTimeUtils';

const createConstituent = (
  coin: string,
  address: string
): ProductPoolConstituents => ({
  coin,
  address,
  weight: 50,
});

const createTimeStep = (
  timestamp: number,
  amounts: number[],
  tokenPrices: Record<string, number>
): TimeSeriesData =>
  ({
    timestamp,
    amounts,
    tokenPrices,
  }) as TimeSeriesData;

describe('productTokenWeightChangeOverTimeUtils view-model logic', () => {
  it('normalizes token names by replacing dots', () => {
    expect(normalisedTokenName('w.steth')).toBe('w-steth');
  });

  it('filters out BPT constituent when product id prefix matches token address', () => {
    const bptAddress = '0x1111111111111111111111111111111111111111';
    const product = {
      id: `${bptAddress}-pool`,
      poolConstituents: [
        createConstituent('BPT', bptAddress),
        createConstituent('ETH', '0x222'),
        createConstituent('USDC', '0x333'),
      ],
    } as Product;

    const result = getFilteredConstituents(product);

    expect(result.map((item) => item.coin)).toEqual(['ETH', 'USDC']);
  });

  it('builds time-axis ticks based on number of points', () => {
    const emptyAxis = getTimeAxisOption([]);
    expect(emptyAxis).toEqual({ type: 'time' });

    const onePointAxis = getTimeAxisOption([createTimeStep(1000, [], {})]);
    expect(onePointAxis).toEqual({
      type: 'time',
      interval: { values: [1000000] },
    });

    const threePointsAxis = getTimeAxisOption([
      createTimeStep(1000, [], {}),
      createTimeStep(2000, [], {}),
      createTimeStep(4000, [], {}),
    ]);
    expect(threePointsAxis.interval?.values).toEqual([
      1000000, 2500000, 4000000,
    ]);
  });

  it('computes equal-weight benchmark amounts from first timestep liquidity', () => {
    const constituents = [
      createConstituent('ETH', '0x222'),
      createConstituent('USDC', '0x333'),
    ];
    const series = [
      createTimeStep(1000, [2, 3], {
        '0x222': 10,
        '0x333': 20,
      }),
    ];

    const result = getBenchmarkEqualWeightedAmounts(true, series, constituents);

    expect(result).toEqual([4, 2]);
    expect(
      getBenchmarkEqualWeightedAmounts(false, series, constituents)
    ).toEqual([]);
  });

  it('generates normalised area data for benchmark and non-benchmark modes', () => {
    const constituents = [
      createConstituent('ETH', '0x222'),
      createConstituent('USDC', '0x333'),
    ];
    const series = [
      createTimeStep(1000, [2, 3], {
        '0x222': 10,
        '0x333': 20,
      }),
    ];

    const nonBenchmark = getNormalisedAreaData(series, constituents, false, []);
    expect(nonBenchmark[0].eth).toBe(20);
    expect(nonBenchmark[0].usdc).toBe(60);

    const benchmark = getNormalisedAreaData(series, constituents, true, [4, 2]);
    expect(benchmark[0].eth).toBe(40);
    expect(benchmark[0].usdc).toBe(40);
    expect(benchmark[0].dateAsString).toBe('1970-01-01');
  });

  it('builds area-series configuration for each constituent', () => {
    const constituents = [
      createConstituent('ETH', '0x222'),
      createConstituent('W.STETH', '0x333'),
    ];

    const series = getNormalisedAreaSeries(constituents);

    expect(series).toEqual([
      {
        type: 'area',
        xKey: 'timestamp',
        yKey: 'eth',
        yName: 'eth',
        normalizedTo: 100,
        stacked: true,
      },
      {
        type: 'area',
        xKey: 'timestamp',
        yKey: 'w-steth',
        yName: 'w.steth',
        normalizedTo: 100,
        stacked: true,
      },
    ]);
  });
});
