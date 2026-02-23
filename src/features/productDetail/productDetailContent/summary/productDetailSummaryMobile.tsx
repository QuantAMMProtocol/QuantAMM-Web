// productDetailSummaryMobile.tsx
import { useMemo, useState } from 'react';
import { Card, Collapse, Divider, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { GqlChain } from '../../../../__generated__/graphql-types';
import { FinancialMetricThresholds, Product } from '../../../../models';
import { SimulationRunMetric } from '../../../simulationResults/simulationResultSummaryModels';
import {
  ProductTokenWeightChangeOverTimeGraph,
  ReturnDistributionGraph,
} from '../../../shared/graphs';
import { ComparableProductSelector } from '../comparableProduct/comparableProductSelector';
import { ProductDetailEvents } from '../events/productDetailEvents';
import { ProductDetailSidebarStrategySummary } from '../../productDetailSidebar/productDetailSidebarStrategySummary';
import { getThresholdColor, getThresholdPostscript } from './utils';

const { Text } = Typography;
const WEIGHT_CHART_Y_AXIS_OVERRIDE = { label: { enabled: false } };
const LEGEND_DISABLED_OVERRIDE = { enabled: false };
const RETURN_DISTRIBUTION_Y_AXIS_OVERRIDE = { title: { enabled: false } };
const SHOW_COMPARE_PRODUCT_PANEL = false;

interface ProductDetailSummaryMobileProps {
  product: Product;
  loadingSimulationRunBreakdown: boolean;
  loadingOtherProductSimulationRunBreakdown: boolean;
  returnAnalysisDropdownOptions: { label: string; key: number }[]; // kept for props compatibility
  returnAnalysisThresholds: FinancialMetricThresholds[];
  benchmarkReturnAnalysisDropdownOptions: { label: string; key: number }[]; // kept for props compatibility
  benchmarkReturnAnalysisThresholds: FinancialMetricThresholds[];
  selectedReturnAnalysis: SimulationRunMetric | undefined;
  selectedBenchmarkReturnAnalysis: SimulationRunMetric | undefined;
  comparingProduct?: Product;
  comparingProductLoading: boolean;
  comparingProductReturnAnalysis?: SimulationRunMetric[] | null;
  comparingProductBenchmarkAnalysis?: SimulationRunMetric[] | null;
}

/* --------------------------- Helpers (UI + formatting) --------------------------- */

// A tiny color util to add alpha to hex/rgb strings. Falls back softly if unknown.
function withAlpha(color: string, alpha: number) {
  if (!color) return `rgba(255,255,255,${alpha * 0.06})`;
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const bigint = parseInt(
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex.slice(0, 6),
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (color.startsWith('rgb')) {
    const nums = color.match(/\d+(\.\d+)?/g) ?? ['0', '0', '0'];
    const [r, g, b] = nums.map(Number);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // named colors → let browser parse via a temp element
  const el = document.createElement('canvas').getContext('2d');
  if (el) {
    el.fillStyle = color as any;
    const parsed = typeof el.fillStyle === 'string' ? el.fillStyle : '';
    if (parsed.startsWith('#')) return withAlpha(parsed, alpha);
  }

  return `rgba(255,255,255,${alpha * 0.06})`;
}

// Title tooltip copy for common metrics; fallback if not found.
const METRIC_DESCRIPTIONS: Record<string, string> = {
  'Annualized Sharpe Ratio':
    'Risk-adjusted return. Higher is better. Annualizes the Sharpe ratio based on simulated returns.',
  'Annualized Jensen’s Alpha (%)':
    'Excess return over the expected return predicted by CAPM. Annualized; positive is better.',
};

// Render a single labeled row (name on left, coloured value card on right)
function ValueRow({
  label,
  value,
  gradeColor,
  gradeText,
}: {
  label: string;
  value: number | string | undefined | null;
  gradeColor: string;
  gradeText: string; // e.g., "(VERY GOOD)"
}) {
  const safeNum =
    typeof value === 'number' ? value : value == null ? NaN : Number(value);

  const display = Number.isFinite(safeNum) ? safeNum.toFixed(2) : 'N/A';

  // Strip wrapping parens and title-case a bit for the tooltip
  const gradeClean = gradeText.replace(/[()]/g, '').trim();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '8px 2px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Text strong style={{ fontSize: 15, overflowWrap: 'anywhere' }}>
        {label}
      </Text>

      <Tooltip title={gradeClean}>
        <Card
          size="small"
          bordered
          style={{
            minWidth: 92,
            borderRadius: 12,
            borderColor: gradeColor,
            background: withAlpha(gradeColor, 0.15),
            paddingInline: 8,
          }}
          bodyStyle={{
            padding: '6px 10px',
            textAlign: 'right' as const,
          }}
        >
          <Text strong style={{ color: gradeColor, fontSize: 14 }}>
            {display}
          </Text>
        </Card>
      </Tooltip>
    </div>
  );
}

// Compact metric header with tooltip + info icon
function MetricHeader({ name }: { name: string }) {
  const desc =
    METRIC_DESCRIPTIONS[name] || 'Metric computed from simulation results.';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Tooltip title={desc}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Text strong style={{ fontSize: 16 }}>
            {name}
          </Text>
          <InfoCircleOutlined style={{ fontSize: 14, opacity: 0.8 }} />
        </span>
      </Tooltip>
    </div>
  );
}

export const ProductDetailSummaryMobile = ({
  product,
  returnAnalysisThresholds,
  benchmarkReturnAnalysisThresholds,
  selectedReturnAnalysis,
  selectedBenchmarkReturnAnalysis,
  comparingProduct,
  comparingProductLoading,
  comparingProductReturnAnalysis,
  comparingProductBenchmarkAnalysis,
}: ProductDetailSummaryMobileProps) => {
  const [isCompareProductOpen, setIsCompareProductOpen] = useState(true);

  const handleSelectComparableProduct = () => {
    setIsCompareProductOpen(false);
  };

  // Resolve the active labels from provided selection (parent determines the two metrics)
  const currentReturnAnalysisLabel = useMemo(
    () => selectedReturnAnalysis?.metricName ?? 'Annualized Sharpe Ratio',
    [selectedReturnAnalysis]
  );

  const currentBenchmarkAnalysisLabel = useMemo(
    () =>
      selectedBenchmarkReturnAnalysis?.metricName ??
      'Annualized Jensen’s Alpha (%)',
    [selectedBenchmarkReturnAnalysis]
  );
  const productMarketValues = useMemo(
    () => product.timeSeries?.map((x) => x.sharePrice) ?? [],
    [product.timeSeries]
  );
  const benchmarkMarketValues = useMemo(
    () => product.timeSeries?.map((x) => x.hodlSharePrice) ?? [],
    [product.timeSeries]
  );
  const comparingProductMarketValues = useMemo(
    () => comparingProduct?.timeSeries?.map((x) => x.sharePrice) ?? [],
    [comparingProduct?.timeSeries]
  );

  // Colors + grade text for the three entities per card
  const repr = (
    thresholds: FinancialMetricThresholds[],
    metricName: string,
    v: number
  ) => ({
    color: getThresholdColor(thresholds, metricName, v),
    grade: getThresholdPostscript(thresholds, metricName, v), // "(VERY GOOD)" etc.
  });

  const compareProductPanel = SHOW_COMPARE_PRODUCT_PANEL ? (
    <div style={{ width: '95%' }}>
      <Collapse
        items={[
          {
            key: '1',
            label: 'Compare Product',
            children: (
              <ComparableProductSelector
                onSelect={handleSelectComparableProduct}
                comparingProductLoading={comparingProductLoading}
              />
            ),
          },
        ]}
        onChange={() => setIsCompareProductOpen((prev) => !prev)}
        defaultActiveKey={['1']}
        activeKey={isCompareProductOpen ? ['1'] : []}
      />
    </div>
  ) : null;

  const poolWeightCard = (
    <div style={{ width: '95%', marginTop: 12 }}>
      <Card title="Pool token weight over time [%]">
        <div>
          <Text strong>{product.name}</Text>
          <div style={{ height: '100%', width: '100%' }}>
            <ProductTokenWeightChangeOverTimeGraph
              product={product}
              yAxisOverride={WEIGHT_CHART_Y_AXIS_OVERRIDE}
              legendOverride={LEGEND_DISABLED_OVERRIDE}
            />
          </div>
          <Text strong>{product.name}</Text>
          <div style={{ height: '100%', width: '100%' }}>
            <ProductTokenWeightChangeOverTimeGraph
              product={product}
              isBenchmark={true}
              yAxisOverride={WEIGHT_CHART_Y_AXIS_OVERRIDE}
              legendOverride={LEGEND_DISABLED_OVERRIDE}
            />
          </div>
          {comparingProduct && (
            <div>
              <Text strong>{comparingProduct?.name}</Text>
              <div style={{ height: '100%', width: '100%' }}>
                <ProductTokenWeightChangeOverTimeGraph
                  product={comparingProduct}
                  yAxisOverride={WEIGHT_CHART_Y_AXIS_OVERRIDE}
                  legendOverride={LEGEND_DISABLED_OVERRIDE}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const returnDistributionCard = (
    <div id="distribution" style={{ width: '95%' }}>
      <Card title="Return distribution">
        <div>
          <Text strong>{product.name}</Text>
          <div style={{ height: '100%', width: '100%' }}>
            {(product.timeSeries?.length ?? 0) > 0 && (
              <ReturnDistributionGraph
                marketValues={productMarketValues}
                yAxisOverride={RETURN_DISTRIBUTION_Y_AXIS_OVERRIDE}
              />
            )}
          </div>

          <Text strong>
            {selectedBenchmarkReturnAnalysis?.metricName ??
              'No benchmark selected'}
          </Text>
          <div style={{ height: '100%', width: '100%' }}>
            {(product.timeSeries?.length ?? 0) > 0 && (
              <ReturnDistributionGraph
                marketValues={benchmarkMarketValues}
                yAxisOverride={RETURN_DISTRIBUTION_Y_AXIS_OVERRIDE}
              />
            )}
          </div>

          {comparingProduct && (
            <div>
              <Text strong>{comparingProduct?.name}</Text>
              <div style={{ height: '100%', width: '100%' }}>
                {(comparingProduct?.timeSeries?.length ?? 0) > 0 && (
                  <ReturnDistributionGraph
                    marketValues={comparingProductMarketValues}
                    yAxisOverride={RETURN_DISTRIBUTION_Y_AXIS_OVERRIDE}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      {/* Hidden because currently live analytics is turned off, comparing factsheet with live is not great */}
      {compareProductPanel}
      {poolWeightCard}
      <div style={{ width: '95%' }}>
        <ProductDetailSidebarStrategySummary product={product} />
      </div>
      <div id="metrics">
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            marginTop: 12,
            overflow: 'hidden',
          }}
          bordered={false}
          title={<MetricHeader name={currentReturnAnalysisLabel} />}
        >
          <div style={{ padding: '4px 4px 0' }}>
            {/* Product */}
            <ValueRow
              label={product.name}
              value={selectedReturnAnalysis?.metricValue ?? 0}
              gradeColor={
                repr(
                  returnAnalysisThresholds,
                  currentReturnAnalysisLabel,
                  selectedBenchmarkReturnAnalysis?.metricValue ?? 0
                ).color
              }
              gradeText={
                repr(
                  returnAnalysisThresholds,
                  currentReturnAnalysisLabel,
                  selectedBenchmarkReturnAnalysis?.metricValue ?? 0
                ).grade
              }
            />

            {/* HODL */}
            <ValueRow
              label="HODL"
              value={selectedBenchmarkReturnAnalysis?.metricValue ?? 0}
              gradeColor={
                repr(
                  returnAnalysisThresholds,
                  currentReturnAnalysisLabel,
                  selectedReturnAnalysis?.metricValue ?? 0
                ).color
              }
              gradeText={
                repr(
                  returnAnalysisThresholds,
                  currentReturnAnalysisLabel,
                  selectedReturnAnalysis?.metricValue ?? 0
                ).grade
              }
            />

            {/* Comparing product (optional) */}
            {comparingProduct && (
              <ValueRow
                label={comparingProduct.name}
                value={
                  comparingProductReturnAnalysis?.find(
                    (x) => x.metricName == selectedReturnAnalysis?.metricName
                  )?.metricValue ?? 0
                }
                gradeColor={
                  repr(
                    returnAnalysisThresholds,
                    currentReturnAnalysisLabel,
                    comparingProductReturnAnalysis?.find(
                      (x) => x.metricName == selectedReturnAnalysis?.metricName
                    )?.metricValue ?? 0
                  ).color
                }
                gradeText={
                  repr(
                    returnAnalysisThresholds,
                    currentReturnAnalysisLabel,
                    comparingProductReturnAnalysis?.find(
                      (x) => x.metricName == selectedReturnAnalysis?.metricName
                    )?.metricValue ?? 0
                  ).grade
                }
              />
            )}
          </div>
        </Card>
      </div>
      <Divider />
      <Card
        style={{
          borderRadius: 16,
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
        bordered={false}
        title={<MetricHeader name={currentBenchmarkAnalysisLabel} />}
      >
        <div style={{ padding: '4px 4px 0' }}>
          {/* Product */}
          <ValueRow
            label={product.name}
            value={selectedBenchmarkReturnAnalysis?.metricValue ?? 0}
            gradeColor={
              repr(
                benchmarkReturnAnalysisThresholds,
                currentBenchmarkAnalysisLabel,
                selectedBenchmarkReturnAnalysis?.metricValue ?? 0
              ).color
            }
            gradeText={
              repr(
                benchmarkReturnAnalysisThresholds,
                currentBenchmarkAnalysisLabel,
                selectedBenchmarkReturnAnalysis?.metricValue ?? 0
              ).grade
            }
          />

          {/* HODL (explicit N/A in original) */}
          <ValueRow
            label="HODL"
            value={null}
            gradeColor="rgba(255,255,255,0.5)"
            gradeText="Not applicable"
          />

          {/* Comparing product (optional) */}
          {comparingProduct && (
            <ValueRow
              label={comparingProduct.name}
              value={
                comparingProductBenchmarkAnalysis?.find(
                  (x) =>
                    x.metricName == selectedBenchmarkReturnAnalysis?.metricName
                )?.metricValue ?? 0
              }
              gradeColor={
                repr(
                  benchmarkReturnAnalysisThresholds,
                  currentBenchmarkAnalysisLabel,
                  comparingProductBenchmarkAnalysis?.find(
                    (x) =>
                      x.metricName ==
                      selectedBenchmarkReturnAnalysis?.metricName
                  )?.metricValue ?? 0
                ).color
              }
              gradeText={
                repr(
                  benchmarkReturnAnalysisThresholds,
                  currentBenchmarkAnalysisLabel,
                  comparingProductBenchmarkAnalysis?.find(
                    (x) =>
                      x.metricName ==
                      selectedBenchmarkReturnAnalysis?.metricName
                  )?.metricValue ?? 0
                ).grade
              }
            />
          )}
        </div>
      </Card>
      <Divider />
      <div style={{ width: '95%' }}>
        <ProductDetailEvents
          productId={product.id}
          chain={product.chain as GqlChain}
          isMobile
        />
      </div>
      <Divider />
      {returnDistributionCard}
    </div>
  );
};
