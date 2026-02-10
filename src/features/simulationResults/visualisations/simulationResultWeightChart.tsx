import { Row, Col, Divider } from 'antd';
import { AgCharts } from 'ag-charts-react';
import { AgDonutSeriesOptions } from 'ag-charts-community';
import { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectSimulationResultTimeRangeSelection } from '../../simulationRunner/simulationRunnerSlice';
import { WeightChangeOverTimeGraph } from '../../shared/graphs/weightChangeOverTime';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { SimulationRunBreakdown } from '../simulationResultSummaryModels';
import { BreakdownProps } from '../simulationResultsSummaryStep';

import styles from '../simulationResultSummary.module.css';

export interface Marker {
  enabled: boolean;
}
export interface FlatWeightData {
  coinCode: string;
  initialWeight: number;
  finalWeight: number;
}
export interface FlatWeightTimeStep {
  date: string;
  unix: number;
  [key: string]: any;
}

export function SimulationResultWeightChart({ breakdowns }: BreakdownProps) {
  const simulationTimeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );
  const chartTheme = useAppSelector(selectAgChartTheme);

  function getPieWeightData(
    breakdown: SimulationRunBreakdown
  ): FlatWeightData[] {
    const data: FlatWeightData[] = [];
    const final = breakdown.timeSteps[breakdown.timeSteps.length - 1];
    breakdown.simulationRun.poolConstituents.forEach((x) => {
      if (x.weight !== undefined) {
        data.push({
          coinCode: x.coin.coinCode,
          initialWeight: x.weight,
          finalWeight:
            final.coinsHeld.find((y) => y.coin.coinCode === x.coin.coinCode)
              ?.weight ?? x.weight,
        });
      }
    });

    return data;
  }

  function getPieSimulationResultSeries(
    breakdown: SimulationRunBreakdown
  ): AgDonutSeriesOptions[] {
    const seriesArray: AgDonutSeriesOptions[] = [];

    if (breakdown.timeSteps.length !== 0) {
      seriesArray.push({
        type: 'donut',
        sectorLabelKey: 'coinCode',
        angleKey: 'finalWeight',
        outerRadiusOffset: -5,
        innerRadiusOffset: -15,
        outerRadiusRatio: 1,
        innerRadiusRatio: 0.6,
        shadow: {
          enabled: true,
        },
      });

      seriesArray.push({
        type: 'donut',
        angleKey: 'initialWeight',
        outerRadiusOffset: -15,
        innerRadiusOffset: -25,
        outerRadiusRatio: 0.6,
        innerRadiusRatio: 0.1,
        shadow: {
          enabled: true,
        },
      });
    }

    return seriesArray;
  }

  const visibleBreakdowns = useMemo(
    () =>
      breakdowns
        .filter(
          (result: SimulationRunBreakdown) =>
            result.simulationRunStatus === 'Complete'
        )
        .filter(
          (result: SimulationRunBreakdown) =>
            result.timeRange.name === simulationTimeRangeSelected
        ),
    [breakdowns, simulationTimeRangeSelected]
  );

  return (
    <div>
      <Row>
        <Col span={4}></Col>
        <Col span={6}>
          <Divider className={styles.simResultDividers}>
            Final (outer) vs initial (inner) % weight
          </Divider>
        </Col>
        <Col span={14}>
          <Divider className={styles.simResultDividers}>
            weight change over time
          </Divider>
        </Col>
      </Row>
      <Row className={styles.resultChartRow}>
        <Col span={24}>
          {visibleBreakdowns.map((result: SimulationRunBreakdown, index: number) => (
              <Row key={index}>
                <Col span={4}>
                  <div className={styles.weightChartDescription}>
                    <h4>{result.simulationRun.updateRule.updateRuleName}</h4>
                    <p>start date:&nbsp;{result.timeRange.startDate}</p>
                    <p>end date:&nbsp;{result.timeRange.endDate}</p>
                  </div>
                </Col>
                <Col span={6}>
                  <AgCharts
                    options={{
                      height: 220,
                      width: 300,
                      data: getPieWeightData(result),
                      series: getPieSimulationResultSeries(result),
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
                              cursor: 'crosshair',
                              marker: {
                                enabled: false,
                              },
                            },
                          },
                        },
                      },
                    }}
                  />
                </Col>
                <Col span={14}>
                  <WeightChangeOverTimeGraph simulationRunBreakdown={result} />
                </Col>
              </Row>
            ))}
        </Col>
      </Row>
    </div>
  );
}
