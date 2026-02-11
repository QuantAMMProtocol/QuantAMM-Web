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
import { ChangeEvent, RefObject, useRef, useState } from 'react';
import { SimulatorOptions } from './simulationOptions';
import runnerStyles from './simulationRunnerCommon.module.css';

const getStepStatus = (
  runStatusIndex: number
): 'wait' | 'process' | 'finish' =>
  runStatusIndex > 0 ? 'wait' : runStatusIndex === 0 ? 'process' : 'finish';

const getRunnerStepItems = (runStatusIndex: number) => [
  {
    title: 'Options',
    icon: (
      <Tooltip title="Choose your tokens and initial weights. Select which trading functions and strategies you want to test.">
        <OrderedListOutlined className={runnerStyles.infoIcon} />
      </Tooltip>
    ),
    status: getStepStatus(runStatusIndex),
  },
  {
    title: 'Pool',
    icon: (
      <Tooltip title="Choose your tokens and initial weights. Select which trading functions and strategies you want to test.">
        <PieChartOutlined className={runnerStyles.infoIcon} />
      </Tooltip>
    ),
    status: getStepStatus(runStatusIndex),
  },
  {
    title: 'Time Range',
    icon: (
      <Tooltip title="Select the time range you want to model and optionally add a time series of retail swaps.">
        <RiseOutlined className={runnerStyles.infoIcon} />
      </Tooltip>
    ),
    status: getStepStatus(runStatusIndex),
  },
  {
    title: 'Hooks',
    icon: (
      <Tooltip title="You can add swap fees as a hook to the simulation. This is useful for modeling fee changes over time. V1 allows you to import fees as a time series from an externally-calculated model.">
        <ClockCircleOutlined className={runnerStyles.infoIcon} />
      </Tooltip>
    ),
    status: getStepStatus(runStatusIndex),
  },
  {
    title: 'Final Review',
    icon: (
      <Tooltip title="Review all the settings before running the simulation.">
        <CheckCircleOutlined className={runnerStyles.infoIcon} />
      </Tooltip>
    ),
    status: getStepStatus(runStatusIndex),
  },
  {
    title: 'Run status',
    icon: (
      <Tooltip title="Provides status updates while the backend is running the simulations">
        <RedoOutlined className={runnerStyles.infoIcon} />
      </Tooltip>
    ),
    status: getStepStatus(runStatusIndex),
    disabled: runStatusIndex < 1,
  },
  {
    title: 'Results',
    icon: (
      <Tooltip title="View and compare performance of different pools and parameters in the simulation run. This includes day by day changes to see how market conditions affect rebalancing.">
        <DotChartOutlined className={runnerStyles.infoIcon} />
      </Tooltip>
    ),
    status: getStepStatus(runStatusIndex),
    disabled: runStatusIndex < 2,
  },
  {
    title: 'Save Results',
    icon: (
      <Tooltip title="You can either download a copy of the results to analyse or import at a later date. You can also save the results for comparison in the multi-run comparison tool">
        <SaveOutlined className={runnerStyles.infoIcon} />
      </Tooltip>
    ),
    status: getStepStatus(runStatusIndex),
    disabled: runStatusIndex < 2,
  },
];

function PoolConstituentSelectionStep() {
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

interface RunnerHeaderProps {
  currentStepIndex: number;
  runStatusIndex: number;
  onChange: (value: number) => void;
  onImportClick: () => void;
  onResetClick: () => void;
}

function RunnerHeader({
  currentStepIndex,
  runStatusIndex,
  onChange,
  onImportClick,
  onResetClick,
}: RunnerHeaderProps) {
  return (
    <Row className={runnerStyles.runnerHeaderRow}>
      <Col span={2} className={runnerStyles.centerAlignedCol}>
        <Button
          type="primary"
          className={styles.importResetButton}
          onClick={onImportClick}
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
          items={getRunnerStepItems(runStatusIndex)}
        ></Steps>
      </Col>
      <Col span={2} className={runnerStyles.centerAlignedCol}>
        <Button
          type="primary"
          className={styles.importResetButton}
          disabled={runStatusIndex < 2}
          onClick={onResetClick}
        >
          Reset
        </Button>
      </Col>
    </Row>
  );
}

interface ImportResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paramsFileInputRef: RefObject<HTMLInputElement>;
  resultsFileInputRef: RefObject<HTMLInputElement>;
  onParamsImportClick: () => void;
  onResultsImportClick: () => void;
  onParamsFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onResultsFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function ImportResultsModal({
  isOpen,
  onClose,
  paramsFileInputRef,
  resultsFileInputRef,
  onParamsImportClick,
  onResultsImportClick,
  onParamsFileChange,
  onResultsFileChange,
}: ImportResultsModalProps) {
  return (
    <Modal
      title="Import File or Select Balancer Pool"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
    >
      <Col span={24} className={styles.modalContent}>
        <h4>Import from File:</h4>
        <input
          type="file"
          className={runnerStyles.hiddenFileInput}
          ref={paramsFileInputRef}
          onChange={onParamsFileChange}
        />
        <Button onClick={onParamsImportClick}>
          Set Parameters to downloaded Run Params
        </Button>

        <div className={styles.orDivider}>OR</div>

        <input
          type="file"
          className={runnerStyles.hiddenFileInput}
          ref={resultsFileInputRef}
          onChange={onResultsFileChange}
        />
        <Button onClick={onResultsImportClick}>Import Results from Run</Button>
      </Col>
    </Modal>
  );
}

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

  const paramsFileInputRef = useRef<HTMLInputElement>(null);
  const resultsFileInputRef = useRef<HTMLInputElement>(null);

  const handleParamsImportClick = () => {
    paramsFileInputRef.current?.click();
  };

  const handleResultsImportClick = () => {
    resultsFileInputRef.current?.click();
  };

  function getRunnerStep(): JSX.Element {
    switch (currentStepIndex) {
      case 0:
        return <SimulatorOptions />;
      case 1:
        return <PoolConstituentSelectionStep />;
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
      <RunnerHeader
        currentStepIndex={currentStepIndex}
        runStatusIndex={runStatusIndex}
        onChange={onChange}
        onImportClick={showModal}
        onResetClick={() => {
          dispatch(resetSimulationRunner());
          dispatch(resetSims());
          dispatch(changeSimulationRunnerCurrentStepIndex(0));
          dispatch(changeSimulationRunnerCurrentRunTypeIndex(0));
        }}
      />

      <ImportResultsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        paramsFileInputRef={paramsFileInputRef}
        resultsFileInputRef={resultsFileInputRef}
        onParamsImportClick={handleParamsImportClick}
        onResultsImportClick={handleResultsImportClick}
        onParamsFileChange={(event) => handleDownloadParams(event, dispatch)}
        onResultsFileChange={(event) =>
          handleDownloadResults(event, dispatch, setForceViewResults)
        }
      />

      {getRunnerStep()}
    </div>
  );
}

export { SimulationRunner };
