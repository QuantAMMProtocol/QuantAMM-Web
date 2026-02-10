import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';

import {
  selectAvailableCoins,
  selectCoinPriceDataLoaded,
  selectStartDate,
  selectEndDate,
  selectPoolConstituents,
  selectSwapImports,
} from './simulationRunConfigurationSlice';
import { useAppSelector } from '../../app/hooks';
import { CoinPrice, Coin, SwapImport } from './simulationRunConfigModels';
import { Row, Col, Divider, Spin } from 'antd';
import styles from './simulationRunConfiguration.module.css';
import { selectAgChartTheme } from '../themes/themeSlice';
import { useCallback } from 'react';
import { AgTimeAxisOptions } from 'ag-charts-community';

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

export function CustomTimePeriodPoolPriceHistoryChart() {
  const initialPoolConstituents = useAppSelector(selectPoolConstituents);
  const availableCoins = useAppSelector(selectAvailableCoins);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const loadingCoins = useAppSelector(selectCoinPriceDataLoaded);
  const chartTheme = useAppSelector(selectAgChartTheme);
  const swapImports = useAppSelector(selectSwapImports);

  const getMaxSwapImports = useCallback(
    (coinCode: string) => {
      const coinSwapImports = swapImports.filter((x) => x.tokenIn === coinCode);
      return Math.max(...coinSwapImports.map((x) => x.amountIn), 0);
    },
    [swapImports]
  );

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

        if (swapImports.length > 0) {
          const swapData = swapImports.filter(
            (x) => x.tokenIn === coin.coinCode
          );
          const swapSeriesData: SwapImport[] = [];

          for (const data of miliDateData) {
            const swapDataPoint = swapData.find((x) => x.unix === data.unix);
            swapSeriesData.push({
              tokenIn: coin.coinCode,
              tokenOut: coin.coinCode,
              unix: data.unix,
              amountIn: swapDataPoint ? swapDataPoint.amountIn : 0,
            });
          }
          seriesArray.push({
            type: 'bar',
            xKey: 'unix',
            yKey: 'amountIn',
            yName: 'Amount In',
            data: swapSeriesData,
            stroke: '#DAAB43',
          });
        }
      }

      return seriesArray;
    },
    [availableCoins, endDate, startDate, swapImports]
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

  return (
    <div>
      <Divider>Token Prices For Selected Time Range</Divider>
      <div hidden={loadingCoins}>
        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <Spin size="large" tip="Loading Coin Price Data..."></Spin>
          </Col>
          <Col span={8}></Col>
        </Row>
      </div>
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
                        getTimeAxisOption(priceHistorySeries?.[0]?.data?.length ?? 0),
                        {
                          type: 'number',
                          position: 'left',
                          keys: ['close'],
                          label: {
                            format: '$~s',
                          },
                        },
                        {
                          type: 'number',
                          position: 'right',
                          keys: ['amountIn'],
                          title: {
                            text: 'Amount In',
                          },
                          label: {
                            format: '~s',
                          },
                          max: getMaxSwapImports(x.coin.coinCode) * 0.8,
                        },
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
