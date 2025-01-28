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
export type GroupedParameters = Record<
  string,
  { param: UpdateRuleParameter; coin?: LiquidityPoolCoin }[]
>;

export function ConfiguredSimulationsToRunSummary() {
  const simulationPools = useAppSelector(selectSimulationPools);
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);

  const [activeSimRuleToRun, setActiveSimToRun] = useState('');
  const [isUniversal] = useState(true);

  const dispatch = useAppDispatch();
  const { TabPane } = Tabs;

  function onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  const UpdateRuleConfigurationResultView = ({
    pool,
    isUniversal = true,
  }: {
    pool: LiquidityPool;
    isUniversal: boolean;
  }) => {
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
        style={{
          width: '100%',
          justifyContent: 'space-around',
        }}
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
          <Col span={16} style={{ paddingRight: '10px', paddingTop: '20px' }}>
            <Row>
              <Col span={24}>
                <span>Automatic Arb Bots:</span>
                <span>
                  {pool.enableAutomaticArbBots ? '  Enabled' : '  Disabled'}
                </span>
              </Col>
            </Row>
            {Object.keys(groupedParameters).length === 0 && (
              <Col span={24} style={{ verticalAlign: 'middle' }}>
                No dynamic default parameters
              </Col>
            )}
            {Object.entries(groupedParameters).map(([coinCode, items]) => (
              <div key={coinCode} style={{ width: '100%' }}>
                {items[0].coin && (
                  <Row>
                    <Col span={24}>
                      <h5
                        style={{
                          marginBottom: 8,
                        }}
                      >
                        {items[0].coin.coin.coinName}
                      </h5>
                    </Col>
                  </Row>
                )}
                <Row gutter={[16, 16]}>
                  <Col span={10} style={{ verticalAlign: 'middle' }}>
                    <p hidden={items.length > 0}>
                      No dynamic default parameters{' '}
                    </p>
                  </Col>

                  {items.map(({ param }, index) => (
                    <Col
                      key={`${param.factorName}-${coinCode}-${index}`}
                      span={24}
                    >
                      <InputNumber
                        disabled={true}
                        id={`${param.factorName}-${coinCode}-${index}`}
                        addonBefore={param.factorName}
                        value={
                          isUniversal
                            ? param.factorValue
                            : items[index].coin?.factorValue
                              ? items[index].coin?.factorValue
                              : param.factorValue
                        }
                        style={{ width: '100%' }}
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
        <h4 hidden={simulationPools.length > 0}>
          No simulations have been selected to run
        </h4>
        {
          <div hidden={simulationPools.length == 0}>
            <Tabs
              activeKey={
                simulationPools.length == 1 ||
                (simulationPools.length > 1 && activeSimRuleToRun == '')
                  ? simulationPools[0].poolType.name
                  : activeSimRuleToRun
              }
              onChange={(x) => setActiveSimToRun(x)}
            >
              {simulationPools
                .map((x) => x.poolType.name)
                .filter(onlyUnique)
                .map((x) => {
                  return (
                    <TabPane tab={x} key={x}>
                      {simulationPools
                        .filter((y) => y.poolType.name == x)
                        .map((z) => {
                          return (
                            <div key={z.id}>
                              <Row>
                                <Col span={21}>
                                  <Space
                                    direction="vertical"
                                    size="middle"
                                    style={{
                                      display: 'flex',
                                    }}
                                  >
                                    <UpdateRuleConfigurationResultView
                                      pool={z}
                                      isUniversal={isUniversal}
                                    />
                                  </Space>
                                </Col>
                                <Col span={3} style={{ paddingLeft: '10px' }}>
                                  <Button
                                    disabled={!coinDataLoaded}
                                    type="primary"
                                    onClick={() => {
                                      dispatch(removeSim(z.id));
                                    }}
                                  >
                                    X
                                  </Button>
                                </Col>
                              </Row>
                              <Divider></Divider>
                            </div>
                          );
                        })}
                    </TabPane>
                  );
                })}
            </Tabs>
          </div>
        }
      </Col>
    </Row>
  );
}
