import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  Collapse,
  Divider,
  Progress,
  Row,
  Col,
  Segmented,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

import {
  InfoCircleOutlined,
  WarningOutlined,
  TableOutlined,
  BoxPlotOutlined,
} from '@ant-design/icons';
import { GqlChain } from '../../../../__generated__/graphql-types';

import { FinancialMetricThresholds, Product } from '../../../../models';
import {
  ReturnDistributionGraph,
  ProductTokenWeightChangeOverTimeGraph,
} from '../../../shared/graphs';
import { SimulationRunMetric } from '../../../simulationResults/simulationResultSummaryModels';
import { ProductDetailDropdown } from '../components/productDetailDropdown';
import { ProductDetailEvents } from '../events/productDetailEvents';
import { ProductDetailSidebarStrategySummary } from '../../productDetailSidebar/productDetailSidebarStrategySummary';

import { CURRENT_LIVE_FACTSHEETS } from '../../../documentation/factSheets/liveFactsheets';

import styles from './productDetailSummary.module.scss';
import { getMax, getMin } from './utils';
import { StrategyWorkflowCard } from './strategyWorkflowCard';
import { AnalysisSimplifiedBreakdownTable } from '../../../simulationResults/breakdowns/simulationRunPerformanceSimpleTable';

const { Text } = Typography;
const { Panel } = Collapse;
const METRICS_PANEL_KEY = 'metrics';
const WEIGHT_CHART_Y_AXIS_OVERRIDE = { label: { enabled: false } };
const RETURN_DISTRIBUTION_Y_AXIS_OVERRIDE = { title: { enabled: false } };
const SHOW_STRATEGY_WORKFLOW_SECTION = false;

interface ProductDetailSummaryDesktopProps {
  product: Product;
  loadingSimulationRunBreakdown: boolean;
  loadingOtherProductSimulationRunBreakdown: boolean;

  returnAnalysisDropdownOptions: { label: string; key: number }[];
  returnAnalysisThresholds: FinancialMetricThresholds[];
  returnAnalysis?: SimulationRunMetric[] | null;

  benchmarkReturnAnalysisDropdownOptions: { label: string; key: number }[];
  benchmarkReturnAnalysisThresholds: FinancialMetricThresholds[];
  benchmarkReturnAnalysis?: SimulationRunMetric[] | null;

  benchmarkAnalysis?: SimulationRunMetric[] | null;
  selectedReturnAnalysis?: SimulationRunMetric;
  selectedBenchmarkReturnAnalysis?: SimulationRunMetric;
}

