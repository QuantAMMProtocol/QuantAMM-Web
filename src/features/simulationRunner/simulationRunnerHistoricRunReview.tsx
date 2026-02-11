import { Col, Input, Row, Tabs } from 'antd';
import { SimulationRunButton } from './simulationRunButton';
import runnerStyles from './simulationRunnerCommon.module.css';

interface HistoricRunReviewProps {
  startDate: string;
  endDate: string;
  currentTimeRangeSelection: string;
}

const { TabPane } = Tabs;

export function SimulationRunnerHistoricRunReview({
  startDate,
  endDate,
  currentTimeRangeSelection,
}: HistoricRunReviewProps) {
  return (
    <Tabs>
      <TabPane tab={'Historic Run'} key={'Historic Run'}>
        <Row>
          <Col span={24}>
            <Row hidden={currentTimeRangeSelection !== 'custom'}>
              <Col span={12}>
                <Input disabled addonBefore="Start Date" value={startDate} />
              </Col>
              <Col span={12}>
                <Input
                  className={runnerStyles.marginLeft10}
                  disabled
                  addonBefore="End Date"
                  value={endDate}
                />
              </Col>
            </Row>
          </Col>
          <SimulationRunButton simplifiedPoolRun={false} />
        </Row>
      </TabPane>
    </Tabs>
  );
}
