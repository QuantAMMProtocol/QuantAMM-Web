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
  return (thresholds.find((x) => x.key == value?.metricName)?.high ?? 0) * 1.2;
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
