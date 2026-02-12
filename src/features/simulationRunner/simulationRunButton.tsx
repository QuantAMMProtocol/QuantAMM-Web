import { useRunSimulationMutation } from '../simulationRunner/simulationRunnerService';

import { convertApiResponse } from '../simulationResults/simulationReturnCalculator';
import {
  selectSimulationRunStatusStepIndex,
  selectSimulationRunnerTimeRangeSelection,
  changeSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentRunTypeIndex,
} from '../simulationRunner/simulationRunnerSlice';

import { Button, Col, Row } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addSimplifiedSelectionsToSimulatorPools,
  selectSimulationPools,
  selectedSimplifiedPools,
  selectSelectedCoinsToAddToPool,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import runnerStyles from './simulationRunnerCommon.module.css';
import { createRunSimulationsThunk } from './simulationRunButton.logic';

interface PoolRunButtonProps {
  simplifiedPoolRun: boolean;
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
                void dispatch(
                  createRunSimulationsThunk({
                    runTimeRange: 'custom',
                    runSimulation,
                    convertResponse: convertApiResponse,
                  })
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
