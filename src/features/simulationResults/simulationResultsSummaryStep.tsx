import styles from './simulationResultSummary.module.css';
import {
  changeChartSelected,
  changeBreakdownSelected,
  changeVisualisationTimeRangeSelected,
  selectSimulationResultChartSelection,
  selectSimulationResultBreakdownSelection,
  selectSimulationRunStatusStepIndex,
  selectSimulationResultTimeRangeSelection,
} from '../simulationRunner/simulationRunnerSlice';

import { Col, Menu, Row, Tabs } from 'antd';
import { useEffect } from 'react';

import {
  LineChartOutlined,
  DownOutlined,
  PieChartOutlined,
  BoxPlotOutlined,
  BarChartOutlined,
  HeatMapOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';

import { SimulationResultWeightChart } from './visualisations/simulationResultWeightChart';
import { SimulationResultReturnChart } from './visualisations/simulationResultReturnChart';
import { SimulationRunPerformanceAnalysisBreakdown } from './breakdowns/simulationResultAnalysisBreakdown';
import { SimulationRunMvSummaryBreakdown } from './breakdowns/simulationResultMvSummaryBreakdown';
import { SimulationResultAmountChart } from './visualisations/simulationResultAmountChart';
import { SimulationResultMarketValueChart } from './visualisations/simulationResultMarketValueChart';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { SimulationRunBreakdown } from './simulationResultSummaryModels';
import { ItemType } from 'antd/es/menu/interface';
import { SimulationResultDrawdownChart } from './visualisations/simulationResultDrawdownGraph';
import { Dictionary } from '@reduxjs/toolkit';

const { TabPane } = Tabs;

export interface BreakdownProps {
  breakdowns: SimulationRunBreakdown[];
  forceViewResults: boolean;
  overrideHeight?: number;
  overrideXAxisInterval?: number;
  overrideYAxisInterval?: number[];
  overrideYAxisMax?: number;
  overrideYAxisMin?: number;
  overrideSeriesStrokeColor?: Dictionary<string>;
  overrideSeriesName?: Dictionary<string>;
  overrideNagivagtion?: boolean;
  overrideTitle?: string;
  hideTitle?: boolean;
}

function getMenuItem(
  label: string,
  key: string,
  icon: JSX.Element,
  disabled: boolean
): ItemType {
  return {
    key,
    label,
    icon,
    disabled,
  } as ItemType;
}

function getGraphMenuItems(): ItemType[] {
  return [
    getMenuItem('Select Visualisation', 'placeholder', <DownOutlined />, true),
    getMenuItem(
      'Pool $ value over time',
      'MarketValueOverTime',
      <LineChartOutlined />,
      false
    ),
    getMenuItem('MV Weight over time', 'Weights', <PieChartOutlined />, false),
    getMenuItem('Amount over time', 'Amounts', <LineChartOutlined />, false),
    getMenuItem('Drawdowns', 'Drawdowns', <BoxPlotOutlined />, false),
    getMenuItem('Return Distribution', 'Returns', <BarChartOutlined />, false),
  ];
}

function getBreakdownMenuItems(): ItemType[] {
  return [
    getMenuItem('Select Breakdown', 'placeholder', <DownOutlined />, true),
    getMenuItem(
      'Market Value Summary',
      'MvSummary',
      <OrderedListOutlined />,
      false
    ),
    getMenuItem(
      'Performance Analysis',
      'PerformanceAnalysis',
      <HeatMapOutlined />,
      false
    ),
  ];
}

export function SimulationResultsSummaryStep(props: BreakdownProps) {
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const resultChartSelection = useAppSelector(
    selectSimulationResultChartSelection
  );
  const resultBreakdownSelection = useAppSelector(
    selectSimulationResultBreakdownSelection
  );
  const timeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );
  const chartSelection = useAppSelector(selectSimulationResultChartSelection);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      props.breakdowns.length > 0 &&
      props.breakdowns.find((x) => x.timeRange.name === timeRangeSelected) ===
        undefined
    ) {
      dispatch(
        changeVisualisationTimeRangeSelected(props.breakdowns[0].timeRange.name)
      );
    }
  }, [dispatch, props.breakdowns, timeRangeSelected]);

  function getChart(): JSX.Element {
    if (resultChartSelection === 'MarketValueOverTime') {
      return (
        <SimulationResultMarketValueChart
          breakdowns={props.breakdowns}
          forceViewResults={props.forceViewResults}
        />
      );
    } else if (resultChartSelection === 'Weights') {
      return (
        <SimulationResultWeightChart
          breakdowns={props.breakdowns}
          forceViewResults={props.forceViewResults}
        />
      );
    } else if (resultChartSelection === 'Drawdowns') {
      return (
        <SimulationResultDrawdownChart
          breakdowns={props.breakdowns}
          forceViewResults={props.forceViewResults}
          hideTitle={false}
        />
      );
    } else if (resultChartSelection === 'Returns') {
      return (
        <SimulationResultReturnChart
          breakdowns={props.breakdowns}
          forceViewResults={props.forceViewResults}
        />
      );
    } else if (resultChartSelection === 'Amounts') {
      return (
        <SimulationResultAmountChart
          breakdowns={props.breakdowns}
          forceViewResults={props.forceViewResults}
        />
      );
    }

    return <div>No charts selected</div>;
  }

  function getBreakdown(): JSX.Element {
    if (resultBreakdownSelection === 'MvSummary') {
      return (
        <SimulationRunMvSummaryBreakdown
          breakdowns={props.breakdowns}
          forceViewResults={props.forceViewResults}
        ></SimulationRunMvSummaryBreakdown>
      );
    } else if (resultBreakdownSelection === 'PerformanceAnalysis') {
      return <SimulationRunPerformanceAnalysisBreakdown {...props} />;
    }
    return <div>No Breakdown</div>;
  }

  const VisualisationTab = () => (
    <Row>
      <Col span={4}>
        <Row justify="center">
          <Col span={24}>
            <Menu
              style={{
                width: 200,
                fontSize: 10,
              }}
              defaultSelectedKeys={[chartSelection]}
              items={getGraphMenuItems()}
              activeKey={chartSelection}
              onClick={(x) => {
                dispatch(changeChartSelected(x.key));
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col span={20}>
        {runStatusIndex === 2 || props.forceViewResults ? (
          getChart()
        ) : (
          <h2>Simulation not finished yet</h2>
        )}
      </Col>
    </Row>
  );

  const BreakdownTab = () => (
    <Row>
      <Col span={4}>
        <Row justify="center">
          <Col span={24}>
            <Menu
              style={{
                width: 200,
                fontSize: 10,
              }}
              defaultSelectedKeys={[resultBreakdownSelection]}
              items={getBreakdownMenuItems()}
              onClick={(x) => {
                dispatch(changeBreakdownSelected(x.key));
              }}
              activeKey={resultBreakdownSelection}
            />
          </Col>
        </Row>
      </Col>
      <Col span={20}>{getBreakdown()}</Col>
    </Row>
  );

  return (
    <Row className={styles.simRunSection}>
      <Col span={24}>
        <Tabs>
          <TabPane tab="Result Visualisation" key={'vis'}>
            <VisualisationTab />
          </TabPane>
          <TabPane tab="Result Breakdown" key={'breakdown'}>
            <BreakdownTab />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}
