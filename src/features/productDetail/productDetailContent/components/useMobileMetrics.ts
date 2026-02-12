import { useEffect, useMemo, useState } from 'react';
import { getAnalysisSummary } from '../../../shared/tables/AnalysisBreakdownTableHelpers';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { norm } from '../utils';

/** Row shape from summary helper (subset used) */
export interface Row {
  metricName: string;
  metricValue: string | number | null;
  benchmark?: string;
  updateRule?: string;
}

export interface MetricBucket {
  metricName: string;
  items: { benchmark: string; value: string | number | null }[];
}

export interface MetricOption {
  label: string;
  value: string;
}

export function useAnalysisRows(
  simulationRunBreakdown?: SimulationRunBreakdown
) {
  return useMemo(
    () =>
      simulationRunBreakdown
        ? (getAnalysisSummary([simulationRunBreakdown]) as Row[])
        : [],
    [simulationRunBreakdown]
  );
}

export function useBucketsAll(rows: Row[]) {
  return useMemo(() => {
    if (!rows.length) return [];

    const map = new Map<
      string,
      { benchmark: string; value: string | number | null }[]
    >();

    for (const r of rows) {
      const metric = (r.metricName ?? '').toString().trim();
      if (!metric) continue;

      const nMetric = norm(metric);
      if (nMetric.includes('absolute return')) continue;

      const benchmarkLabelRaw =
        (r.benchmark && String(r.benchmark)) ??
        (r.updateRule && String(r.updateRule)) ??
        '—';

      const benchKey = benchmarkLabelRaw.trim().toLowerCase();
      if (benchKey === 'benchmark_return_analysis') continue;

      const list = map.get(metric) ?? [];
      list.push({ benchmark: benchmarkLabelRaw, value: r.metricValue ?? null });
      map.set(metric, list);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([metricName, items]) => ({
        metricName,
        items: items.sort((a, b) => a.benchmark.localeCompare(b.benchmark)),
      }));
  }, [rows]);
}

export function useMetricOptions(bucketsAll: MetricBucket[]): MetricOption[] {
  return useMemo(
    () => bucketsAll.map((b) => ({ label: b.metricName, value: b.metricName })),
    [bucketsAll]
  );
}

export function useDefaultAlpha(metricOptions: MetricOption[]) {
  return useMemo(() => {
    const target = metricOptions.find((opt) => {
      const n = norm(opt.label);
      return n.includes('jensen') && n.includes('alpha');
    });
    return target
      ? [target.value]
      : metricOptions[0]
        ? [metricOptions[0].value]
        : [];
  }, [metricOptions]);
}

export function useSelectedMetrics(defaultAlpha: string[]) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedMetrics.length && defaultAlpha.length) {
      setSelectedMetrics(defaultAlpha);
    }
  }, [defaultAlpha, selectedMetrics.length]);

  return [selectedMetrics, setSelectedMetrics] as const;
}

export function useBucketsSelected(
  bucketsAll: MetricBucket[],
  selectedMetrics: string[]
) {
  return useMemo(() => {
    if (!selectedMetrics.length) return [];
    const selectedSet = new Set(selectedMetrics);
    return bucketsAll.filter((b) => selectedSet.has(b.metricName));
  }, [bucketsAll, selectedMetrics]);
}
