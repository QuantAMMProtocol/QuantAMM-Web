import { Col, Row, Tabs, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { SimulationResultsSummaryStep } from '../../../simulationResults/simulationResultsSummaryStep';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';

const { TabPane } = Tabs;

export default function SafeHavenSimulatorExample() {
  const [key, setKey] = useState<string>('2');
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to load breakdowns based on the selected tab
  const loadBreakdowns = async (poolNames: Pool[]) => {
    setLoading(true); // Start loading
    const fetchedBreakdowns = await Promise.all(
      poolNames.map((poolName) => getBreakdown(poolName))
    );
    setBreakdowns(fetchedBreakdowns);
    setLoading(false); // End loading
  };

  // Effect to load breakdowns whenever the tab key changes
  useEffect(() => {
    const loadData = async () => {
      let poolNames: Pool[] = [];

      if (key === '1') {
        poolNames = [
          'safeHavenBTFAugTrainFull',
          'safeHavenCFMMAugTrainFull',
          'safeHavenHodlAugTrainFull'
        ];
      } else if (key === '2') {
        poolNames = [
          'safeHavenCFMMAugTestFull',
          'safeHavenBTFAugTestFull',
          'safeHavenHodlAugTestFull'
        ];
      } else if (key === '3') {
        poolNames = [
          'safeHavenBTF2025TestFull',
          'safeHavenCFMM2025TestFull',
          'safeHavenHodl2025TestFull'
        ];
      }

      // Load breakdowns for the selected tab
      await loadBreakdowns(poolNames); // Awaiting the asynchronous function here
    };

    loadData().catch((error) => {
      console.error('Failed to load breakdowns:', error);
    }); // Trigger loading of breakdowns
  }, [key]); // Dependency array ensures that effect runs when `key` changes

  const seriesName= {
    'Power Channel': '#c7b283',
    'Balancer Weighted': '#528aae',
    HODL: '#52ad80',
  }
  const seriesStrokeColor= {
    'Power Channel': 'SAFE HAVEN BTF',
    'Balancer Weighted': 'Traditional DEX',
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
            <TabPane tab="Safe Haven Training Period" key={'1'}>
              {loading ? (
                <Spin size="large" />
              ) : (
                <SimulationResultsSummaryStep
                  breakdowns={breakdowns}
                  forceViewResults={true}
                  overrideSeriesName= {seriesName}
                  overrideSeriesStrokeColor= {seriesStrokeColor}
                />
              )}
            </TabPane>
            <TabPane tab="Safe Haven Test Period: Aug 2024 - Apr 2025" key={'2'}>
              {loading ? (
                <Spin size="large" />
              ) : (
                <SimulationResultsSummaryStep
                  breakdowns={breakdowns}
                  forceViewResults={true}
                  overrideSeriesName= {seriesName}
                  overrideSeriesStrokeColor= {seriesStrokeColor}
                />
              )}
            </TabPane>
            <TabPane tab="Safe Haven Test Period: Jan 2025 - Apr 2025" key={'3'}>
              {loading ? (
                <Spin size="large" />
              ) : (
                <SimulationResultsSummaryStep
                  breakdowns={breakdowns}
                  forceViewResults={true}
                  overrideSeriesName= {seriesName}
                  overrideSeriesStrokeColor= {seriesStrokeColor}
                />
              )}
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}

export { SafeHavenSimulatorExample };
