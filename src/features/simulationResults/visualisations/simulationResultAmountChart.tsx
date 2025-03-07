import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { AgTimeAxisOptions } from 'ag-charts-community';
import { useState } from 'react';

import styles from '../simulationResultSummary.module.css';
import { useAppSelector } from '../../../app/hooks';
import { Row, Col, Divider, Radio, Form } from 'antd';
import { SimulationRunBreakdown } from '../simulationResultSummaryModels';
import { selectSimulationResultTimeRangeSelection } from '../../simulationRunner/simulationRunnerSlice';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { BreakdownProps } from '../simulationResultsSummaryStep';
import { getChartTimeSteps } from '../../shared';

export interface Marker {
  enabled: boolean;
}

export interface FlatAmountData {
  coinCode: string;
  initialWeight: number;
  finalWeight: number;
}

export interface FlatAmountTimeStep {
  date: string;
  unix: number;
  [key: string]: any;
}

type VolumeType = 'tradingVolume' | 'reserveQuantity';

export function SimulationResultAmountChart(props: BreakdownProps) {
  const simulationBreakdownResults = props.breakdowns;
  const simulationTimeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );
  const chartTheme = useAppSelector(selectAgChartTheme);

  const [volumeType, setVolumeType] = useState<VolumeType>('tradingVolume');

  //  function amountFormatter(amount: number) {
  //    var sansDec = amount.toFixed(0);
  //    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //    return `${formatted}`;
  //  }

  const normalisedTokenName = (token: string) => {
    return token.replace(/\./g, '-');
  };

  function getAmountDeltaData(
    breakdown: SimulationRunBreakdown
  ): FlatAmountTimeStep[] {
    const result: FlatAmountTimeStep[] = [];
    const data = getChartTimeSteps(breakdown);

    for (const [index, current] of data.entries()) {
      const prev = data[index - 1];

      const timeStep: FlatAmountTimeStep = {
        date: current.date,
        unix: current.unix,
      };

      current.coinsHeld.forEach((coinHeld) => {
        const lowerCode = coinHeld.coin.coinCode.toLowerCase();
        if (coinHeld.amount) {
          timeStep[normalisedTokenName(lowerCode)] = Math.abs(
            coinHeld.amount -
              (prev?.coinsHeld.find(
                (z) => z.coin.coinCode == coinHeld.coin.coinCode
              )?.amount ?? 0)
          );
        }
      });

      result.push(timeStep);
    }

    return result;
  }

  function getAmountData(breakdown: SimulationRunBreakdown) {
    const result: FlatAmountTimeStep[] = [];
    let data = getChartTimeSteps(breakdown);

    if (data.length > 500) {
      //stacked chart is more cpu intensive, ~500 points is a good balance
      const proportion = Math.ceil(data.length / 500);
      data = data.filter((_, index) => index % proportion === 0);
    }
    for (const current of data) {
      const timeStep: FlatAmountTimeStep = {
        date: current.date,
        unix: current.unix,
      };

      current.coinsHeld.forEach((coinHeld) => {
        const lowerCode = coinHeld.coin.coinCode.toLowerCase();
        timeStep[normalisedTokenName(lowerCode)] = coinHeld.amount;
      });

      result.push(timeStep);
    }
    return result;
  }

  function getAmountSeries(
    breakdown: SimulationRunBreakdown
  ): agCharts.AgCartesianSeriesOptions[] {
    const series: agCharts.AgCartesianSeriesOptions[] = [];
    breakdown.simulationRun.poolConstituents.forEach((x) => {
      series.push({
        type: 'line',
        xKey: 'unix',
        yKey: x.coin.coinCode.toLowerCase(),
        yName: x.coin.coinCode.toLowerCase(),
        marker: { enabled: false },
      });
    });
    return series;
  }

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
      <Row>
        <Col span={24}>
          <Divider className={styles.simResultDividers}>Amount Changes</Divider>
        </Col>
        <Col span={8}>
          <Form.Item label="Chart Data">
            <Radio.Group
              value={volumeType}
              onChange={(e) => setVolumeType(e.target.value)}
            >
              <Radio.Button value={'tradingVolume'}>
                Trading Volume
              </Radio.Button>
              <Radio.Button value={'reserveQuantity'}>
                Reserve Quantity
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row className={styles.resultChartRow}>
        <Col span={24}>
          {simulationBreakdownResults
            .filter((x) => x.simulationRun.updateRule.updateRuleName != 'HODL')
            .filter((x) => x.simulationRunStatus == 'Complete')
            .filter((x) => x.timeRange.name == simulationTimeRangeSelected)
            .map((x, index) => (
              <Row key={index}>
                <Col span={4}>
                  <div className={styles.weightChartDescription}>
                    <h4>{x.simulationRun.updateRule.updateRuleName}</h4>
                    <p>For time period:&nbsp;{x.timeRange.name}</p>
                    <p>start date:&nbsp;{x.timeRange.startDate}</p>
                    <p>end date:&nbsp;{x.timeRange.endDate}</p>
                  </div>
                </Col>
                <Col
                  span={20}
                  style={{
                    display:
                      volumeType === 'reserveQuantity' ? 'none' : 'block',
                  }}
                >
                  <AgCharts
                    options={{
                      height: 350,
                      data: getAmountDeltaData(x),
                      navigator: {
                        enabled: true,
                        height: 5,
                        spacing: 6,
                      },
                      axes: [
                        getTimeAxisOption(getAmountDeltaData(x).length),
                        {
                          type: 'log',
                          position: 'left',
                          base: 2,
                          label: {
                            format: '~s',
                          },
                        },
                      ],
                      series: getAmountSeries(x),
                      legend: {
                        position: 'bottom',
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
                        },
                      },
                    }}
                  />
                </Col>
                <Col
                  span={20}
                  style={{
                    display:
                      volumeType !== 'reserveQuantity' ? 'none' : 'block',
                  }}
                >
                  <AgCharts
                    options={{
                      height: 350,
                      data: getAmountData(x),
                      navigator: {
                        enabled: true,
                        height: 5,
                        spacing: 6,
                      },
                      axes: [
                        getTimeAxisOption(getAmountDeltaData(x).length),
                        {
                          type: 'log',
                          position: 'left',
                          base: 2,
                          label: {
                            format: '~s',
                          },
                        },
                      ],
                      series: getAmountSeries(x),
                      legend: {
                        position: 'bottom',
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
                        },
                      },
                    }}
                  />
                </Col>
              </Row>
            ))}
        </Col>
      </Row>
    </div>
  );
}
