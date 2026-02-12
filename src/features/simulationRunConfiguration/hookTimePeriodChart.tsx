import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';

import {
  selectAvailableCoins,
  selectCoinPriceDataLoaded,
  selectEndDate,
  selectPoolConstituents,
  selectSimulationPools,
  selectStartDate,
} from './simulationRunConfigurationSlice';
import { useAppSelector } from '../../app/hooks';
import { CoinPrice, Coin, FeeHookStep } from './simulationRunConfigModels';
import { Row, Col, Spin, Divider } from 'antd';
import styles from './simulationRunConfiguration.module.css';
import { AgNumberAxisOptions, AgTimeAxisOptions } from 'ag-charts-community';
import { selectAgChartTheme } from '../themes/themeSlice';
import { useCallback } from 'react';

export interface Marker {
  enabled: boolean;
}
export interface SeriesConfig {
  type: string;
  xKey: string;
  yKey: string;
  yName: string;
  data: CoinPrice[];
  marker: Marker;
}

export interface SelectedProps {
  id: string;
}
export function HookTimePeriodChart(selectedPool: SelectedProps) {
  const initialPoolConstituents = useAppSelector(selectPoolConstituents);
  const simulationPools = useAppSelector(selectSimulationPools);
  const availableCoins = useAppSelector(selectAvailableCoins);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const loadingCoins = useAppSelector(selectCoinPriceDataLoaded);
  const chartTheme = useAppSelector(selectAgChartTheme);
  const getPriceHistorySeries = useCallback(
    (coinCode: string) => {
      const seriesArray: agCharts.AgCartesianSeriesOptions[] = [];
      const unixStart = new Date(startDate).getTime();
      const unixEnd = new Date(endDate).getTime();

      const coin: Coin | undefined = availableCoins.find(
        (y) => y.coinCode === coinCode
      );

      if (coin !== undefined) {
        let miliDateData = coin.dailyPriceHistory.filter(
          (x) => x.unix > unixStart && x.unix < unixEnd
        );
        if (miliDateData.length === 0) {
          miliDateData = coin.dailyPriceHistory.filter(
            (x) => x.unix > unixStart / 1000 && x.unix < unixEnd / 1000
          );
        }

        seriesArray.push({
          type: 'line',
          xKey: 'unix',
          yKey: 'close',
          yName: coin.coinCode,
          data: [...miliDateData].reverse(),
          stroke: '#DAAB43',
          marker: { enabled: false },
        });

        const poolWithHooks = simulationPools.filter(
          (pool) =>
            pool.id === selectedPool.id &&
            pool.feeHooks.some((hook) =>
              hook.hookTargetTokens.some(
                (targetToken) => targetToken === coin.coinCode
              )
            )
        );

        if (poolWithHooks.length > 0) {
          poolWithHooks.forEach((pool) => {
            const dailyTimesteps: FeeHookStep[] = miliDateData.map(
              (dataPoint) => {
                const hookDataPoint = pool.feeHooks[0].hookTimeSteps?.find(
                  (step) => step.unix === dataPoint.unix
                );
                return {
                  unix: dataPoint.unix,
                  value: hookDataPoint ? hookDataPoint.value : 0,
                };
              }
            );

            seriesArray.push({
              type: 'bar',
              xKey: 'unix',
              yKey: 'value',
              yName: `${pool.poolType.name} Fees`,
              data: dailyTimesteps,
              stroke: '#DAAB43',
              min: 0,
            } as agCharts.AgCartesianSeriesOptions);
          });
        }
      }

      return seriesArray;
    },
    [availableCoins, endDate, selectedPool.id, simulationPools, startDate]
  );

  function getTimeAxisOption(dataLength: number): AgTimeAxisOptions {
    return {
      type: 'time',
      interval: {
        step:
          dataLength > 350
            ? agCharts.time.month.every(6)
            : dataLength > 150
              ? agCharts.time.month.every(3)
              : agCharts.time.month.every(1),
      },
      label: {
        format: '%m/%y',
      },
    };
  }

  const getAxes = useCallback(
    (poolId: string): (AgNumberAxisOptions | AgTimeAxisOptions)[] => {
      const hookValues = simulationPools
        .filter((pool) => pool.id === poolId)
        .flatMap((pool) =>
          pool.feeHooks.flatMap(
            (hook) => hook.hookTimeSteps?.map((step) => step.value) ?? []
          )
        );

      if (hookValues.length === 0) {
        return [];
      }

      return [
        {
          type: 'number',
          title: {
            text: 'bps',
          },
          position: 'right',
          keys: ['value'],
          max: Math.max(1, Math.max(...hookValues) * 5),
        },
      ];
    },
    [simulationPools]
  );

  return (
    <div>
      <div hidden={loadingCoins}>
        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <Spin size="large" tip="Loading Coin Price Data..."></Spin>
          </Col>
          <Col span={8}></Col>
        </Row>
      </div>
      <Divider>Token Prices For Selected Time Range</Divider>
      <Row hidden={!loadingCoins} className={styles.initialPoolChartDiv}>
        <Col span={24}>
          {initialPoolConstituents.map((x) => {
            const priceHistorySeries = getPriceHistorySeries(x.coin.coinCode);
            return (
              <Row key={x.coin.coinCode}>
                <Col span={24}>
                  <AgCharts
                    options={{
                      height: 300,
                      axes: [
                        getTimeAxisOption(
                          priceHistorySeries?.[0]?.data?.length ?? 0
                        ),
                        {
                          type: 'number',
                          position: 'left',
                          keys: ['close'],
                          label: {
                            format: '$~s',
                          },
                        },
                        ...getAxes(selectedPool.id),
                      ],
                      series: priceHistorySeries,
                      legend: {
                        position: 'top',
                      },
                      overlays: {
                        noData: {
                          text: 'No data',
                        },
                      },
                      theme: {
                        baseTheme: chartTheme,
                        overrides: {
                          common: {
                            background: {
                              fill: 'transparent',
                            },
                          },
                          line: {
                            series: {
                              stroke: '#DAAB43',
                              cursor: 'crosshair',
                              marker: {
                                stroke: '#DAAB43',
                                fill: '#DAAB43',
                                enabled: false,
                              },
                            },
                          },
                        },
                      },
                    }}
                  />
                </Col>
              </Row>
            );
          })}
        </Col>
      </Row>
    </div>
  );
}
