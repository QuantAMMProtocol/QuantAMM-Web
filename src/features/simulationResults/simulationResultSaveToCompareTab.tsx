import { BreakdownProps } from './simulationResultsSummaryStep';
import { Col, Row, Tabs } from 'antd';
import { SimulationResultsRunDetailsTable } from './resultComparisonTab/simulationResultsRunDetailsTable';
import { useAppSelector } from '../../app/hooks';
import { selectSimulationResults } from './simulationResultSlice';
import { useState } from 'react';

const { TabPane } = Tabs;

export function SimulationResultSaveToCompareTab(props: BreakdownProps) {
  const savedBreakdowns = useAppSelector(selectSimulationResults);
  const [key, setKey] = useState<string>('1');

  function getTab(): JSX.Element {
    if (key == '1') {
      return (
        <SimulationResultsRunDetailsTable
          breakdowns={props.breakdowns
            .filter((x) => x.simulationRunStatus == 'Complete')
            .filter(
              (x) =>
                savedBreakdowns.find(
                  (y) =>
                    y.simulationRun.id == x.simulationRun.id &&
                    x.timeRange.name == y.timeRange.name
                ) == undefined
            )}
          saveButton={true}
          selectButton={false}
          removeButton={false}
          tableHeight={'60vh'}
        />
      );
    } else if (key == '2') {
      return (
        <SimulationResultsRunDetailsTable
          breakdowns={savedBreakdowns ?? []}
          saveButton={false}
          selectButton={false}
          removeButton={true}
          tableHeight={'60vh'}
        />
      );
    }

    return <div></div>;
  }

  return (
    <div>
      <Row>
        <Col span={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Tabs defaultActiveKey="1" onChange={(key) => setKey(key)}>
            <TabPane tab="Current Unsaved Run Results" key="1">
              <Row>
                <Col span={24}>{getTab()}</Col>
              </Row>
            </TabPane>
            <TabPane
              tab={'Saved Results (' + savedBreakdowns.length + ')'}
              key="2"
            >
              <Row>
                <Col span={24} style={{ padding: 30 }}>
                  {getTab()}
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
