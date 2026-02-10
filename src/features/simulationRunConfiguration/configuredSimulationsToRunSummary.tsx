//TODO CH split into subcomponents
import { Button, Col, Divider, InputNumber, Row, Space, Tabs } from 'antd';
import {
  LiquidityPool,
  LiquidityPoolCoin,
  UpdateRuleParameter,
} from './simulationRunConfigModels';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import {
  removeSim,
  selectCoinPriceDataLoaded,
  selectSimulationPools,
} from './simulationRunConfigurationSlice';
import styles from './simulationRunConfiguration.module.css';
export type GroupedParameters = Record<
  string,
  { param: UpdateRuleParameter; coin?: LiquidityPoolCoin }[]
>;

const toNumericValue = (value: string | number | null | undefined) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
};

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

  const UpdateRuleConfigurationResultView = ({ pool }: { pool: LiquidityPool }) => {
    const groupedParameters = pool.updateRule.updateRuleParameters.reduce(
      (acc: GroupedParameters, param: UpdateRuleParameter) => {
        if (param.applicableCoins && param.applicableCoins.length > 0) {
          param.applicableCoins.forEach((coin) => {
            if (!acc[coin.coin.coinCode]) {
              acc[coin.coin.coinCode] = [];
            }
            acc[coin.coin.coinCode].push({ param, coin });
          });
        } else {
          if (!acc.noCoins) {
            acc.noCoins = [];
          }
          acc.noCoins.push({ param });
        }
        return acc;
      },
      {}
    );

    return (
      <Space
        direction="vertical"
        align="start"
        className={styles.summarySpace}
      >
        <Row>
          <Col span={8}>
            <Col span={24}>
              <p>
                {pool.poolConstituents
                  .map((token) => token.coin.coinCode)
                  .join('-')}
              </p>
            </Col>
            <Col span={24}>
              <p>{pool.updateRule.updateRuleName}</p>
            </Col>
            <Col span={24}></Col>
          </Col>
          <Col span={16} className={styles.summaryRuleColumn}>
            <Row>
              <Col span={24}>
                <span>Automatic Arb Bots:</span>
                <span>
                  {pool.enableAutomaticArbBots ? '  Enabled' : '  Disabled'}
                </span>
              </Col>
            </Row>
            {Object.keys(groupedParameters).length === 0 && (
              <Col span={24} className={styles.summaryNoParams}>
                No dynamic default parameters
              </Col>
            )}
            {Object.entries(groupedParameters).map(([coinCode, items]) => (
              <div key={coinCode} className={styles.summaryParameterGroup}>
                {items[0].coin && (
                  <Row>
                    <Col span={24}>
                      <h5 className={styles.summaryParameterTitle}>
                        {items[0].coin.coin.coinName}
                      </h5>
                    </Col>
                  </Row>
                )}
                <Row gutter={[16, 16]}>
                  {items.map(({ param }, index) => (
                    <Col
                      key={`${param.factorName}-${coinCode}-${index}`}
                      span={24}
                    >
                      <InputNumber
                        disabled
                        id={`${param.factorName}-${coinCode}-${index}`}
                        addonBefore={param.factorName}
                        value={toNumericValue(
                          items[index].coin?.factorValue ?? param.factorValue
                        )}
                        className={styles.summaryInput}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Col>
        </Row>
      </Space>
    );
  };

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
