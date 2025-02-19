import { FC } from 'react';
import { Col, Row, Tooltip, Typography } from 'antd';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FinancialMetricThresholds, Product } from '../../../../models';
import {
  ReturnDistributionGraph,
  ProductTokenWeightChangeOverTimeGraph,
} from '../../../shared/graphs';
import { SimulationRunMetric } from '../../../simulationResults/simulationResultSummaryModels';
import { ProductDetailDropdown } from '../components/productDetailDropdown';
import { ProductDetailGauge } from '../components/productDetailGauge';
import { ComparableProductSelector } from '../comparableProduct/comparableProductSelector';
import { getMax, benchmarksDropdownOptions } from './utils';

import styles from './productDetailSummary.module.scss';

const { Text } = Typography;

export interface ProductDetailSelectorData {
  stats?: string;
  values: number[] | string[];
}

export interface ProductDetailSelectorData {
  stats?: string;
  values: number[] | string[];
}

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
  comparingProduct?: Product;
  comparingProductReturnAnalysis?: SimulationRunMetric[] | null;
  comparingProductBenchmarkAnalysis?: SimulationRunMetric[] | null;
  onSelectComparableProduct: (poolId: string) => void;
  handleBenchmarkChange: (key: string) => void;
  handleReturnAnalysisChange: (key: string) => void;
  handleBenchmarkAnalysisChange: (key: string) => void;
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
  comparingProduct,
  comparingProductReturnAnalysis,
  comparingProductBenchmarkAnalysis,
  handleReturnAnalysisChange,
  handleBenchmarkAnalysisChange,
  onSelectComparableProduct,
}) => {
  return (
    <>
      {/* first row */}
      {/* first column - empty item to align the other products */}
      <div className={styles['product-detail-summary__item']}></div>
      {/* second column - current product */}
      <div className={styles['product-detail-summary__item']}>
        <Text style={{ fontSize: 16 }} strong>
          Current Product
        </Text>
      </div>
      {/* third column - benchmark */}
      <div className={styles['product-detail-summary__item']}>
        <Text style={{ fontSize: 16 }} strong>
          Benchmark
        </Text>
      </div>
      {/* fourth column - other products */}
      <div className={styles['product-detail-summary__item']}>
        <Text style={{ fontSize: 16 }} strong>
          Compare Product
        </Text>
      </div>

      {/* second row */}
      {/* first column - empty item to align the other products */}
      <div className={styles['product-detail-summary__item']}></div>

      {/* second column - current product */}
      <div className={styles['product-detail-summary__item']}>
        <Text style={{ fontSize: 16 }} strong>
          {product.name}
        </Text>
      </div>

      {/* third column */}
      <div className={styles['product-detail-summary__item']}>
        <ProductDetailDropdown
          items={benchmarksDropdownOptions}
          width={'auto'}
          onChangeItem={handleBenchmarkAnalysisChange}
        />
        <Tooltip title="Select a benchmark to compare the product with">
          <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
        </Tooltip>
      </div>

      {/* fourth column */}
      <div
        className={styles['product-detail-summary__item']}
        style={comparingProduct ? {} : { gridRowEnd: 'span 5' }}
      >
        {comparingProduct ? (
          <div
            className={
              styles['product-detail-summary__comparable-product-title']
            }
          >
            <Text
              style={{ fontSize: 16 }}
              onClick={() => onSelectComparableProduct('')}
            >
              {comparingProduct.name} <CloseOutlined />
            </Text>
          </div>
        ) : (
          <ComparableProductSelector onSelect={onSelectComparableProduct} />
        )}
      </div>

      {/* third row */}
      {/* first column */}
      <div className={styles['product-detail-summary__item-vertical']}>
        <Row>
          <Col span={4}>
            <Tooltip
              title={
                returnAnalysisThresholds?.find(
                  (x) => x.key == selectedReturnAnalysis?.metricName
                )?.tooltipDescription
              }
            >
              <InfoCircleOutlined
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                }}
              />
            </Tooltip>
          </Col>
          <Col span={20}>
            <ProductDetailDropdown
              items={returnAnalysisDropdownOptions}
              isLoading={
                loadingSimulationRunBreakdown &&
                loadingOtherProductSimulationRunBreakdown
              }
              onChangeItem={handleReturnAnalysisChange}
            />
          </Col>
        </Row>
      </div>

      {/* second column */}
      <div className={styles['product-detail-summary__item']}>
        <ProductDetailGauge
          thresholds={returnAnalysisThresholds?.find(
            (x) => x.key == selectedReturnAnalysis?.metricName
          )}
          values={{
            min: 0,
            max: getMax(returnAnalysisThresholds, selectedReturnAnalysis),
            actual: getMax(returnAnalysisThresholds, selectedReturnAnalysis),
            target: selectedReturnAnalysis?.metricValue,
          }}
        />
      </div>
      {/* third column */}
      <div className={styles['product-detail-summary__item']}>
        <ProductDetailGauge
          thresholds={returnAnalysisThresholds?.find(
            (x) => x.key == selectedReturnAnalysis?.metricName
          )}
          values={{
            min: 0,
            max: getMax(
              returnAnalysisThresholds,
              benchmarkAnalysis?.find(
                (x) => x.metricName == selectedReturnAnalysis?.metricName
              )
            ),
            actual: getMax(
              returnAnalysisThresholds,
              benchmarkAnalysis?.find(
                (x) => x.metricName == selectedReturnAnalysis?.metricName
              )
            ),
            target: Number(
              benchmarkAnalysis
                ?.find(
                  (x) => x.metricName == selectedReturnAnalysis?.metricName
                )
                ?.metricValue?.toFixed(2)
            ),
          }}
        />
      </div>

      {/* fourth column */}

      {comparingProduct && (
        <div className={styles['product-detail-summary__item']}>
          <ProductDetailGauge
            thresholds={returnAnalysisThresholds?.find(
              (x) =>
                x.key ==
                comparingProductReturnAnalysis?.find(
                  (x) => x.metricName == selectedReturnAnalysis?.metricName
                )?.metricName
            )}
            values={{
              min: 0,
              max: getMax(
                returnAnalysisThresholds,
                comparingProductReturnAnalysis?.find(
                  (x) => x.metricName == selectedReturnAnalysis?.metricName
                )
              ),
              actual: getMax(
                returnAnalysisThresholds,
                comparingProductReturnAnalysis?.find(
                  (x) => x.metricName == selectedReturnAnalysis?.metricName
                )
              ),
              target: Number(
                comparingProductReturnAnalysis
                  ?.find(
                    (x) => x.metricName == selectedReturnAnalysis?.metricName
                  )
                  ?.metricValue?.toFixed(2)
              ),
            }}
          />
        </div>
      )}

      {/* fourth row */}
      {/* first column */}
      <div className={styles['product-detail-summary__item-vertical']}>
        <Row>
          <Col span={4}>
            <Tooltip
              title={
                benchmarkReturnAnalysisThresholds?.find(
                  (x) => x.key == selectedBenchmarkReturnAnalysis?.metricName
                )?.tooltipDescription
              }
            >
              <InfoCircleOutlined
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                }}
              />
            </Tooltip>
          </Col>
          <Col span={20}>
            <ProductDetailDropdown
              items={benchmarkReturnAnalysisDropdownOptions}
              isLoading={
                loadingSimulationRunBreakdown &&
                loadingOtherProductSimulationRunBreakdown
              }
              onChangeItem={handleBenchmarkAnalysisChange}
            />
          </Col>
        </Row>
      </div>

      {/* second column */}
      <div className={styles['product-detail-summary__item']}>
        <ProductDetailGauge
          thresholds={benchmarkReturnAnalysisThresholds?.find(
            (x) => x.key == selectedBenchmarkReturnAnalysis?.metricName
          )}
          values={{
            min: 0,
            max: getMax(
              benchmarkReturnAnalysisThresholds,
              selectedBenchmarkReturnAnalysis
            ),
            actual: getMax(
              benchmarkReturnAnalysisThresholds,
              selectedBenchmarkReturnAnalysis
            ),
            target: selectedBenchmarkReturnAnalysis?.metricValue,
          }}
        />
      </div>
      {/* third column */}
      <div className={styles['product-detail-summary__item']}></div>

      {/* fourth column */}
      {comparingProduct && (
        <div className={styles['product-detail-summary__item']}>
          <ProductDetailGauge
            thresholds={benchmarkReturnAnalysisThresholds?.find(
              (x) =>
                x.key ==
                comparingProductBenchmarkAnalysis?.find(
                  (x) =>
                    x.metricName == selectedBenchmarkReturnAnalysis?.metricName
                )?.metricName
            )}
            values={{
              min: 0,
              max: getMax(
                benchmarkReturnAnalysisThresholds,
                comparingProductBenchmarkAnalysis?.find(
                  (x) =>
                    x.metricName == selectedBenchmarkReturnAnalysis?.metricName
                )
              ),
              actual: getMax(
                benchmarkReturnAnalysisThresholds,
                comparingProductBenchmarkAnalysis?.find(
                  (x) =>
                    x.metricName == selectedBenchmarkReturnAnalysis?.metricName
                )
              ),
              target: comparingProductBenchmarkAnalysis?.find(
                (x) =>
                  x.metricName == selectedBenchmarkReturnAnalysis?.metricName
              )?.metricValue,
            }}
          />
        </div>
      )}

      {/* fifth row */}
      {/* first column */}
      <div className={styles['product-detail-summary__item-vertical']}>
        Pool token weigth over time [%]
      </div>

      {/* second column */}
      <div className={styles['product-detail-summary__item']}>
        <div style={{ height: '100%', width: '100%' }}>
          <ProductTokenWeightChangeOverTimeGraph
            product={product}
            yAxisOverride={{ label: { enabled: false } }}
            legendOverride={{ enabled: false }}
          />
        </div>
      </div>

      {/* third column */}
      <div className={styles['product-detail-summary__item']}>
        <div style={{ height: '100%', width: '100%' }}>
          <ProductTokenWeightChangeOverTimeGraph
            product={product}
            isBenchmark={true}
            yAxisOverride={{ label: { enabled: false } }}
            legendOverride={{ enabled: false }}
          />
        </div>
      </div>

      {/* fourth column */}
      {comparingProduct && (
        <div className={styles['product-detail-summary__item']}>
          <div style={{ height: '100%', width: '100%' }}>
            <ProductTokenWeightChangeOverTimeGraph
              product={comparingProduct}
              yAxisOverride={{ label: { enabled: false } }}
              legendOverride={{ enabled: false }}
            />
          </div>
        </div>
      )}

      {/* sixth row */}
      {/* first column */}
      <div className={styles['product-detail-summary__item-vertical']}>
        Return distribution
      </div>

      {/* second column */}
      <div className={styles['product-detail-summary__item']}>
        {' '}
        <div style={{ height: '100%', width: '100%' }}>
          <ReturnDistributionGraph
            marketValues={product.timeSeries?.map((x) => x.sharePrice) ?? []}
            yAxisOverride={{ title: { enabled: false } }}
          />
        </div>
      </div>

      {/* third column */}
      <div className={styles['product-detail-summary__item']}>
        {' '}
        <div style={{ height: '100%', width: '100%' }}>
          <ReturnDistributionGraph
            yAxisOverride={{ title: { enabled: false } }}
            marketValues={
              product.timeSeries?.map((x) => x.hodlSharePrice) ?? []
            }
          />
        </div>
      </div>

      {/* fourth column */}
      {comparingProduct && (
        <div className={styles['product-detail-summary__item']}>
          <div style={{ height: '100%', width: '100%' }}>
            <ReturnDistributionGraph
              yAxisOverride={{ title: { enabled: false } }}
              marketValues={
                comparingProduct?.timeSeries?.map((x) => x.sharePrice) ?? []
              }
            />
          </div>
        </div>
      )}
    </>
  );
};
