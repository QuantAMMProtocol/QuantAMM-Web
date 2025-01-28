import { Col, Row, Tabs } from 'antd';
import { useState } from 'react';
import { SimulationResultsSummaryStep } from '../simulationResults/simulationResultsSummaryStep';
import { getBreakdown } from '../../services/breakdownService';

const { TabPane } = Tabs;

export function About() {
  const [key, setKey] = useState<string>('1');

  function getTab(): JSX.Element {
    if (key == '1') {
      return (
        <SimulationResultsSummaryStep
          breakdowns={[
            getBreakdown('balancerWeighted'),
            getBreakdown('balancerWeightedLvr'),
            getBreakdown('balancerWeightedRvr'),
            getBreakdown('hodlEthUsdc'),
          ]}
          forceViewResults={true}
        />
      );
    } else if (key == '2') {
      return (
        <SimulationResultsSummaryStep
          breakdowns={[
            getBreakdown('quantAMMMomentum'),
            getBreakdown('quantAMMAntiMomentum'),
            getBreakdown('quantAMMPowerChannel'),
            getBreakdown('quantAMMChannelFollowing'),
            getBreakdown('quantAMMMeanReversionChannel'),
          ]}
          forceViewResults={true}
        />
      );
    } else if (key == '3') {
      return (
        <SimulationResultsSummaryStep
          breakdowns={[
            getBreakdown('cowAMM'),
            getBreakdown('cowAmmLvr'),
            getBreakdown('cowAmmRvr'),
            getBreakdown('hodlEthUsdc'),
          ]}
          forceViewResults={true}
        />
      );
    } else if (key == '4') {
      return (
        <SimulationResultsSummaryStep
          breakdowns={[
            getBreakdown('gyroscope'),
            getBreakdown('gyroscopeLvr'),
            getBreakdown('gyroscopeRvr'),
            getBreakdown('hodlEthUsdc'),
          ]}
          forceViewResults={true}
        />
      );
    }

    return <div></div>;
  }

  return (
    <div>
      <Row>
        <Col span={24}>
          <Tabs
            defaultActiveKey={key}
            key={key}
            onChange={(key) => setKey(key)}
            style={{ paddingLeft: 20, paddingRight: 20 }}
          >
            <TabPane tab="Balancer Weighted Pools" key={'1'}>
              {getTab()}
            </TabPane>
            <TabPane tab="QuantAMM Pools" key={'2'}>
              {getTab()}
            </TabPane>
            <TabPane tab="CowAMM Pools" key={'3'}>
              {getTab()}
            </TabPane>
            <TabPane tab="Gyroscope Pools" key={'4'}>
              {getTab()}
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
