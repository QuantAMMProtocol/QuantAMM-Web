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

export function SimulationRunnerHistoricInProgress() {
  const results = useAppSelector(selectSimulationRunBreakdowns);
  const simulationsToRun = useAppSelector(selectSimulationsToRun);

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
          <Col span={5}>
            <Steps direction="vertical">
              {results
                .filter((x) => results.indexOf(x) < 8)
                .map((x, index) => (
                  <Step
                    key={index}
                    title={
                      x.timeRange.name +
                      ' - ' +
                      x.simulationRun.updateRule.updateRuleKey
                    }
                    status={
                      x.simulationRunStatus.toLowerCase() == 'pending'
                        ? 'wait'
                        : x.simulationRunStatus.toLowerCase() == 'running'
                          ? 'process'
                          : x.simulationRunStatus.toLowerCase() == 'complete'
                            ? 'finish'
                            : 'error'
                    }
                    icon={
                      x.simulationRunStatus.toLowerCase() == 'pending' ? (
                        <PauseCircleOutlined />
                      ) : x.simulationRunStatus.toLowerCase() == 'running' ? (
                        <LoadingOutlined />
                      ) : x.simulationRunStatus.toLowerCase() == 'complete' ? (
                        <CheckCircleOutlined />
                      ) : (
                        <WarningOutlined />
                      )
                    }
                    description={x.simulationRunStatus}
                  />
                ))}
            </Steps>
          </Col>
          <Col span={6}>
            <div hidden={results.length < 8}>
              <Steps direction="vertical">
                {results
                  .filter(
                    (x) => results.indexOf(x) > 7 && results.indexOf(x) < 16
                  )
                  .map((x, index) => (
                    <Step
                      key={index}
                      title={
                        x.timeRange.name +
                        ' - ' +
                        x.simulationRun.updateRule.updateRuleKey
                      }
                      status={
                        x.simulationRunStatus.toLowerCase() == 'pending'
                          ? 'wait'
                          : x.simulationRunStatus.toLowerCase() == 'running'
                            ? 'process'
                            : x.simulationRunStatus.toLowerCase() == 'complete'
                              ? 'finish'
                              : 'error'
                      }
                      icon={
                        x.simulationRunStatus.toLowerCase() == 'pending' ? (
                          <PauseCircleOutlined />
                        ) : x.simulationRunStatus.toLowerCase() == 'running' ? (
                          <LoadingOutlined />
                        ) : x.simulationRunStatus.toLowerCase() ==
                          'complete' ? (
                          <CheckCircleOutlined />
                        ) : (
                          <WarningOutlined />
                        )
                      }
                      description={x.simulationRunStatus}
                    />
                  ))}
              </Steps>
            </div>
          </Col>
          <Col span={6}>
            <div hidden={results.length < 15}>
              <Steps direction="vertical">
                {results
                  .filter(
                    (x) => results.indexOf(x) > 16 && results.indexOf(x) < 25
                  )
                  .map((x, index) => (
                    <Step
                      key={index}
                      title={
                        x.timeRange.name +
                        ' - ' +
                        x.simulationRun.updateRule.updateRuleKey
                      }
                      status={
                        x.simulationRunStatus.toLowerCase() == 'pending'
                          ? 'wait'
                          : x.simulationRunStatus.toLowerCase() == 'running'
                            ? 'process'
                            : x.simulationRunStatus.toLowerCase() == 'complete'
                              ? 'finish'
                              : 'error'
                      }
                      icon={
                        x.simulationRunStatus.toLowerCase() == 'pending' ? (
                          <PauseCircleOutlined />
                        ) : x.simulationRunStatus.toLowerCase() == 'running' ? (
                          <LoadingOutlined />
                        ) : x.simulationRunStatus.toLowerCase() ==
                          'complete' ? (
                          <CheckCircleOutlined />
                        ) : (
                          <WarningOutlined />
                        )
                      }
                      description={x.simulationRunStatus}
                    />
                  ))}
              </Steps>
            </div>
          </Col>
          <Col span={5}>
            <div hidden={results.length < 25}>
              <Steps direction="vertical">
                {results
                  .filter((x) => results.indexOf(x) > 25)
                  .map((x, index) => (
                    <Step
                      key={index}
                      title={
                        x.timeRange.name +
                        ' - ' +
                        x.simulationRun.updateRule.updateRuleKey
                      }
                      status={
                        x.simulationRunStatus.toLowerCase() == 'pending'
                          ? 'wait'
                          : x.simulationRunStatus.toLowerCase() == 'running'
                            ? 'process'
                            : x.simulationRunStatus.toLowerCase() == 'complete'
                              ? 'finish'
                              : 'error'
                      }
                      icon={
                        x.simulationRunStatus.toLowerCase() == 'pending' ? (
                          <PauseCircleOutlined />
                        ) : x.simulationRunStatus.toLowerCase() == 'running' ? (
                          <LoadingOutlined />
                        ) : x.simulationRunStatus.toLowerCase() ==
                          'complete' ? (
                          <CheckCircleOutlined />
                        ) : (
                          <WarningOutlined />
                        )
                      }
                      description={x.simulationRunStatus}
                    />
                  ))}
              </Steps>
            </div>
          </Col>
          <Col span={1}></Col>
        </Row>
      </Col>
    </Row>
  );
}
