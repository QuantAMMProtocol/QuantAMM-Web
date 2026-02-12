import { describe, expect, it } from 'vitest';
import { INITIAL_PAGE, Product } from '../../models';
import {
  selectBenchmarkAnalysisByProductId,
  selectReturnAnalysisByProductId,
  selectTimeseriesAnalysisByProductId,
  setFilters,
  setProductSimulationRunBreakdown,
} from './productExplorerSlice';
import productExplorerReducer from './productExplorerSlice';
import { SimulationRunBreakdown } from '../simulationResults/simulationResultSummaryModels';

const createProduct = (
  id: string,
  simulationRunBreakdown?: SimulationRunBreakdown
): Product =>
  ({
    id,
    simulationRunBreakdown,
  }) as unknown as Product;

const createBreakdown = (): SimulationRunBreakdown =>
  ({
    simulationRunResultAnalysis: {
      return_analysis: [
        { metricName: 'Absolute Return (%)' },
        { metricName: 'Sharpe Ratio' },
      ],
      benchmark_analysis: [
        { metricName: 'Alpha', benchmarkName: 'BTC' },
        { metricName: 'Information Ratio', benchmarkName: '' },
        { metricName: 'Beta', benchmarkName: undefined },
      ],
      return_timeseries_analysis: [{ metricName: 'Sortino Ratio' }],
    },
  }) as unknown as SimulationRunBreakdown;

describe('productExplorerSlice view-model logic', () => {
  it('setFilters resets paging and product map while updating active filters', () => {
    const baseState = productExplorerReducer(undefined, { type: '@@INIT' });
    const seededState = {
      ...baseState,
      loadingProducts: false,
      page: 4,
      productMap: { p1: createProduct('p1') },
      activeFilters: { strategy: ['Momentum'] },
    };

    const nextState = productExplorerReducer(
      seededState,
      setFilters({
        filterCategory: 'strategy',
        filter: 'Anti-Momentum',
      })
    );

    expect(nextState.loadingProducts).toBe(true);
    expect(nextState.page).toBe(INITIAL_PAGE);
    expect(nextState.productMap).toEqual({});
    expect(nextState.activeFilters.strategy).toEqual([
      'Momentum',
      'Anti-Momentum',
    ]);
  });

  it('attaches a simulation breakdown for an existing product and clears its loading flag', () => {
    const baseState = productExplorerReducer(undefined, { type: '@@INIT' });
    const breakdown = createBreakdown();
    const seededState = {
      ...baseState,
      productMap: { p1: createProduct('p1') },
      loadingSimulationRunBreakdown: { p1: true },
    };

    const nextState = productExplorerReducer(
      seededState,
      setProductSimulationRunBreakdown({
        productId: 'p1',
        simulationRunBreakdown: breakdown,
      })
    );

    expect(nextState.productMap.p1.simulationRunBreakdown).toBe(breakdown);
    expect(nextState.loadingSimulationRunBreakdown.p1).toBe(false);
  });

  it('filters out Absolute Return in return-analysis selector', () => {
    const baseState = productExplorerReducer(undefined, { type: '@@INIT' });
    const state = {
      productExplorer: {
        ...baseState,
        productMap: { p1: createProduct('p1', createBreakdown()) },
      },
    } as any;

    const result = selectReturnAnalysisByProductId(state, 'p1');

    expect(result).toEqual([{ metricName: 'Sharpe Ratio' }]);
  });

  it('returns benchmark metrics by selected benchmark name and fallback benchmark metrics', () => {
    const baseState = productExplorerReducer(undefined, { type: '@@INIT' });
    const state = {
      productExplorer: {
        ...baseState,
        productMap: { p1: createProduct('p1', createBreakdown()) },
      },
    } as any;

    const selectedBenchmark = selectBenchmarkAnalysisByProductId(
      state,
      'p1',
      'BTC'
    );
    const fallbackBenchmark = selectBenchmarkAnalysisByProductId(
      state,
      'p1',
      null
    );

    expect(selectedBenchmark).toEqual([
      { metricName: 'Alpha', benchmarkName: 'BTC' },
    ]);
    expect(fallbackBenchmark).toEqual([
      { metricName: 'Information Ratio', benchmarkName: '' },
      { metricName: 'Beta', benchmarkName: undefined },
    ]);
  });

  it('adds derived metricKey values for time-series analysis', () => {
    const baseState = productExplorerReducer(undefined, { type: '@@INIT' });
    const state = {
      productExplorer: {
        ...baseState,
        productMap: { p1: createProduct('p1', createBreakdown()) },
      },
    } as any;

    const result = selectTimeseriesAnalysisByProductId(state, 'p1');

    expect(result).toEqual([
      {
        metricName: 'Sortino Ratio',
        metricKey: 'sortino_ratio',
      },
    ]);
  });
});
