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

  useEffect(() => {
    const fetchFinancialAnalysis = async () => {
      let success: Success | undefined;

      if (!product || !shouldRun) {
        return;
      }

      try {
        dispatch(loadingSimulationRunBreakdown(product.id));
        if (
          (product?.timeSeries?.length ?? 0) > 0 &&
          product?.timeSeries?.[0]?.timestamp
        ) {
          product?.timeSeries[product?.timeSeries.length - 1].timestamp;

          const portfolioReturns = product?.timeSeries?.map((step, i) => {
            if (i === 0) {
              return [step.timestamp * 1000, 0, 0];
            }
            const prevStep = product?.timeSeries?.[i - 1];
            if (!prevStep) {
              return null;
            }
            const portfolio_return =
              (step.sharePrice - prevStep?.sharePrice) / prevStep?.sharePrice;
            const hodl_return =
              (step.hodlSharePrice - prevStep?.hodlSharePrice) /
              prevStep?.hodlSharePrice;

            return [step.timestamp * 1000, portfolio_return, hodl_return];
          });

          const tokens = [
            ...(product?.poolConstituents.map((pc) => pc.coin) ?? []),
          ];

          const result = await runFinancialAnalysis({
            request: {
              startDateString: product?.timeSeries[0].timestamp
                ? new Date(
                    product.timeSeries[0].timestamp * 1000
                  ).toLocaleString()
                : '',
              endDateString: product?.timeSeries[product?.timeSeries.length - 1]
                .timestamp
                ? new Date(
                    product.timeSeries[product.timeSeries.length - 1]
                      .timestamp * 1000
                  ).toLocaleString()
                : '',
              tokens: tokens,
              returns:
                portfolioReturns.filter(
                  (portfolioReturn) => portfolioReturn !== null
                ) ?? [],
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
            addImportedSimRunResults(simBreakdown);
          }
        }
      } catch (error) {
        console.error('Error running financial analysis:', error);
      }
    };

    void fetchFinancialAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRun]);
};
