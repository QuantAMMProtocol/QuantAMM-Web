import { useAppSelector } from '../../../app/hooks';
import { Row, Col, Divider } from 'antd';
import { memo, useMemo } from 'react';
import { ReturnDistributionGraph } from '../../shared/graphs';
import { selectSimulationResultTimeRangeSelection } from '../../simulationRunner/simulationRunnerSlice';
import { BreakdownProps } from '../simulationResultsSummaryStep';

import styles from '../simulationResultSummary.module.css';
import {
  SimulationRunBreakdown,
  SimulationRunMetric,
} from '../simulationResultSummaryModels';

export interface Marker {
  enabled: boolean;
}
function getMetricName(
  metric: SimulationRunMetric[],
  metricName: string | string[],
  percentage = false
) {
  const metricNames = Array.isArray(metricName) ? metricName : [metricName];
  const selected = metric.find((x) => metricNames.includes(x.metricName));
  if (selected?.metricValue == null) {
    return '-';
  }

  return percentage
    ? (selected.metricValue * 100).toFixed(4)
    : selected.metricValue.toFixed(4);
}

const ReturnBreakdownRow = memo(function ReturnBreakdownRow({
  result,
}: {
  result: SimulationRunBreakdown;
}) {
  const marketValues = useMemo(
    () => result.timeSteps.map((x) => x.totalPoolMarketValue),
    [result.timeSteps]
  );

  return (
    <Row>
      <Col span={4}>
        <div className={styles.weightChartDescription}>
          <h4>{result.simulationRun.updateRule.updateRuleName}</h4>
          <p>For time period:&nbsp;{result.timeRange.name}</p>
          <p>start date:&nbsp;{result.timeRange.startDate}</p>
          <p>end date:&nbsp;{result.timeRange.endDate}</p>
        </div>
      </Col>
      <Col span={16}>
        <ReturnDistributionGraph marketValues={marketValues} />
      </Col>
      <Col span={4}>
        <Row>
          <Col span={24}>
            <p style={{ margin: 0 }}>
              mean:{' '}
              {getMetricName(
                result.simulationRunResultAnalysis?.return_analysis ?? [],
                'mean',
                true
              )}
            </p>
          </Col>
          <Col span={24}>
            <p style={{ margin: 0 }}>
              std:{' '}
              {getMetricName(
                result.simulationRunResultAnalysis?.return_analysis ?? [],
                'std',
                true
              )}
            </p>
          </Col>
          <Col span={24}>
            <p style={{ margin: 0 }}>
              skewness:{' '}
              {getMetricName(
                result.simulationRunResultAnalysis?.return_analysis ?? [],
                'skewness'
              )}
            </p>
          </Col>
          <Col span={24}>
            <p style={{ margin: 0 }}>
              Kurtosis:{' '}
              {getMetricName(
                result.simulationRunResultAnalysis?.return_analysis ?? [],
                'kurtosis'
              )}
            </p>
          </Col>
          <Col span={24}>
            <p style={{ margin: 0 }}>
              Jaque Bera:{' '}
              {getMetricName(
                result.simulationRunResultAnalysis?.return_analysis ?? [],
                ['jarqueBera', 'jarque_bera', 'jaqueBera']
              )}
            </p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
});

function SimulationResultReturnChartComponent(props: BreakdownProps) {
  const simulationBreakdownResults = props.breakdowns;
  const simulationTimeRangeSelected = useAppSelector(
    selectSimulationResultTimeRangeSelection
  );

  const visibleBreakdowns = useMemo(
    () =>
      simulationBreakdownResults
        .filter((result) => result.simulationRunStatus === 'Complete')
        .filter(
          (result) => result.timeRange.name === simulationTimeRangeSelected
        ),
    [simulationBreakdownResults, simulationTimeRangeSelected]
  );

  return (
    <div>
      <Divider className={styles.simResultDividers}>
        Return Distribution
      </Divider>
      <Row className={styles.resultChartRow}>
        <Col span={24}>
          {visibleBreakdowns.map((result) => (
            <ReturnBreakdownRow
              key={`${result.simulationRun.id}-${result.timeRange.name}-${result.simulationRun.updateRule.updateRuleKey}`}
              result={result}
            />
          ))}
        </Col>
      </Row>
    </div>
  );
}

export const SimulationResultReturnChart = memo(SimulationResultReturnChartComponent);
