import { Button, Col, Row, Steps, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  RedoOutlined,
  RiseOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import styles from '../simulationResults/simulationResultSummary.module.css';
import runnerStyles from './simulationRunnerCommon.module.css';

interface RunnerHeaderProps {
  currentStepIndex: number;
  runStatusIndex: number;
  onChange: (value: number) => void;
  onImportClick: () => void;
  onResetClick: () => void;
}

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

export function SimulationRunnerHeader({
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
