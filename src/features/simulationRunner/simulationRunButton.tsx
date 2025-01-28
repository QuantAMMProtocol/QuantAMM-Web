import { AppThunk } from '../../app/store';
import { useRunSimulationMutation } from '../simulationRunner/simulationRunnerService';

import { convertApiResponse } from '../simulationResults/simulationReturnCalculator';
import { LiquidityPool } from '../simulationRunConfiguration/simulationRunConfigModels';

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

export interface Success {
  data: SimulationResult;
}

export interface Failure {
  error: FetchBaseQueryError;
}

export interface RunSetting {
  pool: LiquidityPool;
  startDate: number;
  endDate: number;
}

interface PoolRunButtonProps {
  simplifiedPoolRun: boolean;
}

export function SimulationRunButton(simplifiedPoolRun: PoolRunButtonProps) {
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
    (dispatch, getState) => {
      if (getState().simRunner.simulationRunStatus == 'Pending') {
        dispatch(
          initializeTimeRangeToRun({
            name: runTimeRange,
            custStartDate: getState().simConfig.startDate,
            custEndDate: getState().simConfig.endDate,
          })
        );

        dispatch(updateStatus('Running'));

        setTimeout(() => {
          const runSimulations = async () => {
            const poolsToRun = getState().simConfig.simulationLiquidityPools;

            dispatch(initializeSimulationsToRun({ pools: poolsToRun }));
            await Promise.all(
              getState().simRunner.runTimePeriodRanges.map(async (x) => {
                const simulationsToRun = getState().simRunner.simulationsToRun;
                for (const targetSim of simulationsToRun) {
                  dispatch(startRun({ pool: targetSim, timeRange: x }));

                  if (targetSim.updateRule.updateRuleRunUrl != undefined) {
                    try {
                      const response = await runSimulation({
                        url: targetSim.updateRule.updateRuleRunUrl,
                        simulationRunDto: {
                          startUnix: new Date(x.startDate).getTime(),
                          endUnix: new Date(x.endDate).getTime(),
                          pool: ConvertToLiquidityPoolDto(targetSim),
                          startDateString: x.startDate,
                          endDateString: x.endDate,
                          swapImports: targetSim.swapImports,
                          feeHooks: targetSim.feeHooks,
                          gasPriceImports: getState().simConfig.gasPriceImport,
                        },
                      });

                      const success = response as Success;
                      if (success.data == undefined) {
                        const error = response as Failure;
                        dispatch(
                          failRun({
                            id: targetSim.id,
                            timeRangeName: x.name,
                            errorMessage: error.error.data as string,
                          })
                        );
                        continue;
                      }

                      // Convert API response to required format
                      const convertedData = convertApiResponse(success.data);

                      dispatch(
                        addSimRunResults({
                          id: {
                            runId: targetSim?.id ?? 'unknown',
                            timeRangeName: x.name,
                          },
                          results: convertedData.results,
                          analysisResults: convertedData.analysisResults,
                        })
                      );
                      dispatch(
                        completeRun({
                          id: targetSim?.id ?? 'unknown',
                          timeRangeName: x.name,
                        })
                      );
                    } catch (e: any) {
                      console.log(e);
                      dispatch(
                        failRun({
                          id: targetSim.id,
                          timeRangeName: x.name,
                          errorMessage: e.toString(),
                        })
                      );
                      continue;
                    }
                  }
                }
              })
            );

            dispatch(updateStatus('Complete'));
            dispatch(changeSimulationRunnerCurrentStepIndex(6));
          };

          void runSimulations();
        }, 10);
      }
    };

  return (
    <Col span={24}>
      <Row hidden={currentTimeRangeSelection != 'custom'}>
        <Col span={24}>
          <div style={{ paddingTop: 15 }}>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: 'green' }}
              disabled={
                runStatusIndex == 2 ||
                !(
                  (simplifiedPoolRun && simulationToRun.length != 0) ||
                  (simplifiedPoolRun &&
                    simplifiedSimulations.length != 0 &&
                    simplifiedCoinsToAdd.length != 0)
                )
              }
              onClick={() => {
                if (simplifiedPoolRun) {
                  dispatch(addSimplifiedSelectionsToSimulatorPools());
                }
                dispatch(changeSimulationRunnerCurrentStepIndex(5));
                dispatch(changeSimulationRunnerCurrentRunTypeIndex(1));
                dispatch(runSimulationsThunk('custom'));
                dispatch(
                  changeSimulationRunnerCurrentStepIndex(
                    runStatusIndex == 2 ? 6 : 5
                  )
                );
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
