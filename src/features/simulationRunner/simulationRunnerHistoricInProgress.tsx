import {
  PauseCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import {
  selectSimulationRunBreakdowns,
  selectSimulationsToRun,
} from './simulationRunnerSlice';

import { Col, Row, Steps } from 'antd';
import { useAppSelector } from '../../app/hooks';

const { Step } = Steps;

function getStepStatus(status: string): 'wait' | 'process' | 'finish' | 'error' {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'pending') {
    return 'wait';
  }
  if (normalizedStatus === 'running') {
    return 'process';
  }
  if (normalizedStatus === 'complete') {
    return 'finish';
  }
  return 'error';
}

function getStepIcon(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'pending') {
    return <PauseCircleOutlined />;
  }
  if (normalizedStatus === 'running') {
    return <LoadingOutlined />;
  }
  if (normalizedStatus === 'complete') {
    return <CheckCircleOutlined />;
  }
  return <WarningOutlined />;
}

export function SimulationRunnerHistoricInProgress() {
  const results = useAppSelector(selectSimulationRunBreakdowns);
  const simulationsToRun = useAppSelector(selectSimulationsToRun);
  const stepColumns = [
    results.slice(0, 8),
    results.slice(8, 16),
    results.slice(16, 24),
    results.slice(24),
  ];

  return (
    <Row>
      <Col span={24}>
        <p hidden={simulationsToRun.length < 8}>
          You have queued {simulationsToRun.length} runs, this may take a minute
          or two...
        </p>
      </Col>
      <Col span={24}>
        <Row>
          <Col span={1}></Col>
          {stepColumns.map((column, columnIndex) => (
            <Col key={columnIndex} span={columnIndex === 0 || columnIndex === 3 ? 5 : 6}>
              <div hidden={column.length === 0}>
                <Steps direction="vertical">
                  {column.map((result) => (
                    <Step
                      key={`${result.simulationRun.id}-${result.timeRange.name}`}
                      title={
                        result.timeRange.name +
                        ' - ' +
                        result.simulationRun.updateRule.updateRuleKey
                      }
                      status={getStepStatus(result.simulationRunStatus)}
                      icon={getStepIcon(result.simulationRunStatus)}
                      description={result.simulationRunStatus}
                    />
                  ))}
                </Steps>
              </div>
            </Col>
          ))}
          <Col span={1}></Col>
        </Row>
      </Col>
    </Row>
  );
}
