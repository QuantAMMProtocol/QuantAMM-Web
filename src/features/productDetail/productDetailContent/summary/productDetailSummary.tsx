import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row, Tooltip, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { GqlChain } from '../../../../__generated__/graphql-types';
import { Benchmark, Product } from '../../../../models';
import {
  loadProducts,
  selectBenchmarkAnalysisByProductId,
  selectBenchmarkMetricThresholds,
  selectLoadingSimulationRunBreakdown,
  selectProductById,
  selectProducts,
  selectReturnAnalysisByProductId,
  selectReturnMetricThresholds,
  setProductSimulationRunBreakdown,
} from '../../../productExplorer/productExplorerSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useFetchProductData } from '../../../../hooks/useFetchProductData';
import { useFinancialAnalysis } from '../../../../hooks/useFinancialAnalysis';
import { ProductDetailSummaryDesktop } from './productDetailSummaryDesktop';
import { ProductDetailSummaryMobile } from './productDetailSummaryMobile';
import { SimulationRunBreakdown, SimulationRunMetric } from '../../../simulationResults/simulationResultSummaryModels';

import styles from './productDetailSummary.module.scss';
import { getBreakdown, Pool } from '../../../../services/breakdownService';

const { Title } = Typography;

const benchmarksDropdownOptions = [
  { label: 'HODL', key: 1 },
  { label: 'BTC', key: 2 },
  { label: 'Momentum', key: 3 },
  { label: 'RF', key: 4 },
];

const getDropdownOptions = (
  list: string[]
): { label: string; key: number }[] => {
  const options = [] as { label: string; key: number }[];

  list.forEach((item, index) => {
    options.push({ label: item, key: index });
  });

  return options;
};

export interface ProductDetailSelectorData {
  stats?: string;
  values: number[] | string[];
}

interface ProductDetailSummaryProps {
  product: Product;
  loadingSimulationRunBreakdown: boolean;
  isMobile: boolean;
}

const defaultBenchmark = Benchmark.HODL;

const ADDRESS_POOL_MAP: Record<string, Pool> = {
  '0xd4ed17bbf48af09b87fd7d8c60970f5da79d4852': 'safeHavenBTFAugTest',
};


