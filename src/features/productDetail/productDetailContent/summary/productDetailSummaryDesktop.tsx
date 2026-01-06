import { FC, useMemo, useState } from 'react';
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

import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

import { FinancialMetricThresholds, Product } from '../../../../models';
import {
  ReturnDistributionGraph,
  ProductTokenWeightChangeOverTimeGraph,
} from '../../../shared/graphs';
import { SimulationRunMetric } from '../../../simulationResults/simulationResultSummaryModels';
import { ProductDetailDropdown } from '../components/productDetailDropdown';

import { CURRENT_LIVE_FACTSHEETS } from '../../../documentation/factSheets/liveFactsheets';

import styles from './productDetailSummary.module.scss';
import { getMax, getMin } from './utils';
import Title from 'antd/es/typography/Title';
import { StrategyWorkflowCard } from './strategyWorkflowCard';

const { Text } = Typography;
const { Panel } = Collapse;

interface ProductDetailSummaryDesktopProps {
  product: Product;
  loadingSimulationRunBreakdown: boolean;
  loadingOtherProductSimulationRunBreakdown: boolean;

  returnAnalysisDropdownOptions: { label: string; key: number }[];
  returnAnalysisThresholds: FinancialMetricThresholds[];

  benchmarkReturnAnalysisDropdownOptions: { label: string; key: number }[];
  benchmarkReturnAnalysisThresholds: FinancialMetricThresholds[];

  benchmarkAnalysis?: SimulationRunMetric[] | null;
  selectedReturnAnalysis?: SimulationRunMetric;
  selectedBenchmarkReturnAnalysis?: SimulationRunMetric;

  // Kept for drop-in compatibility (compare removed; unused)
  comparingProduct?: Product;
  comparingProductLoading: boolean;
  comparingProductReturnAnalysis?: SimulationRunMetric[] | null;
  comparingProductBenchmarkAnalysis?: SimulationRunMetric[] | null;
  onSelectComparableProduct: (poolId: string) => void;

  // Kept for drop-in compatibility
  handleBenchmarkChange: (key: string) => void;

  handleReturnAnalysisChange: (key: string) => void;
  handleBenchmarkAnalysisChange: (key: string) => void;
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
  benchmarkReturnAnalysisDropdownOptions,
  benchmarkReturnAnalysisThresholds,
  benchmarkAnalysis,
  selectedReturnAnalysis,
  selectedBenchmarkReturnAnalysis,
  handleReturnAnalysisChange,
  handleBenchmarkAnalysisChange,
}) => {
  const isLoading =
    loadingSimulationRunBreakdown && loadingOtherProductSimulationRunBreakdown;

  const [weightsView, setWeightsView] = useState<'product' | 'benchmark'>(
    'product'
  );
  const [returnsView, setReturnsView] = useState<'product' | 'benchmark'>(
    'product'
  );

  const ts = useMemo(() => product?.timeSeries ?? [], [product?.timeSeries]);

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

  return (
    <div className={styles['product-detail-summary__desktop']}>
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
            yAxisOverride={{ label: { enabled: false } }}
          />
        </div>
      </Card>
      {
        /* hidden as the subgraph has still not been pushed to prod*/
        <div hidden>
          <Collapse
            defaultActiveKey={[]}
            className={styles['product-detail-summary__collapse']}
            bordered={false}
          >
            <Panel
              key="strategy-workflow"
              header={
                <div
                  className={styles['product-detail-summary__collapseHeader']}
                >
                  <span
                    className={styles['product-detail-summary__stepNumber']}
                  >
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
              <StrategyWorkflowCard
                product={product}
                factsheet={factsheet}
              />
            </Panel>
          </Collapse>
        </div>
      }

      <Col span={24} className={styles['product-detail-summary__title']}>
        <div>
          <Tooltip title="This pool is new and does not have enough data for most financial metrics. This is a simulated performance metric analysis based on the test period (see factsheet). Once the pool has been running for a while it will become live metrics">
            <Title level={4}>
              Simulated HODL Performance Metric Analysis {'  '}{' '}
              <WarningOutlined type="warning" />{' '}
            </Title>
          </Tooltip>
        </div>
      </Col>
      <Card
        className={styles['product-detail-summary__cardDesktop']}
        title={
          <div className={styles['product-detail-summary__cardTitleRow']}>
            Metric:{' '}
            <ProductDetailDropdown
              items={returnAnalysisDropdownOptions}
              isLoading={isLoading}
              onChangeItem={handleReturnAnalysisChange}
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
              <div className={styles['product-detail-summary__deltaBlock']}>
                <Text type="secondary">Delta (Product − Benchmark)</Text>
                <div className={styles['product-detail-summary__deltaTag']}>
                  {deltaTag}
                </div>
                <Divider
                  className={styles['product-detail-summary__dividerCompact']}
                />
                <Space direction="vertical" size={4}>
                  <Text type="secondary">
                    Product: <Text>{format2(productReturnValue)}</Text>
                  </Text>
                  <Text type="secondary">
                    Benchmark: <Text>{format2(benchmarkReturnValue)}</Text>
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
          <div className={styles['product-detail-summary__cardTitleRow']}>
            <span style={{ marginRight: 8 }}>Benchmark metric: </span>
            <ProductDetailDropdown
              items={benchmarkReturnAnalysisDropdownOptions}
              isLoading={isLoading}
              onChangeItem={handleBenchmarkAnalysisChange}
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
                  isFiniteNumber(selectedBenchmarkReturnAnalysis?.metricValue)
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
                helpText={selectedBenchmarkRelThreshold?.tooltipDescription}
              />
            </Col>

            <Col xs={24} md={12}>
              <div className={styles['product-detail-summary__naBlock']}>
                <Text type="secondary">Benchmark</Text>
                <div className={styles['product-detail-summary__naValue']}>
                  Not applicable
                </div>
                <Text type="secondary">
                  This metric is defined relative to the benchmark, so the
                  benchmark does not have its own value.
                </Text>
              </div>
            </Col>
          </Row>
        )}
      </Card>

      {/* Return distribution */}
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
              yAxisOverride={{ title: { enabled: false } }}
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
};
