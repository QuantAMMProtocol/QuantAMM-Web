import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { SideBarDef, ColDef, GridOptions } from 'ag-grid-community';

import { Row, Col, Divider } from 'antd';

import { useAppSelector } from '../../../app/hooks';
import styles from '../simulationResultSummary.module.css';
import { FlatResultSummaryBreakdown } from '../simulationResultSummaryModels';
import { selectAgGridTheme } from '../../themes/themeSlice';
import { BreakdownProps } from '../simulationResultsSummaryStep';

export function SimulationRunMvSummaryBreakdown(props: BreakdownProps) {
  const darkThemeAg = useAppSelector(selectAgGridTheme);

  const simulationRunBreakdowns = props.breakdowns;

  function currencyFormatter(currency: number, sign: string) {
    if (currency == undefined) return '';
    const sansDec = currency.toFixed(0);
    const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }

  const [summaryColDefs] = useState<ColDef[]>([
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
    { colId: 'starDate', field: 'starDate', headerName: 'Start', hide: true },
    { colId: 'endDate', field: 'endDate', headerName: 'End', hide: true },
    {
      colId: 'initialMarketValue',
      field: 'initialMarketValue',
      headerName: 'Initial MV',
      filter: 'agNumberColumnFilter',
      type: ['numericColumn', 'nonEditableColumn'],
      enableValue: true,
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

    simulationRunBreakdowns
      .filter((x) => x.simulationRunStatus == 'Complete')
      .forEach((x) => {
        const finalValues = x.timeSteps[x.timeSteps.length - 1];
        if (x.flatSimulationRunResult != undefined) {
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
  };

  const summaryGridOptions: GridOptions = {
    columnDefs: summaryColDefs,
    rowHeight: 26,
    defaultColDef: {
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      enablePivot: true,
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
      <Divider>Final Value Summary</Divider>
      <Row>
        <Col span={24}>
          <div className="wrapper">
            <div
              id="myGrid"
              className={styles.summaryTableParent + ' ' + darkThemeAg}
            >
              <AgGridReact
                className={styles.summaryTableParent}
                rowData={getResultSummary()}
                gridOptions={summaryGridOptions}
                columnDefs={summaryColDefs}
                sideBar={sideBar}
              ></AgGridReact>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
