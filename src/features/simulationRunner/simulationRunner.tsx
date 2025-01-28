import styles from '../simulationResults/simulationResultSummary.module.css';
import {
  selectSimulationRunBreakdowns,
  selectSimulationRunStatusStepIndex,
  selectSimulationRunnerCurrentRunTypeIndex,
  selectSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentStepIndex,
  changeSimulationRunnerCurrentRunTypeIndex,
  resetSimulationRunner,
} from './simulationRunnerSlice';

import { Button, Col, Divider, Row, Steps, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
  InfoCircleOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  RedoOutlined,
  RiseOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetSims } from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { SimulationRunnerTimePeriodStep } from './simulationRunnerTimePeriodStep';
import { SimulationRunnerHookTimePeriodStep } from './simulationRunnerHookTimePeriodStep';

import { SimulationRunnerFinalReviewStep } from './simulationRunnerFinalReviewStep';
import { PoolRuleConfiguration } from '../simulationRunConfiguration/poolRuleConfiguration';
import { SimulationResultsSummaryStep } from '../simulationResults/simulationResultsSummaryStep';
import { SimulationResultSaveToCompareTab } from '../simulationResults/simulationResultSaveToCompareTab';
import { SimulationRunnerHistoricInProgress } from './simulationRunnerHistoricInProgress';
import { SimulatorOptions } from './simulationOptions';

export function SimulationRunner() {
  const dispatch = useAppDispatch();

  const results = useAppSelector(selectSimulationRunBreakdowns);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const runTypeIndex = useAppSelector(
    selectSimulationRunnerCurrentRunTypeIndex
  );

  const currentStepIndex = useAppSelector(
    selectSimulationRunnerCurrentStepIndex
  );

  const onChange = (value: number) => {
    if (value == 5 && runStatusIndex != 2) {
      return;
    }

    dispatch(changeSimulationRunnerCurrentStepIndex(value));
  };

  function getPoolConstituentSelectionStep(): JSX.Element {
    return (
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <Row>
            <Col span={8}>
              <Divider>
                1. Choose Pool Constituents
                <Tooltip title="Pool constituents need to be selected. The TVL can be modified to change the starting weights.">
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
            </Col>
            <Col span={8}>
              <Divider>
                2. Choose Pools
                <Tooltip title="Balancer-v3 can run various pool invariants and dynamic AMM types. Select those AMM types you would like to simulate here.">
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
            </Col>
            <Col span={8}>
              <Divider>
                3. Review Selected Pools
                <Tooltip title="Review the pools you have configured and delete any that you do not want to run.">
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
            </Col>
          </Row>
        </Col>

        <Col span={1}></Col>
        <Col span={1}></Col>
        <Col span={22}>
          <PoolRuleConfiguration />
        </Col>
        <Col span={1}></Col>
      </Row>
    );
  }

  function getRunnerStep(): JSX.Element {
    switch (currentStepIndex) {
      case 0:
        return <SimulatorOptions />;
      case 1:
        return getPoolConstituentSelectionStep();
      case 2:
        return <SimulationRunnerTimePeriodStep />;
      case 3:
        return <SimulationRunnerHookTimePeriodStep />;
      case 4:
        return <SimulationRunnerFinalReviewStep />;
      case 5:
        if (runTypeIndex == 1) {
          return <SimulationRunnerHistoricInProgress />;
        } else if (runTypeIndex == 2) {
          return <div>Traning progress</div>;
        } else {
          return <SimulationRunnerFinalReviewStep />;
        }
      case 6:
        return (
          <SimulationResultsSummaryStep
            breakdowns={results}
            forceViewResults={false}
          />
        );
      case 7:
        return (
          <SimulationResultSaveToCompareTab
            breakdowns={results}
            forceViewResults={false}
          />
        );
    }
    return <div></div>;
  }

  return (
    <div>
      <Row style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
        <Col
          span={2}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            type="primary"
            className={styles.importResetButton}
            disabled={true}
          >
            Import
          </Button>
        </Col>

        <Col span={20}>
          <Steps
            current={currentStepIndex}
            onChange={onChange}
            type="navigation"
            size="small"
            items={[
              {
                title: 'Options',
                icon: (
                  <Tooltip title="Choose your tokens and initial weights. Select which trading functions and strategies you want to test.">
                    <OrderedListOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex == 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Pool',
                icon: (
                  <Tooltip title="Choose your tokens and initial weights. Select which trading functions and strategies you want to test.">
                    <PieChartOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex == 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Time Range',
                icon: (
                  <Tooltip title="Select the time range you want to model and optionally add a time series of retail swaps.">
                    <RiseOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex == 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Hooks',
                icon: (
                  <Tooltip title="You can add swap fees as a hook to the simulation. This is useful for modeling fee changes over time. V1 allows you to import fees as a time series from an externally-calculated model.">
                    <ClockCircleOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex == 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Final Review',
                icon: (
                  <Tooltip title="Review all the settings before running the simulation.">
                    <CheckCircleOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex == 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Run status',
                icon: (
                  <Tooltip title="Provides status updates while the backend is running the simulations">
                    <RedoOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex == 0
                      ? 'process'
                      : 'finish',
                disabled: runStatusIndex < 1,
              },
              {
                title: 'Results',
                icon: (
                  <Tooltip title="View and compare performance of different pools and parameters in the simulation run. This includes day by day changes to see how market conditions affect rebalancing.">
                    <DotChartOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex == 0
                      ? 'process'
                      : 'finish',
                disabled: runStatusIndex < 2,
              },
              {
                title: 'Save Results',
                icon: (
                  <Tooltip title="You can either download a copy of the results to analyse or import at a later date. You can also save the results for comparison in the multi-run comparison tool">
                    <SaveOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex == 0
                      ? 'process'
                      : 'finish',
                disabled: runStatusIndex < 2,
              },
            ]}
          ></Steps>
        </Col>
        <Col
          span={2}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            type="primary"
            className={styles.importResetButton}
            disabled={runStatusIndex < 2}
            onClick={() => {
              dispatch(resetSimulationRunner());
              dispatch(resetSims());
              dispatch(changeSimulationRunnerCurrentStepIndex(0));
              dispatch(changeSimulationRunnerCurrentRunTypeIndex(0));
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      {getRunnerStep()}
    </div>
  );
}
