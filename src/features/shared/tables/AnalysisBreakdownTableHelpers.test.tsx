import { describe, expect, it } from 'vitest';
import { getAnalysisSummary } from './AnalysisBreakdownTableHelpers';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';

const createBreakdown = (
  status: string,
  updateRuleName: string
): SimulationRunBreakdown =>
  ({
    simulationRunStatus: status,
    simulationRun: {
      updateRule: {
        updateRuleName,
        updateRuleParameters: [
          {
            factorName: 'k',
            factorValue: '2',
          },
        ],
      },
    },
    timeRange: {
      name: '1m',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
    },
    simulationRunResultAnalysis: {
      return_analysis: [
        { metricName: 'Sharpe', metricValue: 1.2, Rf: '0.01' },
        { metricName: 'Invalid', metricValue: Number.NaN, Rf: '0.01' },
      ],
      benchmark_analysis: [
        {
          metricName: 'Alpha',
          metricValue: 0.5,
          benchmarkName: 'BTC',
          Rf: '0.01',
        },
        {
          metricName: 'Self',
          metricValue: 0.7,
          benchmarkName: updateRuleName,
          Rf: '0.01',
        },
      ],
    },
  }) as unknown as SimulationRunBreakdown;

describe('AnalysisBreakdownTableHelpers view-model logic', () => {
  it('flattens completed run analyses and filters invalid/self benchmarks', () => {
    const completed = createBreakdown('Complete', 'Momentum');
    const running = createBreakdown('Running', 'Momentum');

    const result = getAnalysisSummary([completed, running]);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      updateRule: 'Momentum',
      parameters: '[k:2] ',
      timePeriodName: '1m',
      benchmark: 'N/A',
      metricName: 'Sharpe',
      metricValue: 1.2,
    });
    expect(result[1]).toMatchObject({
      updateRule: 'Momentum',
      benchmark: 'BTC',
      metricName: 'Alpha',
      metricValue: 0.5,
    });
  });
});
