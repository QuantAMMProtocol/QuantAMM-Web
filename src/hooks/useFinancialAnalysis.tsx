import { useEffect } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '../app/hooks';
import { Benchmark, FinancialAnalysisResultDto, Product } from '../models';
import { useRunFinancialAnalysisMutation } from '../services';
import {
  loadingSimulationRunBreakdown,
  setProductSimulationRunBreakdown,
} from '../features/productExplorer/productExplorerSlice';
import { addImportedSimRunResults } from '../features/simulationRunner/simulationRunnerSlice';
import { CURRENT_LIVE_FACTSHEETS } from '../features/documentation/factSheets/liveFactsheets';
import { Chain } from '../features/simulationRunConfiguration/simulationRunConfigModels';

export type Success =
  | { data: FinancialAnalysisResultDto; error?: never }
  | { data?: never; error: FetchBaseQueryError | SerializedError | Error };

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
          const portfolioReturns = ts
            .map((step, i) => {
            if (i === 0) {
              return [step.timestamp * 1000, 0, 0];
            }
            const prevStep = ts[i - 1];
            if (!prevStep) {
              return null;
            }
            const portfolio_return =
              (step.sharePrice - prevStep?.sharePrice) / prevStep?.sharePrice;
            const hodl_return =
              (step.hodlSharePrice - prevStep?.hodlSharePrice) /
              prevStep?.hodlSharePrice;

            return [step.timestamp * 1000, portfolio_return, hodl_return];
          })
            .filter(
              (
                portfolioReturn
              ): portfolioReturn is [number, number, number] =>
                portfolioReturn !== null
            );

          const tokens = [...(product.poolConstituents.map((pc) => pc.coin) ?? [])];
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
          const simBreakdown = {
            simulationRunResultAnalysis: success.data.analysis,
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
          };
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
