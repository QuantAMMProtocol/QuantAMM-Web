import { useCallback, useState } from 'react';
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
import { AppProps } from '../../simulationRunConfiguration/liquidityPoolConfiguration';
import {
  addRunResult,
  deselectBreakdownResult,
  removeRunResult,
  selectBreakdownResult,
  selectSimulationResults,
} from '../simulationResultSlice';

export interface RunDetailProps {
  breakdowns: SimulationRunBreakdown[];
  saveButton: boolean;
  selectButton: boolean;
  removeButton: boolean;
  tableHeight: string;
}

export function SimulationResultsRunDetailsTable(props: RunDetailProps) {
  const dispatch = useAppDispatch();
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const savedBreakdowns = useAppSelector(selectSimulationResults);

  const simulationRunBreakdowns = props.breakdowns;

  function currencyFormatter(currency: number, sign: string) {
    if (currency == undefined) return '';
    const sansDec = currency.toFixed(0);
    const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }

  const download = function (data: string, fileName: string) {
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
  };

  function isFirstColumn(
    params:
      | CheckboxSelectionCallbackParams
      | HeaderCheckboxSelectionCallbackParams
  ) {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    return props.selectButton && thisIsFirstColumn;
  }

  const SaveButton: React.FC<ICellRendererParams & AppProps> = (params) => {
    return (
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
              x.simulationRun.id ==
                (params.data.originatingBreakdown as SimulationRunBreakdown)
                  .simulationRun.id &&
              x.timeRange.name ==
                (params.data.originatingBreakdown as SimulationRunBreakdown)
                  .timeRange.name
          ) != undefined
        }
      >
        Save
      </Button>
    );
  };

  const DownloadButton: React.FC<ICellRendererParams & AppProps> = (params) => {
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
  };

  const RemoveButton: React.FC<ICellRendererParams & AppProps> = (params) => {
    return (
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
              x.simulationRun.id ==
                (params.data.originatingBreakdown as SimulationRunBreakdown)
                  .simulationRun.id &&
              x.timeRange.name ==
                (params.data.originatingBreakdown as SimulationRunBreakdown)
                  .timeRange.name
          ) == undefined
        }
      >
        Remove
      </Button>
    );
  };

  const [summaryColDefs] = useState<ColDef[]>([
    {
      colId: 'timePeriodName',
      field: 'timePeriodName',
      headerName: 'Time Period',
    },
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
    { colId: 'parameters', field: 'parameters', headerName: 'Parameters' },
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
        //if analysis is not appropriate then it will be undefined
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
      colId: 'save',
      cellRenderer: SaveButton,
      hide: !props.saveButton,
    },
    {
      colId: 'remove',
      cellRenderer: RemoveButton,
      hide: !props.removeButton,
    },
    {
      colId: 'download',
      cellRenderer: DownloadButton,
    },
  ]);

  const customRounding = (original: number | undefined): number | undefined => {
    if (original == undefined) {
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
  const getResultSummary = (): FlatResultSummaryBreakdown[] => {
    const results: FlatResultSummaryBreakdown[] = [];

    simulationRunBreakdowns.forEach((x) => {
      const finalValues = x.timeSteps[x.timeSteps.length - 1];
      if (x.flatSimulationRunResult != undefined) {
        results.push(x.flatSimulationRunResult);
      } else {
        results.push({
          updateRule: x.simulationRun.updateRule.updateRuleName,
          parameters:
            x.simulationRun.updateRule.updateRuleParameters.reduce<string>(
              (accumulator, current) => {
                return (
                  accumulator +
                  '[' +
                  current.factorName +
                  ':' +
                  current.factorValue +
                  '] '
                );
              },
              ''
            ),
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
  };

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

  function onFirstDataRendered(params: FirstDataRenderedEvent) {
    setTimeout(() => {
      const allColumnIds: string[] = [];
      params.api.getColumns()!.forEach((column) => {
        allColumnIds.push(column.getId());
      });
      params.api.autoSizeColumns(allColumnIds, false);
    }, 200); //needs to render before it can resize??
  }

  const summaryGridOptions: GridOptions = {
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
  };

  const sideBar: SideBarDef = {
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
  };

  return (
    <div>
      <Row>
        <Col span={24} style={{ paddingLeft: 30, paddingRight: 30 }}>
          <div className="wrapper">
            <div
              id="myGrid"
              className={darkThemeAg}
              style={{ height: props.tableHeight }}
            >
              <AgGridReact
                className={styles.summaryTableParent}
                autoSizePadding={20}
                rowData={getResultSummary()}
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
