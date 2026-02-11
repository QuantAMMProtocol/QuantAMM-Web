import styles from '../simulationResults/simulationResultSummary.module.css';

import {
  LiquidityPool,
  UpdateRuleParameter,
} from '../simulationRunConfiguration/simulationRunConfigModels';

import {
  selectSimulationRunStatusStepIndex,
  selectSimulationRunnerTimeRangeSelection,
} from '../simulationRunner/simulationRunnerSlice';

import { Button, Col, Divider, Input, InputNumber, Row, Space, Tabs } from 'antd';
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
import { useMemo } from 'react';
import runnerStyles from './simulationRunnerCommon.module.css';

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

const getGroupedParameters = (pool: LiquidityPool): GroupedParameters =>
  pool.updateRule.updateRuleParameters.reduce(
    (acc: GroupedParameters, param: UpdateRuleParameter) => {
      if (param.applicableCoins && param.applicableCoins.length > 0) {
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

interface PoolSummaryProps {
  updateRuleName: string;
  pool: LiquidityPool;
  coinDataLoaded: boolean;
  runStatusIndex: number;
  onRemovePool: (poolId: string) => void;
}

function PoolSummary({
  updateRuleName,
  pool,
  coinDataLoaded,
  runStatusIndex,
  onRemovePool,
}: PoolSummaryProps) {
  const groupedParameters = getGroupedParameters(pool);

  return (
    <div key={pool.id}>
      <Row>
        <Col span={4}>{updateRuleName}</Col>
        <Col span={16}>
          <Row>
            <Space
              direction="vertical"
              align="start"
              className={`${runnerStyles.fullWidth} ${runnerStyles.spaceAround}`}
            >
              {Object.entries(groupedParameters).map(([coinCode, items]) => (
                <div key={coinCode} className={runnerStyles.fullWidth}>
                  {items[0].coin && (
                    <Row>
                      <Col span={24}>
                        <h5 className={runnerStyles.marginBottom8}>
                          {items[0].coin.coin.coinName}
                        </h5>
                      </Col>
                    </Row>
                  )}
                  <Row gutter={[16, 16]}>
                    {items.map(({ param }, index) => (
                      <Col key={`${param.factorName}-${coinCode}-${index}`} span={10}>
                        <InputNumber
                          disabled
                          id={`${param.factorName}-${coinCode}-${index}`}
                          addonBefore={param.factorName}
                          value={
                            (param.applicableCoins?.length ?? 0) > 0
                              ? items[index]?.coin?.factorValue ??
                                param.factorValue
                              : param.factorValue
                          }
                          className={runnerStyles.fullWidth}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Space>
          </Row>
        </Col>
        <Col span={4}>
          <div className={runnerStyles.padding5}>
            <Space direction="vertical" className={runnerStyles.fullWidth}>
              <Button
                disabled={!coinDataLoaded || runStatusIndex === 2}
                type="primary"
                onClick={() => {
                  onRemovePool(pool.id);
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
}

interface HistoricRunReviewProps {
  startDate: string;
  endDate: string;
  currentTimeRangeSelection: string;
}

function HistoricRunReview({
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

  const uniqueUpdateRules = useMemo(
    () =>
      Array.from(
        new Set(configuredPools.map((pool) => pool.updateRule.updateRuleName))
      ),
    [configuredPools]
  );

  return (
    <Row className={styles.simRunSection}>
      <Col span={12}>
        <Row>
          <Col span={24}>
            <Divider>Constituents and Update Rules</Divider>
            <h4 hidden={configuredPools.length > 0}>
              No simulations have been selected to run
            </h4>
            {uniqueUpdateRules.map((x) => {
              return (
                <div key={x}>
                  {configuredPools
                    .filter((y) => y.updateRule.updateRuleName === x)
                    .map((z) => (
                      <PoolSummary
                        key={z.id}
                        updateRuleName={x}
                        pool={z}
                        coinDataLoaded={coinDataLoaded}
                        runStatusIndex={runStatusIndex}
                        onRemovePool={(poolId) => {
                          dispatch(removeSim(poolId));
                        }}
                      />
                    ))}
                </div>
              );
            })}
          </Col>
        </Row>
      </Col>
      <Col span={1}></Col>
      <Col span={11}>
        <HistoricRunReview
          startDate={startDate}
          endDate={endDate}
          currentTimeRangeSelection={currentTimeRangeSelection}
        />
      </Col>
    </Row>
  );
}
