import { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import {
  SideBarDef,
  ColDef,
  GridOptions,
  ICellRendererParams,
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  RowSelectedEvent,
  FirstDataRenderedEvent,
} from 'ag-grid-community';

import { Row, Col, Button } from 'antd';

import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import styles from '../simulationResultSummary.module.css';
import {
  FlatResultSummaryBreakdown,
  SimulationRunBreakdown,
} from '../simulationResultSummaryModels';
import { selectAgGridTheme } from '../../themes/themeSlice';
import {
  addRunResult,
  deselectBreakdownResult,
  removeRunResult,
  selectBreakdownResult,
  selectSimulationResults,
} from '../simulationResultSlice';
import { PoolDeploymentConfigReview } from '../../simulationRunner/simulationDeploymentPreview';

export interface RunDetailProps {
  breakdowns: SimulationRunBreakdown[];
  saveButton: boolean;
  selectButton: boolean;
  removeButton: boolean;
  tableHeight: string;
}

interface DeploymentPreviewViewProps {
  deploymentBreakdown: SimulationRunBreakdown;
  onGoBack: () => void;
}

function DeploymentPreviewView({
  deploymentBreakdown,
  onGoBack,
}: DeploymentPreviewViewProps) {
  return (
    <>
      <Row>
        <Col span={8}></Col>
        <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" onClick={onGoBack}>
            Go Back To Saved Results
          </Button>
        </Col>
        <Col span={8}></Col>
      </Row>
      <PoolDeploymentConfigReview
        pool={deploymentBreakdown.simulationRun}
        initialisationData={deploymentBreakdown?.simulationRunResultAnalysis}
      ></PoolDeploymentConfigReview>
    </>
  );
}

interface ResultSummaryGridViewProps {
  darkThemeAg: string;
  tableHeight: string;
  resultSummary: FlatResultSummaryBreakdown[];
  summaryGridOptions: GridOptions;
  summaryColDefs: ColDef[];
  sideBar: SideBarDef;
}

function ResultSummaryGridView({
  darkThemeAg,
  tableHeight,
  resultSummary,
  summaryGridOptions,
  summaryColDefs,
  sideBar,
}: ResultSummaryGridViewProps) {
  return (
    <div>
      <Row>
        <Col span={24} style={{ paddingLeft: 30, paddingRight: 30 }}>
          <div className="wrapper">
            <div
              id="myGrid"
              className={darkThemeAg}
              style={{ height: tableHeight }}
            >
              <AgGridReact
                className={styles.summaryTableParent}
                autoSizePadding={20}
                rowData={resultSummary}
                gridOptions={summaryGridOptions}
                columnDefs={summaryColDefs}
                rowSelection={'multiple'}
                sideBar={sideBar}
              ></AgGridReact>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export function SimulationResultsRunDetailsTable(props: RunDetailProps) {
  const dispatch = useAppDispatch();
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const savedBreakdowns = useAppSelector(selectSimulationResults);

  const simulationRunBreakdowns = props.breakdowns;

  function currencyFormatter(currency: number, sign: string) {
    if (currency === undefined) return '';
    const sansDec = currency.toFixed(0);
    const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }

  const download = useCallback((data: string, fileName: string) => {
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);

    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a');

    // Passing the blob downloading url
    a.setAttribute('href', url);

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', fileName + '.json');

    // Performing a download with click
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  const isFirstColumn = useCallback(
    (
      params:
        | CheckboxSelectionCallbackParams
        | HeaderCheckboxSelectionCallbackParams
    ) => {
      const displayedColumns = params.columnApi.getAllDisplayedColumns();
      const thisIsFirstColumn = displayedColumns[0] === params.column;
      return props.selectButton && thisIsFirstColumn;
    },
    [props.selectButton]
  );

  const [deploymentBreakdown, setDeploymentBreakdown] = useState(
    undefined as SimulationRunBreakdown | undefined
  );

  const summaryColDefs = useMemo<ColDef[]>(
    () => [
      {
        colId: 'poolConstituents',
        headerName: 'Constituents',
        valueGetter: (params) => {
          return (
            params.data.originatingBreakdown as SimulationRunBreakdown
          ).simulationRun.poolConstituents
            .filter((x) => x.weight !== undefined)
            .map(
              (x) =>
                '[' +
                x.coin.coinCode +
                ' | ' +
                currencyFormatter(x.weight!, '') +
                '%]'
            )
            .reduce<string>((accumulator, current) => {
              return accumulator + current;
            }, '');
        },
      },
      { colId: 'updateRule', field: 'updateRule', headerName: 'Update Rule' },
      {
        colId: 'parameters',
        field: 'parameters',
        headerName: 'Parameters',
        hide: true,
      },
      { colId: 'starDate', field: 'starDate', headerName: 'Start', hide: true },
      { colId: 'endDate', field: 'endDate', headerName: 'End', hide: true },
      {
        colId: 'initialMarketValue',
        field: 'initialMarketValue',
        headerName: 'Initial MV',
        filter: 'agNumberColumnFilter',
        type: ['numericColumn', 'nonEditableColumn'],
        enableValue: true,
        hide: true,
        valueFormatter: (params) =>
          currencyFormatter(params.data?.initialMarketValue, '$'),
      },
      {
        colId: 'finalMarketValue',
        field: 'finalMarketValue',
        headerName: 'Final MV',
        filter: 'agNumberColumnFilter',
        type: ['numericColumn', 'nonEditableColumn'],
        enableValue: true,
        hide: true,
        valueFormatter: (params) =>
          currencyFormatter(params.data?.finalMarketValue, '$'),
      },
      {
        colId: 'totalReturn',
        field: 'totalReturn',
        headerName: 'Total Return %',
        filter: 'agNumberColumnFilter',
        type: ['numericColumn', 'nonEditableColumn'],
        enableValue: true,
        cellClass: (params) => {
          const result: number = params.value ?? 0;
          switch (true) {
            case result > 0:
              return styles.profit;
            case result < 0:
              return styles.loss;
          }

          return '';
        },
      },
      {
        colId: 'deploymentPreview',
        cellRenderer: (params: ICellRendererParams) => (
          <Button
            onClick={() => {
              setDeploymentBreakdown(
                params.data.originatingBreakdown as SimulationRunBreakdown
              );
            }}
          >
            Deploy
          </Button>
        ),
        hide: props.breakdowns.length !== 1,
      },
      {
        colId: 'save',
        cellRenderer: (params: ICellRendererParams) => (
          <Button
            onClick={() => {
              dispatch(
                addRunResult(
                  params.data.originatingBreakdown as SimulationRunBreakdown
                )
              );
            }}
            disabled={
              savedBreakdowns.find(
                (x) =>
                  x.simulationRun.id ===
                    (params.data.originatingBreakdown as SimulationRunBreakdown)
                      .simulationRun.id &&
                  x.timeRange.name ===
                    (params.data.originatingBreakdown as SimulationRunBreakdown)
                      .timeRange.name
              ) !== undefined
            }
          >
            Save
          </Button>
        ),
        hide: !props.saveButton,
      },
      {
        colId: 'remove',
        cellRenderer: (params: ICellRendererParams) => (
          <Button
            onClick={() => {
              dispatch(
                removeRunResult(
                  params.data.originatingBreakdown as SimulationRunBreakdown
                )
              );
            }}
            disabled={
              savedBreakdowns.find(
                (x) =>
                  x.simulationRun.id ===
                    (params.data.originatingBreakdown as SimulationRunBreakdown)
                      .simulationRun.id &&
                  x.timeRange.name ===
                    (params.data.originatingBreakdown as SimulationRunBreakdown)
                      .timeRange.name
              ) === undefined
            }
          >
            Remove
          </Button>
        ),
        hide: !props.removeButton,
      },
      {
        colId: 'download',
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Button
              onClick={() => {
                const pool = params.data
                  .originatingBreakdown as SimulationRunBreakdown;
                download(
                  JSON.stringify(pool),
                  pool.simulationRun.updateRule.updateRuleKey +
                    '_' +
                    pool.simulationRun.poolConstituents
                      .map((x) => x.coin.coinCode)
                      .reduce<string>((accumulator, current) => {
                        return accumulator + '-' + current;
                      }, '')
                );
              }}
            >
              Download
            </Button>
          );
        },
      },
    ],
    [
      dispatch,
      download,
      props.breakdowns.length,
      props.removeButton,
      props.saveButton,
      savedBreakdowns,
    ]
  );

  const customRounding = (original: number | undefined): number | undefined => {
    if (original === undefined) {
      return original;
    }

    let maxDp = 0;
    const maxLowerDp = Math.pow(10, 8);
    let currentVal = original;
    let currentDp = Math.pow(10, maxDp + 2);
    while (maxLowerDp > currentDp) {
      currentDp = Math.pow(10, maxDp + 2);
      currentVal = original * currentDp;
      if (Math.abs(currentVal) > 100) {
        return Math.round(currentVal) / currentDp;
      }
      maxDp++;
    }

    return original;
  };
  const resultSummary = useMemo((): FlatResultSummaryBreakdown[] => {
    const results: FlatResultSummaryBreakdown[] = [];

    simulationRunBreakdowns.forEach((x) => {
      if (x.timeSteps.length === 0) {
        return;
      }
      const finalValues = x.timeSteps[x.timeSteps.length - 1];
      if (x.flatSimulationRunResult !== undefined) {
        results.push(x.flatSimulationRunResult);
      } else {
        results.push({
          updateRule: x.simulationRun.updateRule.updateRuleName,
          parameters: (
            x.simulationRun.updateRule.updateRuleParameters || []
          ).reduce<string>((accumulator, current) => {
            return (
              accumulator +
              '[' +
              current.factorName +
              ':' +
              current.factorValue +
              '] '
            );
          }, ''),
          timePeriodName: x.timeRange.name,
          starDate: x.timeRange.startDate,
          endDate: x.timeRange.endDate,
          initialMarketValue: x.timeSteps[0].totalPoolMarketValue,
          finalMarketValue:
            customRounding(finalValues.totalPoolMarketValue) ??
            finalValues.totalPoolMarketValue,
          totalReturn:
            customRounding(
              (x.timeSteps[x.timeSteps.length - 1].totalPoolMarketValue /
                x.timeSteps[0].totalPoolMarketValue -
                1) *
                100
            ) ?? 0,
          originatingBreakdown: x,
        });
      }
    });

    return results;
  }, [simulationRunBreakdowns]);

  const onRowSelected = useCallback(
    (event: RowSelectedEvent) => {
      if (!props.selectButton) return;

      const breakdown = event.node.data
        .originatingBreakdown as SimulationRunBreakdown;

      if (event.node.isSelected()) {
        dispatch(selectBreakdownResult(breakdown));
      } else {
        dispatch(deselectBreakdownResult(breakdown));
      }
    },
    [dispatch, props.selectButton]
  );

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    setTimeout(() => {
      const allColumnIds: string[] = [];
      params.api.getColumns()!.forEach((column) => {
        allColumnIds.push(column.getId());
      });
      params.api.autoSizeColumns(allColumnIds, false);
    }, 200); //needs to render before it can resize??
  }, []);

  const summaryGridOptions: GridOptions = useMemo(
    () => ({
      columnDefs: summaryColDefs,
      rowHeight: 40,
      onFirstDataRendered: onFirstDataRendered,
      onRowSelected: onRowSelected,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        sortable: true,
        resizable: true,
        enablePivot: true,
        headerCheckboxSelection: isFirstColumn,
        checkboxSelection: isFirstColumn,
      },
      columnTypes: {
        nonEditableColumn: { editable: false },
      },
      groupDefaultExpanded: 1,
    }),
    [isFirstColumn, onFirstDataRendered, onRowSelected, summaryColDefs]
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
          width: 150,
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
          minWidth: 100,
          maxWidth: 300,
          width: 150,
        },
      ],
      position: 'right',
      defaultToolPanel: 'none',
    }),
    []
  );

  return (
    <>
      {' '}
      {deploymentBreakdown ? (
        <DeploymentPreviewView
          deploymentBreakdown={deploymentBreakdown}
          onGoBack={() => setDeploymentBreakdown(undefined)}
        />
      ) : (
        <ResultSummaryGridView
          darkThemeAg={darkThemeAg}
          tableHeight={props.tableHeight}
          resultSummary={resultSummary}
          summaryGridOptions={summaryGridOptions}
          summaryColDefs={summaryColDefs}
          sideBar={sideBar}
        />
      )}
    </>
  );
}
