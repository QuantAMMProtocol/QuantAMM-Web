import { Button, Steps, Tooltip } from 'antd';
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
import runnerStyles from '../simulationRunnerCommon.module.css';

interface RunnerHeaderProps {
  currentStepIndex: number;
  hasRunStarted: boolean;
  hasResults: boolean;
  onChange: (value: number) => void;
  onImportClick: () => void;
  onResetClick: () => void;
  resetDisabled: boolean;
}

function getRunnerStepItems({
  hasRunStarted,
  hasResults,
}: {
  hasRunStarted: boolean;
  hasResults: boolean;
}) {
  return [
    {
      title: 'Options',
      icon: (
        <Tooltip title="Choose your tokens and initial weights. Select which trading functions and strategies you want to test.">
          <OrderedListOutlined className={runnerStyles.infoIcon} />
        </Tooltip>
      ),
    },
    {
      title: 'Pool',
      icon: (
        <Tooltip title="Choose your tokens and initial weights. Select which trading functions and strategies you want to test.">
          <PieChartOutlined className={runnerStyles.infoIcon} />
        </Tooltip>
      ),
    },
    {
      title: 'Time Range',
      icon: (
        <Tooltip title="Select the time range you want to model and optionally add a time series of retail swaps.">
          <RiseOutlined className={runnerStyles.infoIcon} />
        </Tooltip>
      ),
    },
    {
      title: 'Hooks',
      icon: (
        <Tooltip title="You can add swap fees as a hook to the simulation. This is useful for modeling fee changes over time. V1 allows you to import fees as a time series from an externally-calculated model.">
          <ClockCircleOutlined className={runnerStyles.infoIcon} />
        </Tooltip>
      ),
    },
    {
      title: 'Final Review',
      icon: (
        <Tooltip title="Review all the settings before running the simulation.">
          <CheckCircleOutlined className={runnerStyles.infoIcon} />
        </Tooltip>
      ),
    },
    {
      title: 'Run status',
      icon: (
        <Tooltip title="Provides status updates while the backend is running the simulations">
          <RedoOutlined className={runnerStyles.infoIcon} />
        </Tooltip>
      ),
      disabled: !hasRunStarted,
    },
    {
      title: 'Results',
      icon: (
        <Tooltip title="View and compare performance of different pools and parameters in the simulation run. This includes day by day changes to see how market conditions affect rebalancing.">
          <DotChartOutlined className={runnerStyles.infoIcon} />
        </Tooltip>
      ),
      disabled: !hasResults,
    },
    {
      title: 'Save Results',
      icon: (
        <Tooltip title="You can either download a copy of the results to analyse or import at a later date. You can also save the results for comparison in the multi-run comparison tool">
          <SaveOutlined className={runnerStyles.infoIcon} />
        </Tooltip>
      ),
      disabled: !hasResults,
    },
  ];
}

export function SimulationRunnerHeader({
  currentStepIndex,
  hasRunStarted,
  hasResults,
  onChange,
  onImportClick,
  onResetClick,
  resetDisabled,
}: RunnerHeaderProps) {
  const stepItems = getRunnerStepItems({ hasRunStarted, hasResults });

  return (
    <div className={runnerStyles.runnerSidebar}>
      <div className={runnerStyles.runnerHeaderActions}>
        <Button
          type="primary"
          className={runnerStyles.runnerActionButton}
          onClick={onImportClick}
        >
          Import
        </Button>
        <Button
          type="primary"
          className={runnerStyles.runnerActionButton}
          disabled={resetDisabled}
          onClick={onResetClick}
        >
          Reset
        </Button>
      </div>
      <Steps
        current={currentStepIndex}
        onChange={onChange}
        direction="vertical"
        size="small"
        items={stepItems}
        className={runnerStyles.runnerStepNavigation}
      />
    </div>
  );
}
