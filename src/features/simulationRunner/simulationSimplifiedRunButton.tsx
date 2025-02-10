import { AppThunk } from '../../app/store';
import { useRunSimulationMutation } from './simulationRunnerService';

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
} from './simulationRunnerSlice';

import { Button, Col, Row } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  ConvertToLiquidityPoolDto,
  SimulationResult,
} from './simulationRunnerDtos';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

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

export function SimulationSimplifiedRunButton() {
  const dispatch = useAppDispatch();
  const [runSimulation] = useRunSimulationMutation();
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const currentTimeRangeSelection = useAppSelector(
    selectSimulationRunnerTimeRangeSelection
  );

  //import disabled given that v3 api has not been released yet
  //const { data: balancerPools, loading: poolsLoading } =
  //  useFetchProductListData();

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

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
          const poolsToRun = getState().simConfig.simulationLiquidityPools;

          dispatch(initializeSimulationsToRun({ pools: poolsToRun }));
          await Promise.all(
            getState().simRunner.runTimePeriodRanges.map(async (x) => {
              const simulationsToRun = getState().simRunner.simulationsToRun;
              for (const sim of simulationsToRun) {
                let targetSim = sim;
                dispatch(startRun({ pool: targetSim, timeRange: x }));
                targetSim = getState().simRunner.simulationsToRun.find(
                  (x) => sim.id == x.id
                )!;

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
                        feeHooks: targetSim.feeHooks,
                        swapImports: targetSim.swapImports,
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
                        id: sim.id,
                        timeRangeName: x.name,
                        errorMessage: e.toString(),
                      })
                    );
                    continue;
                  }
                }
                //Import disabled given that v3 api has not been released yet
                //else if (sim.poolType.name == 'LIVE') {
                //  const selectedPoolData as ProductDto = balancerPools.find(
                //    dispatch(
                //      useFinancialAnalysis({
                //        product: selectedPoolData!,
                //        benchmark: Benchmark.HODL,
                //        loadToSimulator: true,
                //      })
                //    );
                //      benchmark: Benchmark.HODL,
                //      loadToSimulator: true,
                //    });
                //  }
                //}
              }
            })
          );

          dispatch(updateStatus('Complete'));
          dispatch(changeSimulationRunnerCurrentStepIndex(6));
        }, 10);
      }
    };

  return (
    <Col span={24}>
      <Row hidden={currentTimeRangeSelection != 'custom'}>
        <Col span={24}>
          <div style={{ padding: 10 }}>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: 'green' }}
              disabled={runStatusIndex == 2}
              onClick={() => {
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
