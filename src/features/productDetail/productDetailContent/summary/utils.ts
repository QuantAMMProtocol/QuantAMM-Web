import { FinancialMetricThresholds } from '../../../../models';
import { SimulationRunMetric } from '../../../simulationResults/simulationResultSummaryModels';

export const benchmarksDropdownOptions = [
  { label: 'HODL', key: 1 },
  { label: 'BTC', key: 2 },
  { label: 'Momentum', key: 3 },
  { label: 'RF', key: 4 },
];

export function getMax(
  thresholds: FinancialMetricThresholds[],
  value?: SimulationRunMetric
): number {
  const target = thresholds.find((x) => x.key == value?.metricName);
  const result = Math.max(target?.high ?? 0, target?.veryLow ?? 0) * 1.2;
  return result;
}

export function getMin(
  thresholds: FinancialMetricThresholds[],
  value?: SimulationRunMetric
): number {
  const target = thresholds.find((x) => x.key == value?.metricName);
  const result = Math.min(target?.veryLow ?? 0, target?.high ?? 0) * 0.8;
  return result;
}

export function isInvertedGauge(
  thresholds?: FinancialMetricThresholds
): boolean {
  if (!thresholds) return false;

  return thresholds.high < thresholds.veryLow;
}

export function getMetricByName({
  nameArrayIndex,
  targetMetricsValues,
  nameArray,
}: {
  nameArrayIndex: number;
  targetMetricsValues?: SimulationRunMetric[] | null;
  nameArray?: SimulationRunMetric[] | null;
}): SimulationRunMetric | undefined {
  if (!targetMetricsValues || !nameArray) return undefined;

  return targetMetricsValues?.find(
    (x) => x.metricName == nameArray[nameArrayIndex]?.metricName
  );
}

export function getThresholdColor(
  thresholds: FinancialMetricThresholds[],
  metricName: string,
  value: number
): string {
  const threshold = thresholds.find((t) => t.key === metricName);

  if (!threshold) return 'black';
  if (value < threshold.veryLow) return threshold.veryLowColor;
  if (value < threshold.low) return threshold.lowColor;
  if (value < threshold.medium) return threshold.mediumColor;
  if (value < threshold.high) return threshold.highColor;

  return 'green';
}

export function getThresholdPostscript(
  thresholds: FinancialMetricThresholds[],
  metricName: string,
  value: number
): string {
  const threshold = thresholds.find((t) => t.key === metricName);

  if (!threshold || value < threshold.low) return '(POOR)';
  if (value < threshold.medium) return '(GOOD)';

  return '(VERY GOOD)';
}
