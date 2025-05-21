import { useMemo, useState } from 'react';
import { Card, Collapse, Divider, Typography } from 'antd';
import { FinancialMetricThresholds, Product } from '../../../../models';
import { SimulationRunMetric } from '../../../simulationResults/simulationResultSummaryModels';
import { ProductDetailDropdown } from '../components/productDetailDropdown';
import {
  ProductTokenWeightChangeOverTimeGraph,
  ReturnDistributionGraph,
} from '../../../shared/graphs';
import { ComparableProductSelector } from '../comparableProduct/comparableProductSelector';
import {
  getThresholdColor,
  getThresholdPostscript,
  benchmarksDropdownOptions,
} from './utils';

import styles from './productDetailSummary.module.scss';
const { Text } = Typography;

interface ProductDetailSummaryMobileProps {
  product: Product;
  loadingSimulationRunBreakdown: boolean;
  loadingOtherProductSimulationRunBreakdown: boolean;
  returnAnalysisDropdownOptions: { label: string; key: number }[];
  returnAnalysisThresholds: FinancialMetricThresholds[];
  benchmarkReturnAnalysisDropdownOptions: { label: string; key: number }[];
  benchmarkReturnAnalysisThresholds: FinancialMetricThresholds[];
  selectedReturnAnalysis: SimulationRunMetric | undefined;
  selectedBenchmarkReturnAnalysis: SimulationRunMetric | undefined;
  comparingProduct?: Product;
  comparingProductLoading: boolean;
  comparingProductReturnAnalysis?: SimulationRunMetric[] | null;
  comparingProductBenchmarkAnalysis?: SimulationRunMetric[] | null;
  onSelectComparableProduct: (poolId: string) => void;
  handleBenchmarkChange: (key: string) => void;
  handleReturnAnalysisChange: (key: string) => void;
  handleBenchmarkAnalysisChange: (key: string) => void;
}

const CardTitle = ({
  dropdownOptions,
  loadingSimulationRunBreakdown,
  loadingOtherProductSimulationRunBreakdown,
  handleChange,
}: {
  dropdownOptions: { label: string; key: number }[];
  loadingSimulationRunBreakdown: boolean;
  loadingOtherProductSimulationRunBreakdown: boolean;
  handleChange: (key: string) => void;
}) => {
  return (
    <ProductDetailDropdown
      items={dropdownOptions}
      isLoading={
        loadingSimulationRunBreakdown &&
        loadingOtherProductSimulationRunBreakdown
      }
      onChangeItem={handleChange}
    />
  );
};

