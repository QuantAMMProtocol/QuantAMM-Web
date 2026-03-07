import { useMemo } from 'react';
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
  ColDef,
  FirstDataRenderedEvent,
  GridSizeChangedEvent,
  GridOptions,
  ICellRendererParams,
} from 'ag-grid-community';
import { LiquidityPoolCoin } from './simulationRunConfigModels';
import { selectAgGridTheme } from '../themes/themeSlice';
import { selectSimulationRunStatusStepIndex } from '../simulationRunner/simulationRunnerSlice';

const { Option } = Select;

function currencyFormatter(currency: number | null | undefined, sign: string) {
  const sansDec = (currency ?? 0).toFixed(0);
  const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${formatted}`;
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

  const isRunLocked = runStatusIndex === 2;
  const isInitialValueInvalid =
    (initialMarketValue === 0 || initialMarketValue === null) &&
    selectedCoinCodes.length > 0;
  const totalSelectedPoolSize = useMemo(() => {
    return new Set([
      ...poolConstituents.map((coin) => coin.coin.coinCode),
      ...selectedCoinCodes,
    ]).size;
  }, [poolConstituents, selectedCoinCodes]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
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
          currencyFormatter(params.data?.marketValue, '$'),
        valueSetter: (params) => {
          const newValue = Number(params.newValue);
          if (!Number.isFinite(newValue)) {
            return false;
          }
          dispatch(
            updateConsitutentMarketValue({
              poolCoin: params.data,
              newMV: newValue,
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
        valueFormatter: (params) => (params.data?.weight ?? 0).toFixed(2),
      },
      {
        colId: 'amount',
        field: 'amount',
        filter: 'agNumberColumnFilter',
        type: ['numericColumn'],
        enableValue: true,
        hide: true,
        valueFormatter: (params) => (params.data?.amount ?? 0).toFixed(2),
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
      {
        colId: 'remove',
        maxWidth: 80,
        cellRenderer: (params: ICellRendererParams) => (
          <Button
            disabled={isRunLocked}
            size="small"
            onClick={() => {
              dispatch(deleteConstituent(params.data as LiquidityPoolCoin));
            }}
          >
            X
          </Button>
        ),
      },
    ],
    [dispatch, isRunLocked]
  );

  const gridOptions = useMemo<GridOptions>(
    () => ({
      columnDefs,
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
    }),
    [columnDefs]
  );

  function onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  function onGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.sizeColumnsToFit();
  }

  return (
    <Row>
      <Col span={24}>
        <Row className={styles.addCoinRow} gutter={[8, 8]}>
          <Col span={24}>
            <Select
              mode="multiple"
              disabled={!coinDataLoaded}
              allowClear
              value={selectedCoinCodes}
              className={styles.coinSelectInput}
              placeholder="Select coins to add/modify"
              onSelect={(item: string) => dispatch(upsertSelectedCoins(item))}
              onDeselect={(item: string) => dispatch(removeSelectedCoins(item))}
            >
              {availableCoins.map((object) => (
                <Option key={object.coinCode}>{object.coinCode}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={18}>
            <InputNumber
              disabled={
                !coinDataLoaded || isRunLocked || totalSelectedPoolSize > 8
              }
              status={isInitialValueInvalid ? 'error' : undefined}
              addonBefore={'$'}
              value={initialMarketValue}
              placeholder="enter dollar value to add"
              className={styles.coinMarketValueInput}
              onChange={(e) => {
                dispatch(setSelectedInitialCoinAmount(e));
              }}
            />
          </Col>
          <Col xs={24} md={6} className={styles.addCoinActionCol}>
            <Button
              block
              disabled={
                !coinDataLoaded ||
                isRunLocked ||
                totalSelectedPoolSize > 8 ||
                initialMarketValue === 0 ||
                initialMarketValue === null
              }
              type="primary"
              icon={<PlusCircleOutlined />}
              className={styles.addCoinButton}
              onClick={() => {
                dispatch(updateLiquidityPoolConstituents());
                dispatch(clearSelectedCoins());
              }}
            >
              {isRunLocked ? 'Reset' : 'Add'}
            </Button>
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
                onGridSizeChanged={onGridSizeChanged}
              ></AgGridReact>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
