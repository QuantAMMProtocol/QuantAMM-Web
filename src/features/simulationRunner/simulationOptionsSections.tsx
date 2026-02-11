import { Button, Col, Divider, Row } from 'antd';
import runnerStyles from './simulationRunnerCommon.module.css';

export function SimulatorIntroSection() {
  return (
    <Row>
      <Col span={24}>
        <h1 className={runnerStyles.optionsHeader}>QuantAMM Historic Simulator</h1>
      </Col>
      <Col span={24}>
        <p>Not sure what to run? We have run some interesting examples for you.</p>
      </Col>
      <Col span={24}>
        <Button
          href="/examples"
          type="primary"
          size="large"
          className={runnerStyles.greenButton}
        >
          View Example Results
        </Button>
      </Col>
      <Divider />
    </Row>
  );
}

interface AdvancedRunnerSectionProps {
  onBegin: () => void;
}

export function AdvancedRunnerSection({ onBegin }: AdvancedRunnerSectionProps) {
  return (
    <Row>
      <Col span={24}>
        <Col span={24}>
          <h3>Advanced Simulation Runner</h3>
        </Col>
        <Col span={24}>
          <p>
            For those wanting to test specific parameter settings, specific pool
            initial values and configurations, you can access the advanced
            simulator.
          </p>
        </Col>
        <Button
          type="primary"
          size="large"
          className={runnerStyles.greenButton}
          onClick={onBegin}
        >
          Begin Advanced Simulation Runner
        </Button>
      </Col>
    </Row>
  );
}
