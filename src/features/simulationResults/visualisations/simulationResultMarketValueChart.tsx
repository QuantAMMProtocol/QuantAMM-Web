import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { AgTimeAxisOptions } from 'ag-charts-community';
import { memo, useMemo } from 'react';

import styles from '../simulationResultSummary.module.css';
import { useAppSelector } from '../../../app/hooks';
import { Row, Col, Divider } from 'antd';
import { SimulationRunLiquidityPoolSnapshot } from '../simulationResultSummaryModels';
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

function SimulationResultMarketValueChartComponent(props: BreakdownProps) {
  const simulationBreakdownResults = props.breakdowns;
  const simulationTimeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );
  const chartTheme = useAppSelector(selectAgChartTheme);

  const visibleBreakdowns = useMemo(
    () =>
      simulationBreakdownResults
        .filter((x) => x.simulationRunStatus === 'Complete')
        .filter((x) => x.timeRange.name === simulationTimeRangeSelected),
    [simulationBreakdownResults, simulationTimeRangeSelected]
  );

  const series = useMemo((): SeriesConfig[] => {
    const seriesArray: SeriesConfig[] = [];

    const nameCounts = visibleBreakdowns.reduce<Record<string, number>>(
      (accumulator, breakdown) => {
        const ruleName = breakdown.simulationRun.updateRule.updateRuleName;
        accumulator[ruleName] = (accumulator[ruleName] ?? 0) + 1;
        return accumulator;
      },
      {}
    );
    const currentNameIndex: Record<string, number> = {};

    visibleBreakdowns.forEach((x) => {
      let stokeOverride = undefined;
      if (props.overrideSeriesStrokeColor !== undefined) {
        const override =
          props.overrideSeriesStrokeColor[
            x.simulationRun.updateRule.updateRuleName
          ];
        if (override != null) {
          stokeOverride = override;
        }
      }

      const baseRuleName = x.simulationRun.updateRule.updateRuleName;
      currentNameIndex[baseRuleName] =
        (currentNameIndex[baseRuleName] ?? 0) + 1;
      let nameOverride =
        nameCounts[baseRuleName] > 1
          ? `${baseRuleName} (${currentNameIndex[baseRuleName]})`
          : baseRuleName;

      if (props.overrideSeriesName !== undefined) {
        const override =
          props.overrideSeriesName[x.simulationRun.updateRule.updateRuleName];
        if (override != null) {
          nameOverride = override;
        }
      }
      if (x.timeSteps.length !== 0) {
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
  }, [
    props.overrideSeriesName,
    props.overrideSeriesStrokeColor,
    visibleBreakdowns,
  ]);

  const visibleBreakdownStepsLength =
    visibleBreakdowns[0]?.timeSteps.length ?? 1;

  const timeAxisOption = useMemo<AgTimeAxisOptions>(
    () => ({
      type: 'time',
      interval: {
        step:
          props.overrideXAxisInterval !== undefined
            ? agCharts.time.month.every(props.overrideXAxisInterval)
            : visibleBreakdownStepsLength > 350
              ? agCharts.time.month.every(6)
              : visibleBreakdownStepsLength > 150
                ? agCharts.time.month.every(3)
                : agCharts.time.month.every(1),
      },
      label: {
        format: '%Y-%m',
      },
    }),
    [props.overrideXAxisInterval, visibleBreakdownStepsLength]
  );

  const chartOptions = useMemo(
    () => ({
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
        timeAxisOption,
        {
          type: 'number' as const,
          position: 'left' as const,
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
      series,
      legend: {
        position: 'top' as const,
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
    }),
    [
      chartTheme,
      props.overrideHeight,
      props.overrideNagivagtion,
      props.overrideYAxisInterval,
      props.overrideYAxisMax,
      props.overrideYAxisMin,
      series,
      timeAxisOption,
    ]
  );

  return (
    <div>
      <div hidden={props.hideTitle}>
        <Divider className={styles.simResultDividers}>
          {props.overrideTitle ?? 'Simulated Pool Holding $ over time'}
        </Divider>
      </div>
      <Row>
        <Col span={24}>
          <Row className={styles.marketValueChart}>
            <Col span={24}>
              <AgCharts options={chartOptions} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export const SimulationResultMarketValueChart = memo(
  SimulationResultMarketValueChartComponent
);
