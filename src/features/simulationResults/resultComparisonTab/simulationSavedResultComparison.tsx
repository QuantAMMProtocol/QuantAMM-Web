import { Button, Col, Divider, Row, Tabs } from 'antd';
import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import {
  selectSelectedSimulationResults,
  selectSimulationResults,
} from '../simulationResultSlice';
import { SimulationResultsSummaryStep } from '../simulationResultsSummaryStep';
import { SimulationResultsRunDetailsTable } from './simulationResultsRunDetailsTable';
import { PoolDeploymentConfigReview } from '../../simulationRunner/simulationDeploymentPreview';

const { TabPane } = Tabs;

export function SimulationSavedResultComparison() {
  const savedBreakdowns = useAppSelector(selectSimulationResults);
  const savedSelectedBreakdowns = useAppSelector(
    selectSelectedSimulationResults
  );
  const [key, setKey] = useState<string>('1');

  function getTab(): JSX.Element {
    if (key == '1') {
      return (
        <SimulationResultsRunDetailsTable
          breakdowns={savedBreakdowns ?? []}
          saveButton={false}
          selectButton={true}
          removeButton={false}
          tableHeight={'60vh'}
        />
      );
    } else if (key == '2') {
      return (
        <SimulationResultsSummaryStep
          breakdowns={savedSelectedBreakdowns}
          forceViewResults={false}
        />
      );
    } else if (key == '3') {
      return (
        <PoolDeploymentConfigReview
          pool={savedSelectedBreakdowns[0].simulationRun}
          initialisationData={savedSelectedBreakdowns[0].simulationRunResultAnalysis}
        />
      );
    }

    return <div></div>;
  }

  return (
    <div>
      <Row>
        <Col span={24} style={{ paddingLeft: 30, paddingRight: 30 }}>
          <Tabs
            defaultActiveKey={key}
            key={key}
            onChange={(key) => setKey(key)}
          >
            <TabPane
              tab={
                'Selected Saved Results (' +
                savedSelectedBreakdowns.length +
                ')'
              }
              key="1"
            >
              <Row>
                <Col span={16}>
                  <Divider>Run Detail Summary</Divider>
                </Col>
                <Col span={4}>
                  <Button
                    type="primary"
                    style={{ marginTop: 5, marginLeft: 40, height: 40 }}
                    onClick={() => {
                      setKey('2');
                    }}
                  >
                    See Comparison Results
                  </Button>
                </Col>
                <Col span={4}>
                  <Button
                    disabled={savedSelectedBreakdowns.length !== 1}
                    type="primary"
                    style={{ marginTop: 5, marginLeft: 40, height: 40 }}
                    onClick={() => {
                      setKey('3');
                    }}
                  >
                    See Deployment Preview
                  </Button>
                </Col>
              </Row>
              {getTab()}
            </TabPane>
            <TabPane tab="Compare Selected Results" key="2">
              {getTab()}
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
