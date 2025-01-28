import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';

import { Row, Col, Divider } from 'antd';

import { useAppSelector } from '../../../app/hooks';
import styles from '../simulationResultSummary.module.css';
import { selectAgGridTheme } from '../../themes/themeSlice';
import { AnalysisBreakdownTable } from '../../shared/tables';
import { BreakdownProps } from '../simulationResultsSummaryStep';

export function SimulationRunPerformanceAnalysisBreakdown(
  props: BreakdownProps
) {
  const darkThemeAg = useAppSelector(selectAgGridTheme);

  return (
    <div>
      <Divider>Quantitative Analysis Summary</Divider>
      <Row>
        <Col span={24}>
          <div className="wrapper">
            <div
              id="myGrid"
              className={styles.summaryTableParent + ' ' + darkThemeAg}
            >
              <AnalysisBreakdownTable
                simulationRunBreakdowns={props.breakdowns}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
