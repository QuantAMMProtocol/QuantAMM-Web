import { useEffect } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '../app/hooks';
import {
  Benchmark,
  FinancialAnalysisResultDto,
  Product,
  TimeSeriesData,
} from '../models';
import { useRunFinancialAnalysisMutation } from '../services';
import {
  loadingSimulationRunBreakdown,
  setProductSimulationRunBreakdown,
} from '../features/productExplorer/productExplorerSlice';
import { addImportedSimRunResults } from '../features/simulationRunner/simulationRunnerSlice';
import { CURRENT_LIVE_FACTSHEETS } from '../features/documentation/factSheets/liveFactsheets';
import { Chain } from '../features/simulationRunConfiguration/simulationRunConfigModels';
import { SimulationRunBreakdown } from '../features/simulationResults/simulationResultSummaryModels';

export type Success =
  | { data: FinancialAnalysisResultDto; error?: never }
  | { data?: never; error: FetchBaseQueryError | SerializedError | Error };

export const buildPortfolioReturns = (timeSeries: TimeSeriesData[]) =>
  timeSeries
    .map((step, i) => {
      if (i === 0) {
        return [step.timestamp * 1000, 0, 0] as [number, number, number];
      }

      const prevStep = timeSeries[i - 1];
      if (!prevStep) {
        return null;
      }

      const portfolioReturn =
        (step.sharePrice - prevStep.sharePrice) / prevStep.sharePrice;
      const hodlReturn =
        (step.hodlSharePrice - prevStep.hodlSharePrice) /
        prevStep.hodlSharePrice;

      return [step.timestamp * 1000, portfolioReturn, hodlReturn] as [
        number,
        number,
        number,
      ];
    })
    .filter(
      (portfolioReturn): portfolioReturn is [number, number, number] =>
        portfolioReturn !== null
    );

export const buildFinancialAnalysisBreakdown = ({
  product,
  analysis,
}: {
  product: Product;
  analysis: FinancialAnalysisResultDto['analysis'];
}): SimulationRunBreakdown => ({
  simulationRunResultAnalysis: analysis,
  simulationRun: {
    id: product.id,
    enableAutomaticArbBots: false,
    poolNumeraireCoinCode: '',
    poolConstituents: [],
    updateRule: {
      updateRuleName: product.name,
      updateRuleKey: product.id,
      updateRuleParameters: [],
      updateRuleResultProfileSummary: '',
      heatmapKeys: [],
      updateRuleRunUrl: '',
      updateRuleTrainUrl: '',
      updateRuleSimKey: '',
      applicablePoolTypes: [],
      chainDeploymentDetails: new Map<Chain, string>(),
    },
    runStatus: 'completed',
    name: product.name,
    feeHooks: [],
    swapImports: [],
    poolType: {
      name: 'LIVE',
      mandatoryProperties: [],
      shortDescription: 'live product pool',
      requiresPoolNumeraire: false,
    },
  },
  flatSimulationRunResult: undefined,
  simulationRunStatus: 'Complete',
  simulationComplete: true,
  timeSteps: [],
  timeRange: {
    name: 'live',
    startDate: product.createTime,
    endDate: product.createTime,
  },
});

export const useFinancialAnalysis = ({
  product,
  benchmark,
  loadToSimulator,
  shouldRun,
}: {
  product: Product | null;
  benchmark: Benchmark;
  loadToSimulator: boolean;
  shouldRun: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [runFinancialAnalysis] = useRunFinancialAnalysisMutation();
  const livePools = CURRENT_LIVE_FACTSHEETS;
  const hasCacheForProduct = livePools.factsheets.some(
    (x) => x.poolId === (product?.id ?? '')
  );

  useEffect(() => {
    const fetchFinancialAnalysis = async () => {
      let success: Success | undefined;

      if (!product || !shouldRun) {
        return;
      }
      try {
        const ts = product.timeSeries ?? [];
        const hasValidTimeseries = ts.length > 0 && !!ts[0]?.timestamp;

        if (!hasCacheForProduct && hasValidTimeseries) {
          dispatch(loadingSimulationRunBreakdown(product.id));
        }

        if (!hasCacheForProduct && hasValidTimeseries) {
          const portfolioReturns = buildPortfolioReturns(ts);

          const tokens = [
            ...(product.poolConstituents.map((pc) => pc.coin) ?? []),
          ];
          const startTimestamp = ts[0]?.timestamp;
          const endTimestamp = ts[ts.length - 1]?.timestamp;

          const result = await runFinancialAnalysis({
            request: {
              startDateString: startTimestamp
                ? new Date(startTimestamp * 1000).toLocaleString()
                : '',
              endDateString: endTimestamp
                ? new Date(endTimestamp * 1000).toLocaleString()
                : '',
              tokens: tokens,
              returns: portfolioReturns,
              benchmarks: [benchmark],
            },
          });

          if ('data' in result && result.data !== null) {
            success = { data: result.data };
          } else {
            success = {
              error:
                'data' in result
                  ? new Error('Null data received')
                  : result.error,
            };
          }
        }

        if (success?.data && product) {
          const simBreakdown = buildFinancialAnalysisBreakdown({
            product,
            analysis: success.data.analysis,
          });
          dispatch(
            setProductSimulationRunBreakdown({
              productId: product.id,
              simulationRunBreakdown: simBreakdown,
            })
          );

          if (loadToSimulator) {
            dispatch(addImportedSimRunResults(simBreakdown));
          }
        }
      } catch (error) {
        console.error('Error running financial analysis:', error);
      }
    };

    void fetchFinancialAnalysis();
  }, [
    benchmark,
    loadToSimulator,
    shouldRun,
    hasCacheForProduct,
    product?.id,
    product?.timeSeries?.length,
    runFinancialAnalysis,
    dispatch,
    product,
  ]);
};
