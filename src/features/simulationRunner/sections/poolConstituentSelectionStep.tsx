import { Col, Divider, Row, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { PoolRuleConfiguration } from '../../simulationRunConfiguration/poolRuleConfiguration/poolRuleConfiguration';
import runnerStyles from '../simulationRunnerCommon.module.css';

export function PoolConstituentSelectionStep() {
  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Divider>
              1. Choose Pool Constituents
              <Tooltip title="Pool constituents need to be selected. The TVL can be modified to change the starting weights.">
                <InfoCircleOutlined className={runnerStyles.infoIcon} />
              </Tooltip>
            </Divider>
          </Col>
          <Col xs={24} lg={8}>
            <Divider>
              2. Choose Pools
              <Tooltip title="Balancer-v3 can run various pool invariants and dynamic AMM types. Select those AMM types you would like to simulate here.">
                <InfoCircleOutlined className={runnerStyles.infoIcon} />
              </Tooltip>
            </Divider>
          </Col>
          <Col xs={24} lg={8}>
            <Divider>
              3. Review Selected Pools
              <Tooltip title="Review the pools you have configured and delete any that you do not want to run.">
                <InfoCircleOutlined className={runnerStyles.infoIcon} />
              </Tooltip>
            </Divider>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <PoolRuleConfiguration />
      </Col>
    </Row>
  );
}
