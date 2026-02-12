import { FC, useMemo, useRef, useState } from 'react';
import { ColDef, GridOptions, SideBarDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button, Col, Row, Typography } from 'antd';
import { useAppSelector } from '../../../app/hooks';
import { selectAgGridTheme } from '../../themes/themeSlice';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';
import { getAnalysisSummary } from './AnalysisBreakdownTableHelpers';
import { CURRENT_LIVE_FACTSHEETS } from '../../documentation/factSheets/liveFactsheets';

const { Title } = Typography;

interface AnalysisBreakdownTableProps {
  simulationRunBreakdowns: SimulationRunBreakdown[];
  height?: number;
  productId?: string;
}

export const AnalysisBreakdownTable: FC<AnalysisBreakdownTableProps> = ({
  simulationRunBreakdowns,
  height = 700,
  productId,
}) => {
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const gridRef = useRef<AgGridReact>(null);

  const [finAnalysisColDefs] = useState<ColDef[]>([
    { colId: 'updateRule', field: 'updateRule', headerName: 'Update Rule' },
    {
      colId: 'parameters',
      field: 'parameters',
      headerName: 'Parameters',
      hide: true,
    },
    {
      colId: 'timePeriodName',
      field: 'timePeriodName',
      headerName: 'Time Period',
      rowGroupIndex: 0,
      hide: true,
    },
    {
      colId: 'benchmark',
      field: 'benchmark',
      headerName: 'R(b)',
      rowGroupIndex: 2,
      hide: true,
    },
    {
      colId: 'rf',
      field: 'rf',
      headerName: 'R(f)',
      rowGroupIndex: 1,
      hide: true,
    },
    {
      colId: 'metricName',
      field: 'metricName',
      sortable: true,
      sort: 'asc',
      headerName: 'MetricName',
      minWidth: 250,
    },
    {
      colId: 'metricValue',
      field: 'metricValue',
      headerName: 'metricValue',
    },
  ]);

  const analysisGridOptions: GridOptions = useMemo(
    () => ({
      columnDefs: finAnalysisColDefs,
      rowHeight: 26,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        sortable: true,
        resizable: true,
        enablePivot: true,
      },
      columnTypes: {
        // define a number type for numeric columns
        number: { filter: 'agNumberColumnFilter', sortable: true },
        nonEditableColumn: { editable: false },
      },
      groupDefaultExpanded: 3,
    }),
    [finAnalysisColDefs]
  );

  const sideBar: SideBarDef = useMemo(
    () => ({
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          minWidth: 100,
          maxWidth: 300,
          width: 200,
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
          minWidth: 100,
          maxWidth: 300,
          width: 200,
        },
      ],
      position: 'right',
      defaultToolPanel: 'none',
    }),
    []
  );

  const rowData = useMemo(
    () => getAnalysisSummary(simulationRunBreakdowns),
    [simulationRunBreakdowns]
  );

  const isLivePool = useMemo(
    () =>
      !!CURRENT_LIVE_FACTSHEETS.factsheets.find(
        (factsheet) => factsheet.poolId === (productId ?? '')
      ),
    [productId]
  );

  const handleDownloadCSV = () => {
    gridRef.current?.api?.exportDataAsCsv();
  };

  return (
    <div style={{ width: '100%' }}>
      <Row>
        <Col
          span={24}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            paddingLeft: 8,
            borderBottom: '1px solid var(--primary-lighter)',
          }}
        >
          <Title
            level={4}
            style={{
              width: '90%',
              marginBottom: 0,
              paddingLeft: 8,
              paddingTop: 8,
            }}
          >
            <Row>
              <Col span={20}>
                <h4>
                  {isLivePool
                    ? 'Simulated Backtest Metric Values'
                    : 'Metric Raw Values'}
                </h4>
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleDownloadCSV}
                  style={{ marginTop: 20 }}
                >
                  Download CSV
                </Button>
              </Col>
            </Row>
          </Title>
        </Col>
      </Row>
      <div
        id="details"
        className={darkThemeAg}
        style={{ height, width: '100%', marginTop: 10 }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          gridOptions={analysisGridOptions}
          columnDefs={finAnalysisColDefs}
          sideBar={sideBar}
        />
      </div>
    </div>
  );
};
