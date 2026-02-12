import { describe, expect, it } from 'vitest';
import { FinancialMetricThresholds } from '../../../../models';
import { SimulationRunMetric } from '../../../simulationResults/simulationResultSummaryModels';
import {
  benchmarksDropdownOptions,
  getMax,
  getMetricByName,
  getMin,
  getThresholdColor,
  getThresholdPostscript,
  isInvertedGauge,
} from './utils';

const defaultThreshold: FinancialMetricThresholds = {
  key: 'Sharpe Ratio',
  veryLow: 0,
  veryLowColor: 'red',
  low: 1,
  lowColor: 'orange',
  medium: 2,
  mediumColor: 'yellow',
  high: 3,
  highColor: 'blue',
  tooltipDescription: 'desc',
};

const invertedThreshold: FinancialMetricThresholds = {
  key: 'Drawdown',
  veryLow: 5,
  veryLowColor: 'violet',
  low: 4,
  lowColor: 'indigo',
  medium: 3,
  mediumColor: 'teal',
  high: 1,
  highColor: 'cyan',
  tooltipDescription: 'desc',
};

const metric = (metricName: string): SimulationRunMetric =>
  ({ metricName }) as SimulationRunMetric;

describe('productDetail summary/utils view-model logic', () => {
  it('provides expected default benchmark dropdown options', () => {
    expect(benchmarksDropdownOptions.map((item) => item.label)).toEqual([
      'HODL',
      'BTC',
      'Momentum',
      'RF',
    ]);
  });

  it('computes max/min gauge bounds from configured thresholds', () => {
    const thresholds = [defaultThreshold, invertedThreshold];

    expect(getMax(thresholds, metric('Sharpe Ratio'))).toBeCloseTo(3.6, 10);
    expect(getMin(thresholds, metric('Sharpe Ratio'))).toBe(0);
    expect(getMax(thresholds, metric('Drawdown'))).toBe(6);
    expect(getMin(thresholds, metric('Drawdown'))).toBe(0.8);
  });

  it('detects inverted gauges when high is lower than veryLow', () => {
    expect(isInvertedGauge(defaultThreshold)).toBe(false);
    expect(isInvertedGauge(invertedThreshold)).toBe(true);
    expect(isInvertedGauge(undefined)).toBe(false);
  });

  it('maps metrics by the metric name selected through name array index', () => {
    const targetMetricsValues = [metric('Sortino'), metric('Sharpe Ratio')];
    const nameArray = [metric('Sortino'), metric('Sharpe Ratio')];

    expect(
      getMetricByName({
        nameArrayIndex: 1,
        targetMetricsValues,
        nameArray,
      })
    ).toEqual(metric('Sharpe Ratio'));

    expect(
      getMetricByName({
        nameArrayIndex: 0,
        targetMetricsValues: undefined,
        nameArray,
      })
    ).toBeUndefined();
  });

  it('derives color and postscript labels from threshold bands', () => {
    const thresholds = [defaultThreshold];

    expect(getThresholdColor(thresholds, 'Sharpe Ratio', -1)).toBe('red');
    expect(getThresholdColor(thresholds, 'Sharpe Ratio', 0.5)).toBe('orange');
    expect(getThresholdColor(thresholds, 'Sharpe Ratio', 1.5)).toBe('yellow');
    expect(getThresholdColor(thresholds, 'Sharpe Ratio', 2.5)).toBe('blue');
    expect(getThresholdColor(thresholds, 'Sharpe Ratio', 3.5)).toBe('green');
    expect(getThresholdColor(thresholds, 'Unknown', 3.5)).toBe('black');

    expect(getThresholdPostscript(thresholds, 'Sharpe Ratio', 0.5)).toBe(
      '(POOR)'
    );
    expect(getThresholdPostscript(thresholds, 'Sharpe Ratio', 1.5)).toBe(
      '(GOOD)'
    );
    expect(getThresholdPostscript(thresholds, 'Sharpe Ratio', 2.5)).toBe(
      '(VERY GOOD)'
    );
  });
});
