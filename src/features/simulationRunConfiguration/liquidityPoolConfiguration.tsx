import React, { useMemo, useState } from 'react';
import { Select, Row, Col, Button, InputNumber } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import styles from './simulationRunConfiguration.module.css';
import {
  selectAvailableCoins,
  selectPoolConstituents,
  upsertSelectedCoins,
  removeSelectedCoins,
  deleteConstituent,
  setSelectedInitialCoinAmount,
  updateLiquidityPoolConstituents,
  selectCoinPriceDataLoaded,
  updateConsitutentMarketValue,
  clearSelectedCoins,
  selectedInitialCoinMarketValue,
  selectSelectedCoinsToAddToPool,
} from './simulationRunConfigurationSlice';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import {
  FirstDataRenderedEvent,
  SideBarDef,
  ColDef,
  GridOptions,
  ICellRendererParams,
} from 'ag-grid-community';
import { LiquidityPoolCoin } from './simulationRunConfigModels';
import { selectAgGridTheme } from '../themes/themeSlice';
import { selectSimulationRunStatusStepIndex } from '../simulationRunner/simulationRunnerSlice';

const { Option } = Select;

export interface AppProps {
  onClick?: () => void;
  gridOptions?: GridOptions;
}

export function LiquidityPoolConfiguration() {
  const dispatch = useAppDispatch();
  const availableCoins = useAppSelector(selectAvailableCoins);
  const poolConstituents = useAppSelector(selectPoolConstituents);
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const initialMarketValue = useAppSelector(selectedInitialCoinMarketValue);
  const selectedCoins = useAppSelector(selectSelectedCoinsToAddToPool);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);

  const selectedCoinCodes = useMemo(() => {
    return selectedCoins.map((x) => x.coinCode);
  }, [selectedCoins]);

  const DeleteButton: React.FC<ICellRendererParams & AppProps> = (params) => {
    return (
      <Button
        disabled={runStatusIndex == 2}
        size="small"
        onClick={() => {
          dispatch(deleteConstituent(params.data as LiquidityPoolCoin));
        }}
      >
        X
      </Button>
    );
  };

  function currencyFormatter(currency: number, sign: string) {
    const sansDec = currency.toFixed(0);
    const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }

  const [columnDefs] = useState<ColDef[]>([
    {
      colId: 'coinCode',
      headerName: 'Code',
      minWidth: 100,
      valueGetter: (params) => {
        return params.data.coin.coinCode;
      },
      type: 'nonEditableColumn',
    },
    {
      colId: 'marketvalue',
      headerName: 'TVL',
      valueGetter: (params) => {
        return params.data.marketValue;
      },
      valueFormatter: (params) =>
        currencyFormatter(params.data.marketValue, '$'),
      valueSetter: (params) => {
        dispatch(
          updateConsitutentMarketValue({
            poolCoin: params.data,
            newMV: +params.newValue,
          })
        );
        return true;
      },
      filter: 'agNumberColumnFilter',
      type: ['numericColumn'],
      enableValue: true,
      editable: true,
    },
    {
      colId: 'weight',
      field: 'weight',
      headerName: '%',
      filter: 'agNumberColumnFilter',
      type: ['numericColumn'],
      enableValue: true,
      valueFormatter: (params) => params.data.weight.toFixed(2),
    },
    {
      colId: 'amount',
      field: 'amount',
      filter: 'agNumberColumnFilter',
      type: ['numericColumn'],
      enableValue: true,
      hide: true,
      valueFormatter: (params) => params.data.amount.toFixed(2),
    },
    {
      colId: 'currentPrice',
      field: 'currentPrice',
      headerName: 'Price',
      filter: 'agNumberColumnFilter',
      type: ['numericColumn'],
      hide: true,
    },
    {
      colId: 'currentPriceUnix',
      field: 'currentPriceUnix',
      headerName: 'Price Timestamp',
      filter: 'agNumberColumnFilter',
      type: ['numericColumn'],
      hide: true,
    },
    { colId: 'remove', maxWidth: 80, cellRenderer: DeleteButton },
  ]);

  const gridOptions: GridOptions = {
    columnDefs: columnDefs,
    singleClickEdit: true,
    rowHeight: 40,
    defaultColDef: {
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      enablePivot: true,
    },
    columnTypes: {
      nonEditableColumn: { editable: false },
      dateColumn: {
        filter: 'agDateColumnFilter',
        suppressMenu: true,
      },
    },
  };

  const sideBar: SideBarDef = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        minWidth: 80,
        maxWidth: 280,
        width: 150,
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
        minWidth: 70,
        maxWidth: 280,
        width: 120,
      },
    ],
    position: 'right',
    defaultToolPanel: 'none',
  };

  function onFirstDataRendered(params: FirstDataRenderedEvent) {
    setTimeout(() => {
      const allColumnIds: string[] = [];
      params.api.getColumns()!.forEach((column) => {
        allColumnIds.push(column.getId());
      });
      params.api.autoSizeColumns(allColumnIds, true);
    }, 200); //needs to render before it can resize??
  }

  return (
    <Row>
      <Col span={24}>
        <Row className={styles.addCoinRow}>
          <Col span={24}>
            <Col span={20}>
              <Select
                mode="multiple"
                disabled={!coinDataLoaded}
                allowClear
                value={selectedCoinCodes}
                style={{ width: '90%', marginBottom: '5px' }}
                placeholder="Select coins to add/modify"
                onSelect={(item: string) => dispatch(upsertSelectedCoins(item))}
                onDeselect={(item: string) =>
                  dispatch(removeSelectedCoins(item))
                }
              >
                {availableCoins.map(function (object) {
                  return (
                    <Option key={object.coinCode}>{object.coinCode}</Option>
                  );
                })}
              </Select>
            </Col>
            <Col span={4}></Col>
          </Col>
          <Col span={24}>
            <Row>
              <Col span={20}>
                <InputNumber
                  disabled={
                    !coinDataLoaded ||
                    runStatusIndex == 2 ||
                    poolConstituents.length + selectedCoinCodes.length > 8
                  }
                  status={
                    (initialMarketValue == 0 ||
                      initialMarketValue == undefined ||
                      initialMarketValue == null) &&
                    selectedCoinCodes.length > 0
                      ? 'error'
                      : undefined
                  }
                  addonBefore={'$'}
                  value={initialMarketValue}
                  placeholder="enter dollar value to add"
                  style={{ width: '90%' }}
                  onChange={(e) => {
                    dispatch(setSelectedInitialCoinAmount(e));
                  }}
                />
              </Col>
              <Col span={4}>
                <Button
                  disabled={
                    !coinDataLoaded ||
                    runStatusIndex == 2 ||
                    poolConstituents.length + selectedCoinCodes.length > 8 ||
                    initialMarketValue == 0 ||
                    initialMarketValue == undefined ||
                    initialMarketValue == null
                  }
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => {
                    dispatch(updateLiquidityPoolConstituents());
                    dispatch(setSelectedInitialCoinAmount());
                    dispatch(clearSelectedCoins());
                  }}
                >
                  {runStatusIndex == 2 ? 'Reset' : 'Add'}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div
              id="myGrid"
              className={styles.initialPoolTable + ' ' + darkThemeAg}
            >
              <AgGridReact
                className={styles.tableParent}
                rowData={poolConstituents}
                gridOptions={gridOptions}
                columnDefs={columnDefs}
                onFirstDataRendered={onFirstDataRendered}
                sideBar={sideBar}
              ></AgGridReact>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
