import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { AgTimeAxisOptions } from 'ag-charts-community';
import styles from '../simulationResultSummary.module.css';
import { useAppSelector } from '../../../app/hooks';
import { Row, Col, Divider, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { selectSimulationResultTimeRangeSelection } from '../../simulationRunner/simulationRunnerSlice';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { BreakdownProps } from '../simulationResultsSummaryStep';
import { useState } from 'react';
import { SimulationResultTimestepDto } from '../../simulationRunner/simulationRunnerDtos';

export function SimulationResultDrawdownChart(props: BreakdownProps) {
  const simulationTimeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );
  const chartTheme = useAppSelector(selectAgChartTheme);

  const [drawdownType, setDrawdownType] = useState(
    'Avg Daily Drawdown per week'
  );

  const onClick = ({ key }: { key: string }) => {
    setDrawdownType(key);
  };

  function getTimeAxisOption(): AgTimeAxisOptions {
    let dataLength = 1;
    const visibleBreakdown = props.breakdowns.filter(
      (x) => x.timeRange.name == simulationTimeRangeSelected
    );

    if (visibleBreakdown.length > 0) {
      dataLength = visibleBreakdown[0].timeSteps.length;
    }

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

  const items = [
    {
      label: 'Avg Daily Drawdown per week',
      key: 'Avg Daily Drawdown per week',
    },
    {
      label: 'Avg Daily Drawdown per month',
      key: 'Avg Daily Drawdown per month',
    },
    {
      label: 'Daily Maximum Drawdown per week',
      key: 'Daily Maximum Drawdown per week',
    },
    {
      label: 'Daily Maximum Drawdown per month',
      key: 'Daily Maximum Drawdown per month',
    },
    { label: 'Weekly Ulcer Index', key: 'Weekly Ulcer Index' },
    { label: 'Monthly Ulcer Index', key: 'Monthly Ulcer Index' },
    { label: 'Weekly Sterling Ratio', key: 'Weekly Sterling Ratio' },
    { label: 'Monthly Sterling Ratio', key: 'Monthly Sterling Ratio' },
    { label: 'Weekly CDaR', key: 'Weekly CDaR' },
    { label: 'Monthly CDaR', key: 'Monthly CDaR' },
  ];

  function getSeriesForSelectedDrawdownType(): agCharts.AgCartesianSeriesOptions[] {
    const seriesArray: agCharts.AgCartesianSeriesOptions[] = [];
    props.breakdowns
      .filter((x) => x.timeRange.name == simulationTimeRangeSelected)
      .forEach((x) => {
        const timeSeries =
          x.simulationRunResultAnalysis?.return_timeseries_analysis.find(
            (y) => y.metricName == drawdownType
          );
        let timeSeriesValues: SimulationResultTimestepDto[] = [];

        if (timeSeries) {
          timeSeriesValues = [
            ...timeSeries.timeSteps.map((x) => {
              return {
                unix: x.unix * 1000,
                timeStepTotal: x.timeStepTotal,
                coinsHeld: x.coinsHeld,
              };
            }),
          ];
        }

        if (timeSeriesValues.length > 0) {
          seriesArray.push({
            type: 'line',
            xKey: 'unix',
            yKey: 'timeStepTotal',
            yName: `${x.simulationRun?.updateRule?.updateRuleName || 'Unknown'} ${drawdownType}`,
            data: timeSeriesValues,
            marker: { enabled: false },
          });
        }
      });

    return seriesArray;
  }

  return (
    <div>
      <Row>
        <div hidden={props.hideTitle}>
        <Col span={16}>
          <Divider className={styles.simResultDividers}>
            Historic Drawdown
          </Divider>
        </Col>
        <Col span={8}>
          <Dropdown
            menu={{
              items,
              onClick,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {drawdownType}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Col>
        </div>
        <div hidden={!props.hideTitle}>
        <Col span={25}>
          <Dropdown
            menu={{
              items,
              onClick,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {drawdownType}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Col>
        </div>
      </Row>
      <Row className={styles.resultChartRow}>
        <Col span={24}>
          <AgCharts
            options={{
              height: 400,
              navigator: {
                enabled: true,
                height: 5,
                spacing: 6,
              },
              axes: [
                getTimeAxisOption(),
                {
                  type: 'number',
                  position: 'left',
                },
              ],
              series: getSeriesForSelectedDrawdownType(),
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
    </div>
  );
}
