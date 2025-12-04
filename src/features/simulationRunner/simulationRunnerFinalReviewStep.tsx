import styles from '../simulationResults/simulationResultSummary.module.css';

import {
  LiquidityPool,
  UpdateRuleParameter,
} from '../simulationRunConfiguration/simulationRunConfigModels';

import {
  selectSimulationRunStatusStepIndex,
  selectSimulationRunnerTimeRangeSelection,
} from '../simulationRunner/simulationRunnerSlice';

import { Button, Col, Divider, InputNumber, Row, Space, Tabs } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  removeSim,
  selectCoinPriceDataLoaded,
  selectEndDate,
  selectSimulationPools,
  selectStartDate,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { SimulationResult } from '../simulationRunner/simulationRunnerDtos';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SimulationRunButton } from './simulationRunButton';
import { GroupedParameters } from '../simulationRunConfiguration/poolRuleConfiguration';

export interface Success {
  data: SimulationResult;
}

export interface Failure {
  error: FetchBaseQueryError;
}

export interface RunSetting {
  pool: LiquidityPool;
}

const { TabPane } = Tabs;

export function SimulationRunnerFinalReviewStep() {
  const dispatch = useAppDispatch();
  const configuredPools = useAppSelector(selectSimulationPools);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const currentTimeRangeSelection = useAppSelector(
    selectSimulationRunnerTimeRangeSelection
  );
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);

  function onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }


  return (
    <Row className={styles.simRunSection}>
      <Col span={12}>
        <Row>
          <Col span={24}>
            <Divider>Constituents and Update Rules</Divider>
            <h4 hidden={configuredPools.length > 0}>
              No simulations have been selected to run
            </h4>
            {configuredPools
              .map((x) => x.updateRule.updateRuleName)
              .filter(onlyUnique)
              .map((x, index) => {
                return (
                  <div key={index}>
                    {configuredPools
                      .filter((y) => y.updateRule.updateRuleName == x)
                      .map((z) => {
                        const groupedParameters =
                          z.updateRule.updateRuleParameters.reduce(
                            (
                              acc: GroupedParameters,
                              param: UpdateRuleParameter
                            ) => {
                              if (
                                param.applicableCoins &&
                                param.applicableCoins.length > 0
                              ) {
                                param.applicableCoins.forEach((coin) => {
                                  if (!acc[coin.coin.coinCode]) {
                                    acc[coin.coin.coinCode] = [];
                                  }
                                  acc[coin.coin.coinCode].push({
                                    param,
                                    coin,
                                  });
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
                          <div key={z.id}>
                            <Row>
                              <Col span={4}>{x}</Col>
                              <Col span={16}>
                                <Row>
                                  <Space
                                    direction="vertical"
                                    align="start"
                                    style={{
                                      width: '100%',
                                      justifyContent: 'space-around',
                                    }}
                                  >
                                    {Object.entries(groupedParameters).map(
                                      ([coinCode, items]) => (
                                        <div
                                          key={coinCode}
                                          style={{ width: '100%' }}
                                        >
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
                                            {items.map(({ param }, index) => (
                                              <Col
                                                key={`${param.factorName}-${coinCode}-${index}`}
                                                span={10}
                                              >
                                                <InputNumber
                                                  disabled={true}
                                                  id={`${param.factorName}-${coinCode}-${index}`}
                                                  addonBefore={param.factorName}
                                                  value={
                                                    param.applicableCoins
                                                      .length > 0
                                                      ? items[index]?.coin
                                                          ?.factorValue ??
                                                        param.factorValue
                                                      : param.factorValue
                                                  }
                                                  style={{ width: '100%' }}
                                                />
                                              </Col>
                                            ))}
                                          </Row>
                                        </div>
                                      )
                                    )}
                                  </Space>
                                </Row>
                              </Col>
                              <Col span={4}>
                                <div style={{ padding: 5 }}>
                                  <Space
                                    direction="vertical"
                                    style={{ width: '100%' }}
                                  >
                                    <Button
                                      disabled={
                                        !coinDataLoaded || runStatusIndex == 2
                                      }
                                      type="primary"
                                      onClick={() => {
                                        dispatch(removeSim(z.id));
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </Space>
                                </div>
                              </Col>
                            </Row>
                            <Divider></Divider>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </Col>
        </Row>
      </Col>
      <Col span={1}></Col>
      <Col span={11}>
        <Tabs>
          <TabPane tab={'Historic Run'} key={'Historic Run'}>
            <Row>
              <Col span={24}>
                <Row hidden={currentTimeRangeSelection != 'custom'}>
                  <Col span={12}>
                    <InputNumber
                      disabled={true}
                      defaultValue={startDate}
                      addonBefore="Start Date"
                      value={startDate}
                    />
                  </Col>
                  <Col span={12}>
                    <InputNumber
                      style={{ marginLeft: '10px' }}
                      disabled={true}
                      defaultValue={endDate}
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
      </Col>
    </Row>
  );
}