export const ProductDetailSummaryMobile = ({
  product,
  loadingSimulationRunBreakdown,
  loadingOtherProductSimulationRunBreakdown,
  returnAnalysisDropdownOptions,
  returnAnalysisThresholds,
  benchmarkReturnAnalysisDropdownOptions,
  benchmarkReturnAnalysisThresholds,
  selectedReturnAnalysis,
  selectedBenchmarkReturnAnalysis,
  comparingProduct,
  comparingProductLoading,
  comparingProductReturnAnalysis,
  comparingProductBenchmarkAnalysis,
  handleBenchmarkChange,
  handleReturnAnalysisChange,
  handleBenchmarkAnalysisChange,
  onSelectComparableProduct,
}: ProductDetailSummaryMobileProps) => {
  const [isCompareProductOpen, setIsCompareProductOpen] = useState(true);

  const handleSelectComparableProduct = (poolId: string) => {
    onSelectComparableProduct(poolId);
    setIsCompareProductOpen(false);
  };

  const currentReturnAnalysisLabel: string = useMemo(() => {
    return (
      returnAnalysisDropdownOptions.find(
        (x) => x.label === (selectedReturnAnalysis?.metricName ?? '')
      )?.label ?? ''
    );
  }, [returnAnalysisDropdownOptions, selectedReturnAnalysis]);

  const currentBenchmarkAnalysisLabel: string = useMemo(() => {
    return (
      benchmarkReturnAnalysisDropdownOptions.find(
        (x) => x.label === (selectedBenchmarkReturnAnalysis?.metricName ?? '')
      )?.label ?? ''
    );
  }, [benchmarkReturnAnalysisDropdownOptions, selectedBenchmarkReturnAnalysis]);

  return (
    <div>
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
        onChange={() => {
          setIsCompareProductOpen((prev) => !prev);
        }}
        defaultActiveKey={['1']}
        activeKey={isCompareProductOpen ? ['1'] : []}
      />

      <Card
        className={styles['product-detail-summary__card']}
        title={
          <CardTitle
            {...{
              dropdownOptions: returnAnalysisDropdownOptions,
              loadingSimulationRunBreakdown,
              loadingOtherProductSimulationRunBreakdown,
              handleChange: handleReturnAnalysisChange,
            }}
          />
        }
        bordered={true}
      >
        <div className={styles['product-detail-summary__card__body']}>
          <div className={styles['product-detail-summary__key_container']}>
            <Text style={{ fontSize: 16 }} strong>
              {product.name}
            </Text>
          </div>
          <div className={styles['product-detail-summary__value_container']}>
            <Text
              strong
              style={{
                color: getThresholdColor(
                  returnAnalysisThresholds,
                  currentReturnAnalysisLabel,
                  selectedReturnAnalysis?.metricValue ?? 0
                ),
              }}
            >
              {(selectedReturnAnalysis?.metricValue ?? 0).toFixed(2)}{' '}
              {getThresholdPostscript(
                returnAnalysisThresholds,
                currentReturnAnalysisLabel,
                selectedReturnAnalysis?.metricValue ?? 0
              )}
            </Text>
          </div>
          <div className={styles['product-detail-summary__key_container']}>
            <ProductDetailDropdown
              items={benchmarksDropdownOptions}
              onChangeItem={handleBenchmarkChange}
            />
          </div>
          <div className={styles['product-detail-summary__value_container']}>
            <Text
              strong
              style={{
                color: getThresholdColor(
                  returnAnalysisThresholds,
                  currentReturnAnalysisLabel,
                  selectedReturnAnalysis?.metricValue ?? 0
                ),
              }}
            >
              {Number(selectedBenchmarkReturnAnalysis?.metricValue?.toFixed(2))}{' '}
              {getThresholdPostscript(
                returnAnalysisThresholds,
                currentReturnAnalysisLabel,
                selectedReturnAnalysis?.metricValue ?? 0
              )}
            </Text>
          </div>
          <div className={styles['product-detail-summary__key_container']}>
            <Text style={{ fontSize: 16 }} strong>
              {comparingProduct?.name}
            </Text>
          </div>
          <div className={styles['product-detail-summary__value_container']}>
            {comparingProduct && (
              <Text
                strong
                style={{
                  color: getThresholdColor(
                    returnAnalysisThresholds,
                    currentReturnAnalysisLabel,
                    comparingProductReturnAnalysis?.find(
                      (x) => x.metricName == selectedReturnAnalysis?.metricName
                    )?.metricValue ?? 0
                  ),
                }}
              >
                {Number(
                  comparingProductReturnAnalysis
                    ?.find(
                      (x) => x.metricName == selectedReturnAnalysis?.metricName
                    )
                    ?.metricValue?.toFixed(2)
                )}{' '}
                {getThresholdPostscript(
                  returnAnalysisThresholds,
                  currentReturnAnalysisLabel,
                  comparingProductReturnAnalysis?.find(
                    (x) => x.metricName == selectedReturnAnalysis?.metricName
                  )?.metricValue ?? 0
                )}
              </Text>
            )}
          </div>
        </div>
      </Card>
      <Divider />
      <Card
        className={styles['product-detail-summary__card']}
        title={
          <CardTitle
            {...{
              dropdownOptions: benchmarkReturnAnalysisDropdownOptions,
              loadingSimulationRunBreakdown,
              loadingOtherProductSimulationRunBreakdown,
              handleChange: handleBenchmarkAnalysisChange,
            }}
          />
        }
        bordered={true}
      >
        <div className={styles['product-detail-summary__card__body']}>
          <div className={styles['product-detail-summary__key_container']}>
            <Text style={{ fontSize: 16 }} strong>
              {product.name}
            </Text>
          </div>
          <div className={styles['product-detail-summary__value_container']}>
            <Text
              strong
              style={{
                color: getThresholdColor(
                  benchmarkReturnAnalysisThresholds,
                  currentBenchmarkAnalysisLabel,
                  selectedBenchmarkReturnAnalysis?.metricValue ?? 0
                ),
              }}
            >
              {Number(selectedBenchmarkReturnAnalysis?.metricValue?.toFixed(2))}{' '}
              {getThresholdPostscript(
                benchmarkReturnAnalysisThresholds,
                currentBenchmarkAnalysisLabel,
                selectedBenchmarkReturnAnalysis?.metricValue ?? 0
              )}
            </Text>
          </div>
          <div className={styles['product-detail-summary__key_container']}>
            <ProductDetailDropdown
              items={benchmarksDropdownOptions}
              onChangeItem={handleBenchmarkChange}
            />
          </div>
          <div className={styles['product-detail-summary__value_container']}>
            N/A
          </div>
          <div className={styles['product-detail-summary__key_container']}>
            {comparingProduct && (
              <Text style={{ fontSize: 16 }} strong>
                {comparingProduct?.name}
              </Text>
            )}
          </div>
          <div className={styles['product-detail-summary__value_container']}>
            {comparingProduct && (
              <Text
                strong
                style={{
                  color: getThresholdColor(
                    benchmarkReturnAnalysisThresholds,
                    currentBenchmarkAnalysisLabel,
                    comparingProductBenchmarkAnalysis?.find(
                      (x) =>
                        x.metricName ==
                        selectedBenchmarkReturnAnalysis?.metricName
                    )?.metricValue ?? 0
                  ),
                }}
              >
                {Number(
                  comparingProductBenchmarkAnalysis
                    ?.find(
                      (x) =>
                        x.metricName ==
                        selectedBenchmarkReturnAnalysis?.metricName
                    )
                    ?.metricValue?.toFixed(2)
                )}{' '}
                {getThresholdPostscript(
                  benchmarkReturnAnalysisThresholds,
                  currentBenchmarkAnalysisLabel,
                  comparingProductBenchmarkAnalysis?.find(
                    (x) =>
                      x.metricName ==
                      selectedBenchmarkReturnAnalysis?.metricName
                  )?.metricValue ?? 0
                )}
              </Text>
            )}
          </div>
        </div>
      </Card>
      <Divider />

      <Card title="Pool token weigth over time [%]">
        <div className={styles['product-detail-summary__card__body']}>
          <div
            className={styles['product-detail-summary__card__graph_container']}
          >
            <Text strong>{product.name}</Text>
            <div style={{ height: '100%', width: '100%' }}>
              <ProductTokenWeightChangeOverTimeGraph
                product={product}
                yAxisOverride={{ label: { enabled: false } }}
                legendOverride={{ enabled: false }}
              />
            </div>
          </div>
          <div
            className={styles['product-detail-summary__card__graph_container']}
          >
            <Text strong>{product.name}</Text>
            <div style={{ height: '100%', width: '100%' }}>
              <ProductTokenWeightChangeOverTimeGraph
                product={product}
                isBenchmark={true}
                yAxisOverride={{ label: { enabled: false } }}
                legendOverride={{ enabled: false }}
              />
            </div>
          </div>
          {comparingProduct && (
            <div
              className={
                styles['product-detail-summary__card__graph_container']
              }
            >
              <Text strong>{comparingProduct?.name}</Text>
              <div style={{ height: '100%', width: '100%' }}>
                <ProductTokenWeightChangeOverTimeGraph
                  product={comparingProduct}
                  yAxisOverride={{ label: { enabled: false } }}
                  legendOverride={{ enabled: false }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
      <Divider />
      <Card title="Return distribution">
        <div className={styles['product-detail-summary__card__body']}>
          <div
            className={styles['product-detail-summary__card__graph_container']}
          >
            <Text strong>{product.name}</Text>
            <div style={{ height: '100%', width: '100%' }}>
              {product.timeSeries?.length && (
                <ReturnDistributionGraph
                  marketValues={product.timeSeries.map((x) => x.sharePrice)}
                  yAxisOverride={{ title: { enabled: false } }}
                />
              )}
            </div>
          </div>

          <div
            className={styles['product-detail-summary__card__graph_container']}
          >
            <Text strong>
              {selectedBenchmarkReturnAnalysis?.metricName ??
                'No benchmark selected'}
            </Text>
            <div style={{ height: '100%', width: '100%' }}>
              {product.timeSeries?.length && (
                <ReturnDistributionGraph
                  marketValues={product.timeSeries.map((x) => x.hodlSharePrice)}
                  yAxisOverride={{ title: { enabled: false } }}
                />
              )}
            </div>
          </div>

          {comparingProduct && (
            <div
              className={
                styles['product-detail-summary__card__graph_container']
              }
            >
              <Text strong>{comparingProduct?.name}</Text>
              <div style={{ height: '100%', width: '100%' }}>
                {comparingProduct?.timeSeries?.length && (
                  <ReturnDistributionGraph
                    marketValues={
                      comparingProduct?.timeSeries.map((x) => x.sharePrice) ??
                      []
                    }
                    yAxisOverride={{ title: { enabled: false } }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