export const ProductDetailSummary: FC<ProductDetailSummaryProps> = ({
  product,
  loadingSimulationRunBreakdown,
  isMobile,
}) => {
  const dispatch = useAppDispatch();

  const [selectedReturnAnalysis, setSelectedReturnAnalysis] = useState<
    SimulationRunMetric | undefined
  >(undefined);

  const [selectedBenchmarkAnalysis, setSelectedBenchmarkAnalysis] = useState<
    SimulationRunMetric | undefined
  >(undefined);

  const [comparingProductId, setComparingProductId] = useState<{
    id: string;
    chain: GqlChain;
  } | null>(null);

  const [comparingBenchmark, setComparingBenchmark] = useState<string | null>(
    null
  );

  const loadingOtherProductSimulationRunBreakdown = useAppSelector((state) =>
    selectLoadingSimulationRunBreakdown(state, comparingProductId?.id ?? '')
  );

  const returnAnalysis = useAppSelector((state) =>
    selectReturnAnalysisByProductId(state, product.id)
  );

  const returnAnalysisThresholds = useAppSelector(selectReturnMetricThresholds);

  const returnAnalysisThresholdsKeys = useMemo(() => {
    return returnAnalysisThresholds.map((element) => element.key);
  }, [returnAnalysisThresholds]);

  const comparingProductReturnAnalysis = useAppSelector((state) =>
    selectReturnAnalysisByProductId(state, comparingProductId?.id ?? '')
  );

  //this is the return analysis of the benchmark itself
  const benchmarkAnalysis = useAppSelector((state) =>
    selectBenchmarkAnalysisByProductId(
      state,
      product.id,
      'benchmark_return_analysis'
    )
  );

  //this is the return analysis of the benchmark itself
  const benchmarkReturnAnalysis = useAppSelector((state) =>
    selectBenchmarkAnalysisByProductId(
      state,
      product.id,
      comparingBenchmark ?? ''
    )
  );

  const comparingProductBenchmarkReturnAnalysis = useAppSelector((state) =>
    selectBenchmarkAnalysisByProductId(
      state,
      comparingProductId?.id ?? '',
      comparingBenchmark ?? ''
    )
  );

  const benchmarkReturnAnalysisThresholds = useAppSelector(
    selectBenchmarkMetricThresholds
  );

  const benchmarkReturnAnalysisThresholdsKeys = useMemo(() => {
    return benchmarkReturnAnalysisThresholds.map((element) => element.key);
  }, [benchmarkReturnAnalysisThresholds]);

  const returnAnalysisDropdownOptions = useMemo(() => {
    return getDropdownOptions(
      returnAnalysis
        ?.filter(
          (element) =>
            !!element && !!element.metricValue && element.metricValue !== 0
        )
        .filter(
          (x) =>
            returnAnalysisThresholds.map((y) => y.key).indexOf(x.metricName) !=
            -1
        )
        .map((element) => element.metricName) ?? []
    );
  }, [returnAnalysis, returnAnalysisThresholds]);

  const benchmarkAnalysisDropdownOptions = useMemo(() => {
    return getDropdownOptions(
      benchmarkReturnAnalysis
        ?.filter(
          (element) =>
            !!element && !!element.metricValue && element.metricValue !== 0
        )
        .filter(
          (x) =>
            benchmarkReturnAnalysisThresholds
              .map((y) => y.key)
              .indexOf(x.metricName) != -1
        )
        .map((element) => element.metricName) ?? []
    );
  }, [benchmarkReturnAnalysis, benchmarkReturnAnalysisThresholds]);

  const handleReturnAnalysisChange = useCallback(
    (selectedItemKey: string) => {
      setSelectedReturnAnalysis(
        returnAnalysis
          ?.filter(
            (x) => returnAnalysisThresholdsKeys.indexOf(x.metricName) != -1
          )
          .find((option) => option.metricName === selectedItemKey)
      );
    },
    [returnAnalysis, returnAnalysisThresholdsKeys]
  );

  const handleBenchmarkChange = useCallback(
    (selectedItemKey: string) => {
      const benchmarkName =
        benchmarksDropdownOptions
          ?.filter(
            (x) => benchmarkReturnAnalysisThresholdsKeys.indexOf(x.label) != -1
          )
          .find((option) => option.label === selectedItemKey)?.label ??
        defaultBenchmark;
      setComparingBenchmark(benchmarkName);
    },
    [benchmarkReturnAnalysisThresholdsKeys]
  );

  const handleBenchmarkAnalysisChange = useCallback(
    (selectedItemKey: string) => {
      setSelectedBenchmarkAnalysis(
        benchmarkReturnAnalysis
          ?.filter(
            (x) =>
              benchmarkReturnAnalysisThresholdsKeys.indexOf(x.metricName) != -1
          )
          .find((option) => option.metricName === selectedItemKey)
      );
    },
    [benchmarkReturnAnalysis, benchmarkReturnAnalysisThresholdsKeys]
  );

  useEffect(() => {
    if (comparingBenchmark === null && benchmarksDropdownOptions) {
      setComparingBenchmark(benchmarksDropdownOptions[0].label.toLowerCase());
    }
  }, [comparingBenchmark]);

  const handleSelectComparableProduct = (poolId: string) => {
    if (poolId === '') {
      setComparingProductId(null);
    } else {
      const [chain, id] = poolId.split(':');
      setComparingProductId({
        id,
        chain: chain as GqlChain,
      });
    }
  };

  const { product: productData, productLoading } = useFetchProductData(
    comparingProductId?.id ?? '',
    comparingProductId?.chain ?? GqlChain.Mainnet
  );

  useEffect(() => {
    if (productData) {
      dispatch(loadProducts({ [productData.id]: productData }));
    }
  }, [productData, dispatch]);

  const [breakdowns, setBreakdowns] = useState<Record<Pool, SimulationRunBreakdown>>({} as Record<Pool, SimulationRunBreakdown>);
  const [loadingBreakdowns, setLoadingBreakdowns] = useState(true);

  const addressKey = product.address?.toLowerCase() ?? '';
  const specialPoolKey = ADDRESS_POOL_MAP[addressKey];

  useEffect(() => {
    const pools = Object.values(ADDRESS_POOL_MAP);
    const loadAll = async () => {
      setLoadingBreakdowns(true);
      const entries = await Promise.all(
        pools.map(async (pool) => [pool, await getBreakdown(pool)] as const)
      );
      setBreakdowns(Object.fromEntries(entries) as Record<Pool, SimulationRunBreakdown>);
      setLoadingBreakdowns(false);
    };
    void loadAll();
  }, []);

  useEffect(() => {
    if (specialPoolKey && !loadingBreakdowns && breakdowns[specialPoolKey]) {
      console.log('Dispatching breakdown for product:', product.id);
      console.log('Breakdown:', breakdowns[specialPoolKey]);
      dispatch(
        setProductSimulationRunBreakdown({
          productId: product.id,
          simulationRunBreakdown: breakdowns[specialPoolKey],
        })
      );
    }
  }, [specialPoolKey, loadingBreakdowns, breakdowns, product, dispatch]);

  const hasTimeSeries = Array.isArray(product.timeSeries) && product.timeSeries.length > 0;
  const shouldRun = hasTimeSeries && !specialPoolKey;
  useFinancialAnalysis({
    product,
    benchmark: Benchmark.HODL,
    loadToSimulator: false,
    shouldRun,
  });

  const comparingProduct = selectProductById(
    useAppSelector(selectProducts),
    comparingProductId?.id ?? ''
  );

  useEffect(() => {
    if (selectedReturnAnalysis === undefined && returnAnalysis) {
      setSelectedReturnAnalysis(returnAnalysis[0]);
    }
  }, [selectedReturnAnalysis, returnAnalysis]);

  useEffect(() => {
    if (selectedBenchmarkAnalysis === undefined && benchmarkReturnAnalysis) {
      setSelectedBenchmarkAnalysis(benchmarkReturnAnalysis[0]);
    }
  }, [selectedBenchmarkAnalysis, benchmarkReturnAnalysis]);

  return (
    <Row id="summary" style={{ marginTop: 20 }}>
      <Col span={24} className={styles['product-detail-summary__title']}>
        {specialPoolKey ? 
          <div>
            <Tooltip title='This pool is new and does not have enough data for most financial metrics. This is a simulated performance metric analysis based on the Aug24-Apr25 period (see factsheet). Once the pool has been running for a while it will become live metrics'>
            <Title level={4}>Simulated HODL Performance Metric Analysis {'  '} <WarningOutlined type='warning'/> </Title>
            </Tooltip>
          </div> : <Title level={4}>HODL Performance Metric Analysis</Title>}
      </Col>
      <Col span={24}>
        <div className={styles['product-detail-summary__container']}>
          {isMobile ? (
            <ProductDetailSummaryMobile
              product={product}
              loadingSimulationRunBreakdown={loadingSimulationRunBreakdown}
              loadingOtherProductSimulationRunBreakdown={
                loadingOtherProductSimulationRunBreakdown
              }
              selectedReturnAnalysis={selectedReturnAnalysis}
              returnAnalysisThresholds={returnAnalysisThresholds}
              selectedBenchmarkReturnAnalysis={selectedBenchmarkAnalysis}
              benchmarkReturnAnalysisThresholds={
                benchmarkReturnAnalysisThresholds
              }
              comparingProductReturnAnalysis={comparingProductReturnAnalysis}
              comparingProductBenchmarkAnalysis={
                comparingProductBenchmarkReturnAnalysis
              }
              returnAnalysisDropdownOptions={returnAnalysisDropdownOptions}
              benchmarkReturnAnalysisDropdownOptions={
                benchmarkAnalysisDropdownOptions
              }
              comparingProduct={comparingProduct}
              comparingProductLoading={productLoading}
              onSelectComparableProduct={handleSelectComparableProduct}
              handleBenchmarkChange={handleBenchmarkChange}
              handleReturnAnalysisChange={handleReturnAnalysisChange}
              handleBenchmarkAnalysisChange={handleBenchmarkAnalysisChange}
            />
          ) : (
            <ProductDetailSummaryDesktop
              product={product}
              loadingSimulationRunBreakdown={loadingSimulationRunBreakdown}
              loadingOtherProductSimulationRunBreakdown={
                loadingOtherProductSimulationRunBreakdown
              }
              selectedReturnAnalysis={selectedReturnAnalysis}
              returnAnalysisThresholds={returnAnalysisThresholds}
              benchmarkAnalysis={benchmarkAnalysis}
              selectedBenchmarkReturnAnalysis={selectedBenchmarkAnalysis}
              benchmarkReturnAnalysisThresholds={
                benchmarkReturnAnalysisThresholds
              }
              comparingProductReturnAnalysis={comparingProductReturnAnalysis}
              comparingProductBenchmarkAnalysis={
                comparingProductBenchmarkReturnAnalysis
              }
              returnAnalysisDropdownOptions={returnAnalysisDropdownOptions}
              benchmarkReturnAnalysisDropdownOptions={
                benchmarkAnalysisDropdownOptions
              }
              comparingProduct={comparingProduct}
              comparingProductLoading={productLoading}
              onSelectComparableProduct={handleSelectComparableProduct}
              handleBenchmarkChange={handleBenchmarkChange}
              handleReturnAnalysisChange={handleReturnAnalysisChange}
              handleBenchmarkAnalysisChange={handleBenchmarkAnalysisChange}
            />
          )}
        </div>
      </Col>
    </Row>
  );
};
