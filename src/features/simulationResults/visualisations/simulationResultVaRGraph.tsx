import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { AgTimeAxisOptions } from 'ag-charts-community';

import styles from '../simulationResultSummary.module.css';
import { useAppSelector } from '../../../app/hooks';
import { Row, Col, Divider, Dropdown, Space } from 'antd';
import { selectSimulationResultTimeRangeSelection } from '../../simulationRunner/simulationRunnerSlice';
import { VaRTimestep } from '../simulationResultSummaryModels';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { BreakdownProps } from '../simulationResultsSummaryStep';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { SimulationResultTimestepDto } from '../../simulationRunner/simulationRunnerDtos';

export interface Marker {
  enabled: boolean;
}

export interface VaRSeriesConfig {
  type: string;
  xKey: string;
  yKey: string;
  yName: string;
  data: VaRTimestep[];
  marker: Marker;
}

export function SimulationResultVaRChart(props: BreakdownProps) {
  const simulationTimeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );
  const chartTheme = useAppSelector(selectAgChartTheme);

  const [varType, setVarType] = useState('Weekly CDaR');

  const onClick = ({ key }: { key: string }) => {
    setVarType(key);
  };

  const items = [
    { label: 'Weekly CDaR', key: 'Weekly CDaR' },
    { label: 'Monthly CDaR', key: 'Monthly CDaR' },
  ];

  function getSeriesForSelectedVaRType(): agCharts.AgCartesianSeriesOptions[] {
    const seriesArray: agCharts.AgCartesianSeriesOptions[] = [];
    props.breakdowns
      .filter((x) => x.timeRange.name == simulationTimeRangeSelected)
      .forEach((x) => {
        const timeSeries =
          x.simulationRunResultAnalysis?.return_timeseries_analysis.find(
            (y) => y.metricName == varType
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
            yName: `${x.simulationRun?.updateRule?.updateRuleKey || 'Unknown'} ${varType}`,
            data: timeSeriesValues,
            marker: { enabled: false },
          });
        }
      });

    return seriesArray;
  }

  function getTimeAxisOption(): AgTimeAxisOptions {
    let dataLength = 1;
    const breakdowns = props.breakdowns.filter(
      (x) => x.timeRange.name == simulationTimeRangeSelected
    );
    if (breakdowns.length > 0) {
      dataLength = breakdowns[0].timeSteps.length;
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

  return (
    <div>
      <Row>
        <Col span={16}>
          <Divider className={styles.simResultDividers}>Historic VaR</Divider>
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
                {varType}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Col>
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
              series: getSeriesForSelectedVaRType(),
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
