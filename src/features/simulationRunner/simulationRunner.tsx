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

import { Button, Col, Divider, Row, Steps, Modal, Tooltip } from 'antd';
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
import {
  resetSims,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { SimulationRunnerTimePeriodStep } from './simulationRunnerTimePeriodStep';
import { SimulationRunnerHookTimePeriodStep } from './simulationRunnerHookTimePeriodStep';
import {
  handleDownloadResults,
  handleDownloadParams,
} from './SimulationHelper/index';

import { SimulationRunnerFinalReviewStep } from './simulationRunnerFinalReviewStep';
import { PoolRuleConfiguration } from '../simulationRunConfiguration/poolRuleConfiguration';
import { SimulationResultsSummaryStep } from '../simulationResults/simulationResultsSummaryStep';
import { SimulationResultSaveToCompareTab } from '../simulationResults/simulationResultSaveToCompareTab';
import { SimulationRunnerHistoricInProgress } from './simulationRunnerHistoricInProgress';
import { useRef, useState } from 'react';
import { SimulatorOptions } from './simulationOptions';
import runnerStyles from './simulationRunnerCommon.module.css';


//TODO CH split into subcomponents
export default function SimulationRunner() {
  const dispatch = useAppDispatch();

  const results = useAppSelector(selectSimulationRunBreakdowns);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const runTypeIndex = useAppSelector(
    selectSimulationRunnerCurrentRunTypeIndex
  );

  const currentStepIndex = useAppSelector(
    selectSimulationRunnerCurrentStepIndex
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forceViewResults, setForceViewResults] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const onChange = (value: number) => {
    if (value === 5 && runStatusIndex !== 2) {
      return;
    }

    dispatch(changeSimulationRunnerCurrentStepIndex(value));
  };

  const paramsFileInputRef = useRef<HTMLInputElement | null>(null);
  const resultsFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleParamsImportClick = () => {
    paramsFileInputRef.current?.click();
  };

  const handleResultsImportClick = () => {
    resultsFileInputRef.current?.click();
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
                  <InfoCircleOutlined className={runnerStyles.infoIcon} />
                </Tooltip>
              </Divider>
            </Col>
            <Col span={8}>
              <Divider>
                2. Choose Pools
                <Tooltip title="Balancer-v3 can run various pool invariants and dynamic AMM types. Select those AMM types you would like to simulate here.">
                  <InfoCircleOutlined className={runnerStyles.infoIcon} />
                </Tooltip>
              </Divider>
            </Col>
            <Col span={8}>
              <Divider>
                3. Review Selected Pools
                <Tooltip title="Review the pools you have configured and delete any that you do not want to run.">
                  <InfoCircleOutlined className={runnerStyles.infoIcon} />
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
        if (runTypeIndex === 1) {
          return <SimulationRunnerHistoricInProgress />;
        } else if (runTypeIndex === 2) {
          return <div>Training progress</div>;
        } else {
          return <SimulationRunnerFinalReviewStep />;
        }
      case 6:
        return (
          <SimulationResultsSummaryStep
            breakdowns={results}
            forceViewResults={forceViewResults}
          />
        );
      case 7:
        return (
          <SimulationResultSaveToCompareTab
            breakdowns={results}
            forceViewResults={false}
          />
        );
      default:
        return <div />;
    }
  }

  return (
    <div>
      <Row className={runnerStyles.runnerHeaderRow}>
        <Col span={2} className={runnerStyles.centerAlignedCol}>
          <Button
            type="primary"
            className={styles.importResetButton}
            onClick={showModal}
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
                    <OrderedListOutlined className={runnerStyles.infoIcon} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex === 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Pool',
                icon: (
                  <Tooltip title="Choose your tokens and initial weights. Select which trading functions and strategies you want to test.">
                    <PieChartOutlined className={runnerStyles.infoIcon} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex === 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Time Range',
                icon: (
                  <Tooltip title="Select the time range you want to model and optionally add a time series of retail swaps.">
                    <RiseOutlined className={runnerStyles.infoIcon} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex === 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Hooks',
                icon: (
                  <Tooltip title="You can add swap fees as a hook to the simulation. This is useful for modeling fee changes over time. V1 allows you to import fees as a time series from an externally-calculated model.">
                    <ClockCircleOutlined className={runnerStyles.infoIcon} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex === 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Final Review',
                icon: (
                  <Tooltip title="Review all the settings before running the simulation.">
                    <CheckCircleOutlined className={runnerStyles.infoIcon} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex === 0
                      ? 'process'
                      : 'finish',
              },
              {
                title: 'Run status',
                icon: (
                  <Tooltip title="Provides status updates while the backend is running the simulations">
                    <RedoOutlined className={runnerStyles.infoIcon} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex === 0
                      ? 'process'
                      : 'finish',
                disabled: runStatusIndex < 1,
              },
              {
                title: 'Results',
                icon: (
                  <Tooltip title="View and compare performance of different pools and parameters in the simulation run. This includes day by day changes to see how market conditions affect rebalancing.">
                    <DotChartOutlined className={runnerStyles.infoIcon} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex === 0
                      ? 'process'
                      : 'finish',
                disabled: runStatusIndex < 2,
              },
              {
                title: 'Save Results',
                icon: (
                  <Tooltip title="You can either download a copy of the results to analyse or import at a later date. You can also save the results for comparison in the multi-run comparison tool">
                    <SaveOutlined className={runnerStyles.infoIcon} />
                  </Tooltip>
                ),
                status:
                  runStatusIndex > 0
                    ? 'wait'
                    : runStatusIndex === 0
                      ? 'process'
                      : 'finish',
                disabled: runStatusIndex < 2,
              },
            ]}
          ></Steps>
        </Col>
        <Col span={2} className={runnerStyles.centerAlignedCol}>
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

      <Modal
        title="Import File or Select Balancer Pool"
        open={isModalOpen}
        onOk={closeModal}
        onCancel={closeModal}
      >
        <Col span={24} className={styles.modalContent}>
          <h4>Import from File:</h4>
          <input
            type="file"
            className={runnerStyles.hiddenFileInput}
            ref={paramsFileInputRef}
            onChange={(event) => handleDownloadParams(event, dispatch)}
          />
          <Button onClick={handleParamsImportClick}>
            Set Parameters to downloaded Run Params
          </Button>

          <div className={styles.orDivider}>OR</div>

          <input
            type="file"
            className={runnerStyles.hiddenFileInput}
            ref={resultsFileInputRef}
            onChange={(event) =>
              handleDownloadResults(event, dispatch, setForceViewResults)
            }
          />
          <Button onClick={handleResultsImportClick}>
            Import Results from Run
          </Button>

        </Col>
      </Modal>

      {getRunnerStep()}
    </div>
  );
}

export { SimulationRunner };
