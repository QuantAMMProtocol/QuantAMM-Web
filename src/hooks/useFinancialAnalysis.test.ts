import { describe, expect, it } from 'vitest';
import { Product, TimeSeriesData } from '../models';
import {
  buildFinancialAnalysisBreakdown,
  buildPortfolioReturns,
} from './useFinancialAnalysis';

const timeSeries: TimeSeriesData[] = [
  {
    timestamp: 1_700_000_000,
    sharePrice: 100,
    hodlSharePrice: 100,
    amounts: [1, 1],
    tokenPrices: {},
    tokenPriceArray: [],
    fees24h: 0,
    totalShares: 1,
    totalLiquidity: 100,
    totalSwapVolume: 0,
    volume24h: 0,
  },
  {
    timestamp: 1_700_086_400,
    sharePrice: 110,
    hodlSharePrice: 105,
    amounts: [1, 1],
    tokenPrices: {},
    tokenPriceArray: [],
    fees24h: 0,
    totalShares: 1,
    totalLiquidity: 110,
    totalSwapVolume: 0,
    volume24h: 0,
  },
];

describe('useFinancialAnalysis view-model logic', () => {
  it('builds portfolio and hodl return vectors from time-series data', () => {
    const result = buildPortfolioReturns(timeSeries);

    expect(result).toEqual([
      [1_700_000_000_000, 0, 0],
      [1_700_086_400_000, 0.1, 0.05],
    ]);
  });

  it('builds a live simulation breakdown payload from product and analysis', () => {
    const product = {
      id: 'pool-1',
      name: 'Test Pool',
      createTime: '2024-01-01 00:00:00',
    } as Product;

    const analysis = {
      return_analysis: [],
      benchmark_analysis: [],
      return_timeseries_analysis: [],
      final_weights: [],
      final_weights_strings: [],
      final_unix_timestamp: 0,
      jax_parameters: {},
      smart_contract_parameters: { values: {}, strings: {} },
      readouts: { values: {}, strings: {} },
    };

    const breakdown = buildFinancialAnalysisBreakdown({
      product,
      analysis,
    });

    expect(breakdown).toEqual(
      expect.objectContaining({
        simulationRunStatus: 'Complete',
        simulationComplete: true,
        simulationRunResultAnalysis: analysis,
        simulationRun: expect.objectContaining({
          id: 'pool-1',
          name: 'Test Pool',
          poolType: expect.objectContaining({
            name: 'LIVE',
          }),
        }),
      })
    );
  });
});
