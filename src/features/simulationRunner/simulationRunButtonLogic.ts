import { AppThunk } from '../../app/store';
import {
  ConvertToLiquidityPoolDto,
  SimulationResult,
  SimulationResultAnalysisDto,
  SimulationRunDto,
} from './simulationRunnerDtos';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import {
  addSimRunResults,
  changeSimulationRunnerCurrentStepIndex,
  completeRun,
  failRun,
  initializeSimulationsToRun,
  initializeTimeRangeToRun,
  startRun,
  updateStatus,
} from './simulationRunnerSlice';
import { SimulationRunLiquidityPoolSnapshot } from '../simulationResults/simulationResultSummaryModels';

interface Success {
  data: SimulationResult;
}

interface Failure {
  error: FetchBaseQueryError;
}

interface ConvertedApiResponse {
  results: SimulationRunLiquidityPoolSnapshot[];
  analysisResults: SimulationResultAnalysisDto;
}

export type RunSimulationInvoker = (payload: {
  url: string;
  simulationRunDto: SimulationRunDto;
}) => Promise<unknown>;

export function getFailureMessage(error: FetchBaseQueryError): string {
  if ('data' in error && typeof error.data === 'string') {
    return error.data;
  }
  if ('error' in error && typeof error.error === 'string') {
    return error.error;
  }
  return 'Simulation failed';
}

export const createRunSimulationsThunk = ({
  runTimeRange,
  runSimulation,
  convertResponse,
}: {
  runTimeRange: string;
  runSimulation: RunSimulationInvoker;
  convertResponse: (result: SimulationResult) => ConvertedApiResponse;
}): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    if (getState().simRunner.simulationRunStatus !== 'Pending') {
      return;
    }

    dispatch(
      initializeTimeRangeToRun({
        name: runTimeRange,
        custStartDate: getState().simConfig.startDate,
        custEndDate: getState().simConfig.endDate,
      })
    );

    dispatch(updateStatus('Running'));

    const poolsToRun = getState().simConfig.simulationLiquidityPools;
    dispatch(initializeSimulationsToRun({ pools: poolsToRun }));

    await Promise.all(
      getState().simRunner.runTimePeriodRanges.map(async (timeRange) => {
        const simulationsToRun = getState().simRunner.simulationsToRun;
        for (const targetSim of simulationsToRun) {
          dispatch(startRun({ pool: targetSim, timeRange }));

          if (!targetSim.updateRule.updateRuleRunUrl) {
            continue;
          }

          try {
            const response = await runSimulation({
              url: targetSim.updateRule.updateRuleRunUrl,
              simulationRunDto: {
                startUnix: new Date(timeRange.startDate).getTime(),
                endUnix: new Date(timeRange.endDate).getTime(),
                pool: ConvertToLiquidityPoolDto(targetSim),
                startDateString: timeRange.startDate,
                endDateString: timeRange.endDate,
                swapImports: targetSim.swapImports,
                feeHooks: targetSim.feeHooks,
                gasPriceImports: getState().simConfig.gasPriceImport,
              },
            });

            const success = response as Success;
            if (success.data === undefined) {
              const error = response as Failure;
              dispatch(
                failRun({
                  id: targetSim.id,
                  timeRangeName: timeRange.name,
                  errorMessage: getFailureMessage(error.error),
                })
              );
              continue;
            }

            const convertedData = convertResponse(success.data);

            dispatch(
              addSimRunResults({
                id: {
                  runId: targetSim.id,
                  timeRangeName: timeRange.name,
                },
                results: convertedData.results,
                analysisResults: convertedData.analysisResults,
              })
            );
            dispatch(
              completeRun({
                id: targetSim.id,
                timeRangeName: timeRange.name,
              })
            );
          } catch (error) {
            dispatch(
              failRun({
                id: targetSim.id,
                timeRangeName: timeRange.name,
                errorMessage: error instanceof Error ? error.message : String(error),
              })
            );
          }
        }
      })
    );

    dispatch(updateStatus('Complete'));
    dispatch(changeSimulationRunnerCurrentStepIndex(6));
  };
};
