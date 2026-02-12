import styles from '../simulationResults/simulationResultSummary.module.css';

import { LiquidityPool } from '../simulationRunConfiguration/simulationRunConfigModels';

import {
  selectSimulationRunStatusStepIndex,
  selectSimulationRunnerTimeRangeSelection,
} from '../simulationRunner/simulationRunnerSlice';

import { Col, Divider, Row } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  removeSim,
  selectCoinPriceDataLoaded,
  selectEndDate,
  selectSimulationPools,
  selectStartDate,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { SimulationResult } from '../simulationRunner/simulationRunnerDtos';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { SimulationRunnerPoolSummary } from './sections/simulationRunnerPoolSummary';
import { SimulationRunnerHistoricRunReview } from './sections/simulationRunnerHistoricRunReview';

export interface Success {
  data: SimulationResult;
}

export interface Failure {
  error: FetchBaseQueryError;
}

export interface RunSetting {
  pool: LiquidityPool;
}

export function SimulationRunnerFinalReviewStep() {
  const dispatch = useAppDispatch();
  const configuredPools = useAppSelector(selectSimulationPools);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const currentTimeRangeSelection = useAppSelector(
    selectSimulationRunnerTimeRangeSelection
  );
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);

  const uniqueUpdateRules = useMemo(
    () =>
      Array.from(
        new Set(configuredPools.map((pool) => pool.updateRule.updateRuleName))
      ),
    [configuredPools]
  );

  return (
    <Row className={styles.simRunSection}>
      <Col span={12}>
        <Row>
          <Col span={24}>
            <Divider>Constituents and Update Rules</Divider>
            <h4 hidden={configuredPools.length > 0}>
              No simulations have been selected to run
            </h4>
            {uniqueUpdateRules.map((x) => {
              return (
                <div key={x}>
                  {configuredPools
                    .filter((y) => y.updateRule.updateRuleName === x)
                    .map((z) => (
                      <SimulationRunnerPoolSummary
                        key={z.id}
                        updateRuleName={x}
                        pool={z}
                        coinDataLoaded={coinDataLoaded}
                        runStatusIndex={runStatusIndex}
                        onRemovePool={(poolId) => {
                          dispatch(removeSim(poolId));
                        }}
                      />
                    ))}
                </div>
              );
            })}
          </Col>
        </Row>
      </Col>
      <Col span={1}></Col>
      <Col span={11}>
        <SimulationRunnerHistoricRunReview
          startDate={startDate}
          endDate={endDate}
          currentTimeRangeSelection={currentTimeRangeSelection}
        />
      </Col>
    </Row>
  );
}
