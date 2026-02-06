import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'antd';
import { GqlChain } from '../../../../__generated__/graphql-types';
import { Benchmark, Product } from '../../../../models';
import {
  loadProducts,
  selectBenchmarkAnalysisByProductId,
  selectBenchmarkMetricThresholds,
  selectLoadingJsonBreakdown,
  selectLoadingSimulationRunBreakdown,
  selectProductById,
  selectReturnAnalysisByProductId,
  selectReturnMetricThresholds,
  setLoadingJsonProductSimulations,
  setProductSimulationRunBreakdown,
} from '../../../productExplorer/productExplorerSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useFetchProductData } from '../../../../hooks/useFetchProductData';
import { useFinancialAnalysis } from '../../../../hooks/useFinancialAnalysis';
import { ProductDetailSummaryDesktop } from './productDetailSummaryDesktop';
import { ProductDetailSummaryMobile } from './productDetailSummaryMobile';
import {
  SimulationRunBreakdown,
  SimulationRunMetric,
} from '../../../simulationResults/simulationResultSummaryModels';

import styles from './productDetailSummary.module.scss';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { CURRENT_LIVE_FACTSHEETS } from '../../../documentation/factSheets/liveFactsheets';

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

//TODO CH split components.
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

  const live_pools = CURRENT_LIVE_FACTSHEETS;

  const loadingBreakdowns = useAppSelector(selectLoadingJsonBreakdown);

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
    if (productData && comparingProductId?.id) {
      dispatch(loadProducts({ [productData.id]: productData }));
    }
  }, [productData, dispatch, comparingProductId?.id]);

  const [breakdowns, setBreakdowns] = useState<
    Record<Pool, SimulationRunBreakdown>
  >({} as Record<Pool, SimulationRunBreakdown>);

  const addressKey = product.address?.toLowerCase() ?? '';
  const specialPoolKey =
    live_pools.factsheets.find((x) => x.poolId === addressKey)?.targetPoolJson ??
    '';

  const existingReturnAnalysis = useAppSelector((state) =>
    selectReturnAnalysisByProductId(state, product.id)
  );

  useEffect(() => {
    let cancelled = false;
    const pools = live_pools.factsheets.map((x) => x.targetPoolJson);

    const loadAll = async () => {
      dispatch(setLoadingJsonProductSimulations(true));
      try {
        const entries = await Promise.all(
          pools.map(async (pool) => [pool, await getBreakdown(pool)] as const)
        );
        if (!cancelled) {
          setBreakdowns(
            Object.fromEntries(entries) as Record<Pool, SimulationRunBreakdown>
          );
        }
      } finally {
        dispatch(setLoadingJsonProductSimulations(false));
      }
    };

    void loadAll();
    return () => {
      cancelled = true;
    };
  }, [dispatch, live_pools.factsheets]);

  useEffect(() => {
    if (!specialPoolKey || loadingBreakdowns) return;
    const b = breakdowns[specialPoolKey];
    if (!b) return;
    if (!existingReturnAnalysis || existingReturnAnalysis.length === 0) {
      dispatch(
        setProductSimulationRunBreakdown({
          productId: product.id,
          simulationRunBreakdown: b,
        })
      );
    }
  }, [
    specialPoolKey,
    loadingBreakdowns,
    breakdowns,
    product.id,
    dispatch,
    existingReturnAnalysis,
  ]);

  const hasTimeSeries =
    Array.isArray(product.timeSeries) && product.timeSeries.length > 0;
  const shouldRun = hasTimeSeries && !specialPoolKey;
  useFinancialAnalysis({
    product,
    benchmark: Benchmark.HODL,
    loadToSimulator: false,
    shouldRun,
  });

  const comparingProduct = useAppSelector((state) =>
    selectProductById(state, comparingProductId?.id ?? '')
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
