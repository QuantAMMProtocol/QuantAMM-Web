import { AppThunk } from '../../app/store';
import { useRunSimulationMutation } from '../simulationRunner/simulationRunnerService';

import { convertApiResponse } from '../simulationResults/simulationReturnCalculator';
import {
  addSimRunResults,
  startRun,
  completeRun,
  initializeSimulationsToRun,
  initializeTimeRangeToRun,
  selectSimulationRunStatusStepIndex,
  updateStatus,
  selectSimulationRunnerTimeRangeSelection,
  changeSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentRunTypeIndex,
  failRun,
} from '../simulationRunner/simulationRunnerSlice';

import { Button, Col, Row } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  ConvertToLiquidityPoolDto,
  SimulationResult,
} from '../simulationRunner/simulationRunnerDtos';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import {
  addSimplifiedSelectionsToSimulatorPools,
  selectSimulationPools,
  selectedSimplifiedPools,
  selectSelectedCoinsToAddToPool,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import runnerStyles from './simulationRunnerCommon.module.css';

export interface Success {
  data: SimulationResult;
}

export interface Failure {
  error: FetchBaseQueryError;
}

interface PoolRunButtonProps {
  simplifiedPoolRun: boolean;
}

function getFailureMessage(error: FetchBaseQueryError): string {
  if ('data' in error && typeof error.data === 'string') {
    return error.data;
  }
  if ('error' in error && typeof error.error === 'string') {
    return error.error;
  }
  return 'Simulation failed';
}

export function SimulationRunButton({ simplifiedPoolRun }: PoolRunButtonProps) {
  const dispatch = useAppDispatch();
  const [runSimulation] = useRunSimulationMutation();
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const simulationToRun = useAppSelector(selectSimulationPools);
  const simplifiedSimulations = useAppSelector(selectedSimplifiedPools);
  const simplifiedCoinsToAdd = useAppSelector(selectSelectedCoinsToAddToPool);
  const currentTimeRangeSelection = useAppSelector(
    selectSimulationRunnerTimeRangeSelection
  );

  const runSimulationsThunk =
    (runTimeRange: string): AppThunk =>
    async (dispatch, getState) => {
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

              const convertedData = convertApiResponse(success.data);

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
                  errorMessage:
                    error instanceof Error ? error.message : String(error),
                })
              );
            }
          }
        })
      );

      dispatch(updateStatus('Complete'));
      dispatch(changeSimulationRunnerCurrentStepIndex(6));
    };

  return (
    <Col span={24}>
      <Row hidden={currentTimeRangeSelection !== 'custom'}>
        <Col span={24}>
          <div className={runnerStyles.paddingTop15}>
            <Button
              type="primary"
              size="large"
              className={runnerStyles.greenButton}
              disabled={
                runStatusIndex === 2 ||
                (simplifiedPoolRun
                  ? simplifiedSimulations.length === 0 ||
                    simplifiedCoinsToAdd.length === 0
                  : simulationToRun.length === 0)
              }
              onClick={() => {
                if (simplifiedPoolRun) {
                  dispatch(addSimplifiedSelectionsToSimulatorPools());
                }
                dispatch(changeSimulationRunnerCurrentStepIndex(5));
                dispatch(changeSimulationRunnerCurrentRunTypeIndex(1));
                dispatch(runSimulationsThunk('custom'));
              }}
            >
              Run Simulation
            </Button>
          </div>
        </Col>
      </Row>
    </Col>
  );
}
