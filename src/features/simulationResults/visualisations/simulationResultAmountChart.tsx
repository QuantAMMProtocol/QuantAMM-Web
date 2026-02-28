import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { AgChartOptions, AgTimeAxisOptions } from 'ag-charts-community';
import { memo, useMemo, useState } from 'react';

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

const normalisedTokenName = (token: string) => token.replace(/\./g, '-');

function getAmountDeltaData(breakdown: SimulationRunBreakdown): FlatAmountTimeStep[] {
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
      if (coinHeld.amount !== undefined && coinHeld.amount !== null) {
        timeStep[normalisedTokenName(lowerCode)] = Math.abs(
          coinHeld.amount -
            (prev?.coinsHeld.find(
              (z) => z.coin.coinCode === coinHeld.coin.coinCode
            )?.amount ?? 0)
        );
      }
    });

    result.push(timeStep);
  }

  return result;
}

function getAmountData(breakdown: SimulationRunBreakdown): FlatAmountTimeStep[] {
  const result: FlatAmountTimeStep[] = [];
  let data = getChartTimeSteps(breakdown);

  if (data.length > 500) {
    // stacked chart is cpu intensive; reduce points to keep UI responsive
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
  return breakdown.simulationRun.poolConstituents.map((x) => ({
    type: 'line',
    xKey: 'unix',
    yKey: normalisedTokenName(x.coin.coinCode.toLowerCase()),
    yName: x.coin.coinCode.toLowerCase(),
    marker: { enabled: false },
  }));
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

const AmountBreakdownRow = memo(function AmountBreakdownRow({
  breakdown,
  volumeType,
}: {
  breakdown: SimulationRunBreakdown;
  volumeType: VolumeType;
}) {
  const chartTheme = useAppSelector(selectAgChartTheme);

  const amountDeltaData = useMemo(
    () => getAmountDeltaData(breakdown),
    [breakdown]
  );
  const amountData = useMemo(() => getAmountData(breakdown), [breakdown]);
  const amountSeries = useMemo(() => getAmountSeries(breakdown), [breakdown]);

  const tradingVolumeOptions = useMemo<AgChartOptions>(
    () => ({
      height: 350,
      data: amountDeltaData,
      navigator: {
        enabled: true,
        height: 5,
        spacing: 6,
      },
      axes: [
        getTimeAxisOption(amountDeltaData.length),
        {
          type: 'log',
          position: 'left',
          base: 2,
          label: {
            format: '~s',
          },
        },
      ],
      series: amountSeries,
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
    }),
    [amountDeltaData, amountSeries, chartTheme]
  );

  const reserveQuantityOptions = useMemo<AgChartOptions>(
    () => ({
      height: 350,
      data: amountData,
      navigator: {
        enabled: true,
        height: 5,
        spacing: 6,
      },
      axes: [
        getTimeAxisOption(amountData.length),
        {
          type: 'log',
          position: 'left',
          base: 2,
          label: {
            format: '~s',
          },
        },
      ],
      series: amountSeries,
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
    }),
    [amountData, amountSeries, chartTheme]
  );

  return (
    <Row>
      <Col span={4}>
        <div className={styles.weightChartDescription}>
          <h4>{breakdown.simulationRun.updateRule.updateRuleName}</h4>
          <p>For time period:&nbsp;{breakdown.timeRange.name}</p>
          <p>start date:&nbsp;{breakdown.timeRange.startDate}</p>
          <p>end date:&nbsp;{breakdown.timeRange.endDate}</p>
        </div>
      </Col>
      <Col
        span={20}
        style={{
          display: volumeType === 'reserveQuantity' ? 'none' : 'block',
        }}
      >
        <AgCharts options={tradingVolumeOptions} />
      </Col>
      <Col
        span={20}
        style={{
          display: volumeType !== 'reserveQuantity' ? 'none' : 'block',
        }}
      >
        <AgCharts options={reserveQuantityOptions} />
      </Col>
    </Row>
  );
});

function SimulationResultAmountChartComponent(props: BreakdownProps) {
  const simulationTimeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );
  const [volumeType, setVolumeType] = useState<VolumeType>('tradingVolume');

  const visibleBreakdowns = useMemo(
    () =>
      props.breakdowns
        .filter((x) => x.simulationRun.updateRule.updateRuleName !== 'HODL')
        .filter((x) => x.simulationRunStatus === 'Complete')
        .filter((x) => x.timeRange.name === simulationTimeRangeSelected),
    [props.breakdowns, simulationTimeRangeSelected]
  );

  const chartDataTypeSelector = (
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
            <Radio.Button value={'tradingVolume'}>Trading Volume</Radio.Button>
            <Radio.Button value={'reserveQuantity'}>
              Reserve Quantity
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <div>
      {chartDataTypeSelector}
      <Row className={styles.resultChartRow}>
        <Col span={24}>
          {visibleBreakdowns.map((breakdown) => (
            <AmountBreakdownRow
              key={`${breakdown.simulationRun.id}-${breakdown.timeRange.name}-${breakdown.simulationRun.updateRule.updateRuleKey}`}
              breakdown={breakdown}
              volumeType={volumeType}
            />
          ))}
        </Col>
      </Row>
    </div>
  );
}

export const SimulationResultAmountChart = memo(SimulationResultAmountChartComponent);
