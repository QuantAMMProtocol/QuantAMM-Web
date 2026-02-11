import { Button, Col, Divider, Row, Space, Tabs } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import {
  removeSim,
  selectCoinPriceDataLoaded,
  selectSimulationPools,
} from './simulationRunConfigurationSlice';
import styles from './simulationRunConfiguration.module.css';
import { UpdateRuleConfigurationResultView } from './poolRuleConfiguration/updateRuleConfigurationResultView';

export function ConfiguredSimulationsToRunSummary() {
  const simulationPools = useAppSelector(selectSimulationPools);
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);

  const [activeSimRuleToRun, setActiveSimToRun] = useState('');

  const dispatch = useAppDispatch();
  const { TabPane } = Tabs;

  const uniquePoolTypes = Array.from(
    new Set(simulationPools.map((pool) => pool.poolType.name))
  );
  const activePoolType =
    activeSimRuleToRun && uniquePoolTypes.includes(activeSimRuleToRun)
      ? activeSimRuleToRun
      : uniquePoolTypes[0] ?? '';

  return (
    <Row>
      <Col span={24}>
        {simulationPools.length === 0 && (
          <h4>No simulations have been selected to run</h4>
        )}
        {simulationPools.length > 0 && (
          <div>
            <Tabs
              activeKey={activePoolType}
              onChange={(x) => setActiveSimToRun(x)}
            >
              {uniquePoolTypes.map((poolTypeName) => (
                <TabPane tab={poolTypeName} key={poolTypeName}>
                  {simulationPools
                    .filter((pool) => pool.poolType.name === poolTypeName)
                    .map((pool) => (
                      <div key={pool.id}>
                        <Row>
                          <Col span={21}>
                            <Space
                              direction="vertical"
                              size="middle"
                              className={styles.summaryEntrySpace}
                            >
                              <UpdateRuleConfigurationResultView pool={pool} />
                            </Space>
                          </Col>
                          <Col span={3} className={styles.summaryRemoveColumn}>
                            <Button
                              disabled={!coinDataLoaded}
                              type="primary"
                              onClick={() => {
                                dispatch(removeSim(pool.id));
                              }}
                            >
                              X
                            </Button>
                          </Col>
                        </Row>
                        <Divider></Divider>
                      </div>
                    ))}
                </TabPane>
              ))}
            </Tabs>
          </div>
        )}
      </Col>
    </Row>
  );
}
