import { FC, useEffect, useMemo, useState } from 'react';
import { Card, Collapse, Descriptions, Divider, Empty, Tag, Typography, Select } from 'antd';
import { AnalysisBreakdownTable } from '../../../shared/tables';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { getAnalysisSummary } from '../../../shared/tables/AnalysisBreakdownTableHelpers';

const { Title, Text } = Typography;

interface ProductDetailTableProps {
  simulationRunBreakdown?: SimulationRunBreakdown;
  productId?: string;
  /** When true, renders the minimalist, mobile-friendly view */
  isMobile?: boolean;
}

/** Row shape provided by your summary helper (subset we care about) */
type Row = {
  metricName: string;
  metricValue: string | number | null;
  benchmark?: string;
  updateRule?: string;
};

type MetricBucket = {
  metricName: string;
  items: Array<{ benchmark: string; value: string | number | null }>;
};

/** -------- helpers -------- */
function toTwoDecimals(v: unknown): string {
  if (v == null) return '—';
  const num = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(num)) return String(v);
  return num.toFixed(2);
}

function norm(s: string): string {
  // lower, remove smart quotes & punctuation noise, collapse spaces
  return s
    .toLowerCase()
    .replace(/[’'‘`"]/g, "'")
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const ProductDetailTable: FC<ProductDetailTableProps> = ({
  simulationRunBreakdown,
  productId,
  isMobile,
}) => {
  /** 1) Build the exact same rows the desktop grid uses (no guessing) */
  const rows: Row[] = useMemo(
    () =>
      simulationRunBreakdown
        ? (getAnalysisSummary([simulationRunBreakdown]) as Row[])
        : [],
    [simulationRunBreakdown]
  );

  /** 2) Build buckets for the mobile view with required filters */
  const bucketsAll: MetricBucket[] = useMemo(() => {
    if (!rows.length) return [];

    const map = new Map<string, Array<{ benchmark: string; value: string | number | null }>>();

    for (const r of rows) {
      const metric = (r.metricName ?? '').toString().trim();
      if (!metric) continue;

      // Filter out "Absolute Return" metrics (e.g., "Absolute Return (%)")
      const nMetric = norm(metric);
      if (nMetric.includes('absolute return')) continue;

      const benchmarkLabelRaw =
        (r.benchmark && String(r.benchmark)) ||
        (r.updateRule && String(r.updateRule)) ||
        '—';

      const benchKey = benchmarkLabelRaw.trim().toLowerCase();

      // Filter out internal benchmark rows
      if (benchKey === 'benchmark_return_analysis') continue;

      const list = map.get(metric) ?? [];
      list.push({ benchmark: benchmarkLabelRaw, value: r.metricValue ?? null });
      map.set(metric, list);
    }

    // Sort metrics asc, then benchmarks asc
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([metricName, items]) => ({
        metricName,
        items: items.sort((a, b) => a.benchmark.localeCompare(b.benchmark)),
      }));
  }, [rows]);

  /** 3) Multi-select options from available metrics */
  const metricOptions = useMemo(
    () => bucketsAll.map((b) => ({ label: b.metricName, value: b.metricName })),
    [bucketsAll]
  );

  /** 4) Default selected = "Annualized Jensen’s Alpha" (robust to punctuation/locale). */
  const defaultAlpha = useMemo(() => {
    const target = metricOptions.find((opt) => {
      const n = norm(opt.label);
      return n.includes('jensen') && n.includes('alpha');
    });
    return target ? [target.value] : (metricOptions[0] ? [metricOptions[0].value] : []);
  }, [metricOptions]);

  /** 5) Selected metrics state (hooks are unconditional) */
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  // Initialize selection once we have options
  useEffect(() => {
    if (!selectedMetrics.length && defaultAlpha.length) {
      setSelectedMetrics(defaultAlpha);
    }
  }, [defaultAlpha, selectedMetrics.length]);

  /** 6) Apply selection filter to buckets (mobile view uses this) */
  const bucketsSelected = useMemo(() => {
    if (!selectedMetrics.length) return [];
    const selectedSet = new Set(selectedMetrics);
    return bucketsAll.filter((b) => selectedSet.has(b.metricName));
  }, [bucketsAll, selectedMetrics]);

  /** 7) Desktop render (unchanged) */
  if (!isMobile) {
    return simulationRunBreakdown ? (
      <AnalysisBreakdownTable
        simulationRunBreakdowns={[simulationRunBreakdown]}
        productId={productId}
      />
    ) : null;
  }

  /** 8) Mobile render */
  return (
    <Card
      bordered={false}
      style={{
        background: 'var(--panel-bg, rgba(255,255,255,0.02))',
        borderRadius: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <Title
          level={4}
          style={{
            margin: 0,
            color: 'var(--secondary-text-color, #d9d9d9)',
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          Analysis Breakdown
        </Title>
        {!!productId && (
          <Tag color="default" style={{ borderRadius: 999 }}>
            {String(productId).slice(0, 6)}…{String(productId).slice(-4)}
          </Tag>
        )}
      </div>

      <Text type="secondary" style={{ display: 'block' }}>
        Select metrics to display. Tap a metric to view benchmarks.
      </Text>

      {/* Multi-select for metrics */}
      <div style={{ marginTop: 12, marginBottom: 8 }}>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Choose metrics"
          options={metricOptions}
          value={selectedMetrics}
          onChange={(vals) => setSelectedMetrics(vals)}
          maxTagCount="responsive"
          size="middle"
        />
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {!bucketsSelected.length ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No metrics selected" />
      ) : (
        <Collapse
          bordered={false}
          style={{ background: 'transparent' }}
          items={bucketsSelected.map((bucket) => ({
            key: bucket.metricName,
            label: (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Text strong style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {bucket.metricName}
                </Text>
                <Tag>{bucket.items.length}</Tag>
              </div>
            ),
            children: (
              <div style={{ display: 'grid', gap: 8 }}>
                {bucket.items.map(({ benchmark, value }, i) => {
                  const isNA =
                    typeof benchmark === 'string' &&
                    benchmark.trim().toLowerCase() === 'n/a';

                  return (
                    <Card
                      key={`${bucket.metricName}::${benchmark}::${i}`}
                      size="small"
                      bordered
                      style={{ borderRadius: 12 }}
                      bodyStyle={{ padding: 12 }}
                    >
                      <Descriptions
                        size="small"
                        column={1}
                        colon={false}
                        labelStyle={{ width: 160, color: 'var(--muted, #9aa0a6)' }}
                        contentStyle={{ justifyContent: 'flex-end', textAlign: 'right' }}
                      >
                        {/* Hide the Benchmark row when benchmark is N/A */}
                        {!isNA && (
                          <Descriptions.Item label="Benchmark">
                            <Text style={{ fontWeight: 500 }}>{benchmark}</Text>
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Value">
                          <Text style={{ fontWeight: 600 }}>{toTwoDecimals(value)}</Text>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  );
                })}
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
};
