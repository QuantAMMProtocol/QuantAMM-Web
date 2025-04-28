import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { AgTimeAxisOptions } from 'ag-charts-community';

import styles from '../simulationResultSummary.module.css';
import { useAppSelector } from '../../../app/hooks';
import { Row, Col, Divider } from 'antd';
import {
  SimulationRunBreakdown,
  SimulationRunLiquidityPoolSnapshot,
} from '../simulationResultSummaryModels';
import { selectSimulationResultTimeRangeSelection } from '../../simulationRunner/simulationRunnerSlice';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { BreakdownProps } from '../simulationResultsSummaryStep';
import { getChartTimeSteps } from '../../shared';

export interface Marker {
  enabled: boolean;
}
export interface SeriesConfig {
  xKey: string;
  yKey: string;
  yName: string;
  data: SimulationRunLiquidityPoolSnapshot[];
  marker: Marker;
  stroke: string | undefined;
}

export function SimulationResultMarketValueChart(props: BreakdownProps) {
  const simulationBreakdownResults = props.breakdowns;
  const simulationTimeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );
  const chartTheme = useAppSelector(selectAgChartTheme);

  function getDuplicateUpdateRuleNames(
    breakdowns: SimulationRunBreakdown[],
    targetUpdateRuleName: string
  ): string {
    const updateRuleNameCounts: Record<string, number> = {};
    breakdowns.forEach((breakdown) => {
      const updateRuleName = breakdown.simulationRun.updateRule.updateRuleKey;
      if (updateRuleNameCounts[updateRuleName]) {
        updateRuleNameCounts[updateRuleName]++;
      } else {
        updateRuleNameCounts[updateRuleName] = 1;
      }
    });

    const duplicateNames = Object.keys(updateRuleNameCounts).filter(
      (key) => updateRuleNameCounts[key] > 1 && key === targetUpdateRuleName
    );

    if (duplicateNames.length > 0) {
      return duplicateNames.map((name, index) => `${index}_${name}`).join(', ');
    }

    return '';
  }

  function getSimulationResultSeries(
    breakdowns: SimulationRunBreakdown[]
  ): SeriesConfig[] {
    const seriesArray: SeriesConfig[] = [];

    breakdowns
      .filter((x) => x.simulationRunStatus == 'Complete')
      .filter((x) => x.timeRange.name == simulationTimeRangeSelected)
      .forEach((x) => {
        let stokeOverride = undefined;
        if (props.overrideSeriesStrokeColor != undefined) {
          const override =
            props.overrideSeriesStrokeColor[
              x.simulationRun.updateRule.updateRuleName
            ];
          if (override != null) {
            stokeOverride = override;
          }
        }

        let nameOverride =
          x.simulationRun.updateRule.updateRuleName +
          getDuplicateUpdateRuleNames(
            breakdowns,
            x.simulationRun.updateRule.updateRuleName
          );

        if (props.overrideSeriesName != undefined) {
          const override =
            props.overrideSeriesName[x.simulationRun.updateRule.updateRuleName];
          if (override != null) {
            nameOverride = override;
          }
        }
        if (x.timeSteps.length != 0) {
          const data = getChartTimeSteps(x);
          seriesArray.push({
            xKey: 'unix',
            yKey: 'totalPoolMarketValue',
            yName: nameOverride,
            data: [...data],
            marker: { enabled: false },
            stroke: stokeOverride,
          });
        }
      });

    return seriesArray;
  }

  function getTimeAxisOption(dataLength: number): AgTimeAxisOptions {
    return {
      type: 'time',
      interval: {
        step:
          props.overrideXAxisInterval != undefined
            ? agCharts.time.month.every(props.overrideXAxisInterval)
            : dataLength > 350
              ? agCharts.time.month.every(6)
              : dataLength > 150
                ? agCharts.time.month.every(3)
                : agCharts.time.month.every(1),
      },
      label: {
        format: '%Y-%m',
      },
    };
  }

  return (
    <div>
      <Divider className={styles.simResultDividers}>
        Simulated Pool Holding $ over time
      </Divider>

      <Row>
        <Col span={24}>
          <Row className={styles.marketValueChart}>
            <Col span={24}>
              <AgCharts
                options={{
                  height: props.overrideHeight ?? 500,
                  navigator: {
                    enabled: props.overrideNagivagtion ?? true,
                    height: 5,
                    spacing: 6,
                  },
                  padding: {
                    right: 40,
                  },
                  axes: [
                    getTimeAxisOption(
                      simulationBreakdownResults.filter(
                        (x) => x.timeRange.name == simulationTimeRangeSelected
                      )?.[0]?.timeSteps.length
                    ),
                    {
                      type: 'number',
                      position: 'left',
                      label: {
                        format: '$~s',
                      },
                      max: props.overrideYAxisMax ?? undefined,
                      min: props.overrideYAxisMin ?? undefined,
                      interval: props.overrideYAxisInterval
                        ? {
                            values: props.overrideYAxisInterval,
                          }
                        : undefined,
                    },
                  ],
                  series: getSimulationResultSeries(simulationBreakdownResults),
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
          </Row>
        </Col>
      </Row>
    </div>
  );
}
