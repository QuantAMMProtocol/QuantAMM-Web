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
        if (x.timeSteps.length != 0) {
          const data = getChartTimeSteps(x);
          seriesArray.push({
            xKey: 'unix',
            yKey: 'totalPoolMarketValue',
            yName:
              x.simulationRun.updateRule.updateRuleName +
              getDuplicateUpdateRuleNames(
                breakdowns,
                x.simulationRun.updateRule.updateRuleName
              ),
            data: [...data],
            marker: { enabled: false },
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
      <Divider className={styles.simResultDividers}>
        Pool Holding $ over time
      </Divider>

      <Row>
        <Col span={24}>
          <Row className={styles.marketValueChart}>
            <Col span={24}>
              <AgCharts
                options={{
                  height: 500,
                  navigator: {
                    enabled: true,
                    height: 5,
                    spacing: 6,
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