/* -------------------------- helpers -------------------------- */

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function format2(v?: number | null) {
  if (!isFiniteNumber(v)) return '—';
  return v.toFixed(2);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function MetricProgress({
  label,
  value,
  thresholds,
  allThresholds,
  helpText,
}: {
  label: string;
  value?: number | null;
  thresholds?: FinancialMetricThresholds;
  allThresholds: FinancialMetricThresholds[];
  helpText?: string;
}) {
  const min = getMin(allThresholds, { metricName: thresholds?.key } as any);
  const max = getMax(allThresholds, { metricName: thresholds?.key } as any);

  const pct =
    isFiniteNumber(value) &&
    isFiniteNumber(min) &&
    isFiniteNumber(max) &&
    max !== min
      ? clamp(((value - min) / (max - min)) * 100, 0, 100)
      : 0;

  return (
    <div className={styles['product-detail-summary__metric']}>
      <div className={styles['product-detail-summary__metricHeader']}>
        <Text strong>{label}</Text>
        {helpText ? (
          <Tooltip title={helpText}>
            <InfoCircleOutlined />
          </Tooltip>
        ) : null}
      </div>

      <Progress percent={pct} showInfo={false} />

      <div className={styles['product-detail-summary__metricQual']}>
        <Text type="secondary">poor</Text>
        <Text type="secondary">good</Text>
        <Text type="secondary">very good</Text>
      </div>
    </div>
  );
}

export const ProductDetailSummaryDesktop: FC<
  ProductDetailSummaryDesktopProps
> = ({
  product,
  loadingSimulationRunBreakdown,
  loadingOtherProductSimulationRunBreakdown,
  returnAnalysisDropdownOptions,
  returnAnalysisThresholds,
  returnAnalysis,
  benchmarkReturnAnalysisDropdownOptions,
  benchmarkReturnAnalysisThresholds,
  benchmarkReturnAnalysis,
  benchmarkAnalysis,
  selectedReturnAnalysis: initialSelectedReturnAnalysis,
  selectedBenchmarkReturnAnalysis: initialSelectedBenchmarkReturnAnalysis,
}) => {
  const isLoading =
    loadingSimulationRunBreakdown || loadingOtherProductSimulationRunBreakdown;

  const [weightsView, setWeightsView] = useState<'product' | 'benchmark'>(
    'product'
  );
  const [returnsView, setReturnsView] = useState<'product' | 'benchmark'>(
    'product'
  );

  const [metricsView, setMetricsView] = useState<'gauge' | 'table'>('gauge');
  const [isMetricsPanelOpen, setIsMetricsPanelOpen] = useState(true);
  const [selectedReturnMetricName, setSelectedReturnMetricName] = useState<
    string | undefined
  >(initialSelectedReturnAnalysis?.metricName);
  const [selectedBenchmarkMetricName, setSelectedBenchmarkMetricName] =
    useState<string | undefined>(
      initialSelectedBenchmarkReturnAnalysis?.metricName
    );

  const ts = useMemo(() => product?.timeSeries ?? [], [product?.timeSeries]);

  useEffect(() => {
    if (
      selectedReturnMetricName &&
      !returnAnalysisDropdownOptions.some(
        (option) => option.label === selectedReturnMetricName
      )
    ) {
      setSelectedReturnMetricName(returnAnalysisDropdownOptions[0]?.label);
      return;
    }

    if (!selectedReturnMetricName && returnAnalysisDropdownOptions.length > 0) {
      setSelectedReturnMetricName(returnAnalysisDropdownOptions[0].label);
    }
  }, [selectedReturnMetricName, returnAnalysisDropdownOptions]);

  useEffect(() => {
    if (
      selectedBenchmarkMetricName &&
      !benchmarkReturnAnalysisDropdownOptions.some(
        (option) => option.label === selectedBenchmarkMetricName
      )
    ) {
      setSelectedBenchmarkMetricName(
        benchmarkReturnAnalysisDropdownOptions[0]?.label
      );
      return;
    }

    if (
      !selectedBenchmarkMetricName &&
      benchmarkReturnAnalysisDropdownOptions.length > 0
    ) {
      setSelectedBenchmarkMetricName(
        benchmarkReturnAnalysisDropdownOptions[0].label
      );
    }
  }, [selectedBenchmarkMetricName, benchmarkReturnAnalysisDropdownOptions]);

  const selectedReturnAnalysis = useMemo(
    () =>
      returnAnalysis?.find((x) => x.metricName === selectedReturnMetricName) ??
      initialSelectedReturnAnalysis,
    [returnAnalysis, selectedReturnMetricName, initialSelectedReturnAnalysis]
  );

  const selectedBenchmarkReturnAnalysis = useMemo(
    () =>
      benchmarkReturnAnalysis?.find(
        (x) => x.metricName === selectedBenchmarkMetricName
      ) ?? initialSelectedBenchmarkReturnAnalysis,
    [
      benchmarkReturnAnalysis,
      selectedBenchmarkMetricName,
      initialSelectedBenchmarkReturnAnalysis,
    ]
  );

  const factsheet = useMemo(() => {
    const anyP = product as any;
    const poolId = anyP?.poolId ?? anyP?.id ?? anyP?.pool?.id;
    const name = String(anyP?.name ?? '').toLowerCase();

    const byPoolId = CURRENT_LIVE_FACTSHEETS.factsheets.find((f: any) => {
      const fId = String(f?.poolId ?? '').toLowerCase();
      const pId = String(poolId ?? '').toLowerCase();
      return fId && pId && fId === pId;
    });
    if (byPoolId) return byPoolId;

    return CURRENT_LIVE_FACTSHEETS.factsheets.find((f: any) => {
      const prefix = String(f?.poolPrefix ?? '').toLowerCase();
      return prefix && name.includes(prefix);
    });
  }, [product]);

  const selectedReturnThreshold = useMemo(
    () =>
      returnAnalysisThresholds?.find(
        (x) => x.key == selectedReturnAnalysis?.metricName
      ),
    [returnAnalysisThresholds, selectedReturnAnalysis?.metricName]
  );

  const selectedBenchmarkRelThreshold = useMemo(
    () =>
      benchmarkReturnAnalysisThresholds?.find(
        (x) => x.key == selectedBenchmarkReturnAnalysis?.metricName
      ),
    [
      benchmarkReturnAnalysisThresholds,
      selectedBenchmarkReturnAnalysis?.metricName,
    ]
  );

  const benchmarkMetricForSelectedReturn = useMemo(
    () =>
      benchmarkAnalysis?.find(
        (x) => x.metricName == selectedReturnAnalysis?.metricName
      ) ?? undefined,
    [benchmarkAnalysis, selectedReturnAnalysis?.metricName]
  );

  const productReturnValue = selectedReturnAnalysis?.metricValue;
  const benchmarkReturnValue = benchmarkMetricForSelectedReturn?.metricValue;

  const deltaAbs =
    isFiniteNumber(productReturnValue) && isFiniteNumber(benchmarkReturnValue)
      ? productReturnValue - benchmarkReturnValue
      : null;

  const deltaTag = useMemo(() => {
    if (!isFiniteNumber(deltaAbs)) return <Tag>—</Tag>;
    const positive = deltaAbs >= 0;
    return (
      <Tag
        color={positive ? 'green' : 'red'}
      >{`${positive ? '+' : ''}${deltaAbs.toFixed(2)}`}</Tag>
    );
  }, [deltaAbs]);

  const marketValuesProduct = useMemo(
    () => ts.map((x) => x.sharePrice).filter(isFiniteNumber),
    [ts]
  );
  const marketValuesBenchmark = useMemo(
    () => ts.map((x) => x.hodlSharePrice).filter(isFiniteNumber),
    [ts]
  );

  const simulationRunBreakdown = useMemo(
    () => product?.simulationRunBreakdown,
    [product?.simulationRunBreakdown]
  );

  const visibleMetrics = useMemo(() => {
    const returnAnalysis =
      simulationRunBreakdown?.simulationRunResultAnalysis?.return_analysis ??
      [];
    const benchmarkAnalysisArr =
      simulationRunBreakdown?.simulationRunResultAnalysis?.benchmark_analysis ??
      [];

    return [
      ...(returnAnalysis.map((x) => x.metricName) ?? []),
      ...(benchmarkAnalysisArr
        .filter((x) => x.benchmarkName !== 'benchmark_return_analysis')
        .map((x) => x.metricName) ?? []),
    ];
  }, [simulationRunBreakdown]);

  const metricsToggle = (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Segmented
        size="small"
        value={metricsView}
        onChange={(v) => setMetricsView(v as 'gauge' | 'table')}
        options={[
          {
            value: 'gauge',
            label: (
              <Tooltip title="Gauge view">
                <BoxPlotOutlined />
              </Tooltip>
            ),
          },
          {
            value: 'table',
            label: (
              <Tooltip title="Table view">
                <TableOutlined />
              </Tooltip>
            ),
          },
        ]}
      />
    </div>
  );

  const handleMetricsCollapseChange = useCallback(
    (activeKey: string | string[]) => {
      const isOpen = Array.isArray(activeKey)
        ? activeKey.includes(METRICS_PANEL_KEY)
        : activeKey === METRICS_PANEL_KEY;
      setIsMetricsPanelOpen(isOpen);
    },
    []
  );

  useEffect(() => {
    const maybeOpenForTarget = (target?: string) => {
      if (target === '#metrics') {
        setIsMetricsPanelOpen(true);
      }
    };

    maybeOpenForTarget(window.location.hash);

    const onHashChange = () => maybeOpenForTarget(window.location.hash);
    const onNavSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ href?: string }>).detail;
      maybeOpenForTarget(detail?.href);
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener(
      'product-detail-nav-select',
      onNavSelect as EventListener
    );

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener(
        'product-detail-nav-select',
        onNavSelect as EventListener
      );
    };
  }, []);

  const poolWeightsCard = (
    <Card
      className={styles['product-detail-summary__cardDesktop']}
      title="Pool weights"
      extra={
        <Segmented
          value={weightsView}
          onChange={(v) => setWeightsView(v as 'product' | 'benchmark')}
          options={[
            { label: 'Product', value: 'product' },
            { label: 'Benchmark', value: 'benchmark' },
          ]}
        />
      }
    >
      <div className={styles['product-detail-summary__chart']}>
        <ProductTokenWeightChangeOverTimeGraph
          product={product}
          isBenchmark={weightsView === 'benchmark'}
          yAxisOverride={WEIGHT_CHART_Y_AXIS_OVERRIDE}
        />
      </div>
    </Card>
  );

  const returnDistributionCard = (
    <div id="distribution">
      <Card
        className={styles['product-detail-summary__cardDesktop']}
        title="Return distribution"
        extra={
          <Segmented
            value={returnsView}
            onChange={(v) => setReturnsView(v as 'product' | 'benchmark')}
            options={[
              { label: 'Product', value: 'product' },
              { label: 'Benchmark', value: 'benchmark' },
            ]}
          />
        }
      >
        <div className={styles['product-detail-summary__chart']}>
          {ts.length > 0 ? (
            <ReturnDistributionGraph
              yAxisOverride={RETURN_DISTRIBUTION_Y_AXIS_OVERRIDE}
              marketValues={
                returnsView === 'benchmark'
                  ? marketValuesBenchmark
                  : marketValuesProduct
              }
            />
          ) : (
            <Text type="secondary">No Data</Text>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className={styles['product-detail-summary__desktop']}>
      {poolWeightsCard}
      <ProductDetailSidebarStrategySummary product={product} />

      {SHOW_STRATEGY_WORKFLOW_SECTION && (
        <Collapse
          defaultActiveKey={[]}
          className={styles['product-detail-summary__collapse']}
          bordered={false}
        >
          <Panel
            key="strategy-workflow"
            header={
              <div className={styles['product-detail-summary__collapseHeader']}>
                <span className={styles['product-detail-summary__stepNumber']}>
                  2
                </span>
                <Text strong>Strategy workflow</Text>
                <Text
                  type="secondary"
                  className={styles['product-detail-summary__collapseHint']}
                ></Text>
              </div>
            }
          >
            <StrategyWorkflowCard product={product} factsheet={factsheet} />
          </Panel>
        </Collapse>
      )}

      {/* Collapsible metrics section with icon toggle */}
      <div id="metrics">
        <Collapse
          activeKey={isMetricsPanelOpen ? [METRICS_PANEL_KEY] : []}
          onChange={handleMetricsCollapseChange}
        >
          <Panel
            key={METRICS_PANEL_KEY}
            header={
              <span className={styles['product-detail-summary__title']}>
                Simulated HODL Performance Metric Analysis
                <Tooltip title="This pool is new and does not have enough data for live financial metrics. This is a simulated performance metric analysis based on the test period (see factsheet). Once the pool has been running for a while it will become live metrics">
                  <WarningOutlined style={{ color: 'orange' }} />
                </Tooltip>
              </span>
            }
            extra={metricsToggle}
          >
            {metricsView === 'table' ? (
              isLoading ? (
                <Skeleton active />
              ) : simulationRunBreakdown ? (
                <AnalysisSimplifiedBreakdownTable
                  simulationRunBreakdowns={[simulationRunBreakdown]}
                  benchmarkBreakdown={null}
                  visibleMetrics={visibleMetrics}
                />
              ) : (
                <Text type="secondary">No Data</Text>
              )
            ) : (
              <>
                <Card
                  className={styles['product-detail-summary__cardDesktop']}
                  title={
                    <div
                      className={styles['product-detail-summary__cardTitleRow']}
                    >
                      Metric:{' '}
                      <ProductDetailDropdown
                        items={returnAnalysisDropdownOptions}
                        isLoading={isLoading}
                        onChangeItem={setSelectedReturnMetricName}
                      />
                    </div>
                  }
                >
                  {isLoading ? (
                    <Skeleton active />
                  ) : (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <Statistic
                          title="Product"
                          value={
                            isFiniteNumber(productReturnValue)
                              ? productReturnValue
                              : undefined
                          }
                          precision={2}
                        />
                        <MetricProgress
                          label="Position in range"
                          value={productReturnValue}
                          thresholds={selectedReturnThreshold}
                          allThresholds={returnAnalysisThresholds}
                          helpText={selectedReturnThreshold?.tooltipDescription}
                        />
                      </Col>

                      <Col xs={24} md={8}>
                        <Statistic
                          title="Benchmark"
                          value={
                            isFiniteNumber(benchmarkReturnValue)
                              ? benchmarkReturnValue
                              : undefined
                          }
                          precision={2}
                        />
                        <MetricProgress
                          label="Position in range"
                          value={benchmarkReturnValue}
                          thresholds={selectedReturnThreshold}
                          allThresholds={returnAnalysisThresholds}
                          helpText={selectedReturnThreshold?.tooltipDescription}
                        />
                      </Col>

                      <Col xs={24} md={8}>
                        <div
                          className={styles['product-detail-summary__deltaBlock']}
                        >
                          <Text type="secondary">
                            Delta (Product − Benchmark)
                          </Text>
                          <div
                            className={styles['product-detail-summary__deltaTag']}
                          >
                            {deltaTag}
                          </div>
                          <Divider
                            className={
                              styles['product-detail-summary__dividerCompact']
                            }
                          />
                          <Space direction="vertical" size={4}>
                            <Text type="secondary">
                              Product: <Text>{format2(productReturnValue)}</Text>
                            </Text>
                            <Text type="secondary">
                              Benchmark:{' '}
                              <Text>{format2(benchmarkReturnValue)}</Text>
                            </Text>
                          </Space>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card>

                {/* Benchmark-relative metric (product only) */}
                <Card
                  className={styles['product-detail-summary__cardDesktop']}
                  title={
                    <div
                      className={styles['product-detail-summary__cardTitleRow']}
                    >
                      <span style={{ marginRight: 8 }}>Benchmark metric: </span>
                      <ProductDetailDropdown
                        items={benchmarkReturnAnalysisDropdownOptions}
                        isLoading={isLoading}
                        onChangeItem={setSelectedBenchmarkMetricName}
                      />
                    </div>
                  }
                >
                  {isLoading ? (
                    <Skeleton active />
                  ) : (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Statistic
                          title="Product"
                          value={
                            isFiniteNumber(
                              selectedBenchmarkReturnAnalysis?.metricValue
                            )
                              ? selectedBenchmarkReturnAnalysis?.metricValue
                              : undefined
                          }
                          precision={2}
                        />
                        <MetricProgress
                          label="Position in range"
                          value={selectedBenchmarkReturnAnalysis?.metricValue}
                          thresholds={selectedBenchmarkRelThreshold}
                          allThresholds={benchmarkReturnAnalysisThresholds}
                          helpText={
                            selectedBenchmarkRelThreshold?.tooltipDescription
                          }
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <div className={styles['product-detail-summary__naBlock']}>
                          <Text type="secondary">
                            {selectedBenchmarkRelThreshold?.tooltipDescription}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card>
              </>
            )}
          </Panel>
        </Collapse>
      </div>

      <ProductDetailEvents
        productId={product.id}
        chain={product.chain as GqlChain}
      />

      {returnDistributionCard}
    </div>
  );
};
