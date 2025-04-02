import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AgTimeAxisOptions } from 'ag-charts-community';
import * as agCharts from 'ag-charts-community';

import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-quartz.css';

import 'ag-grid-enterprise';

import {
  FirstDataRenderedEvent,
  SideBarDef,
  ColDef,
  GridOptions,
} from 'ag-grid-community';

import { Row, Col, Menu, Tabs } from 'antd';
import {
  CopyrightOutlined,
  DownOutlined,
  ControlOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import { useAppSelector } from '../../app/hooks';
import styles from './coinData.module.css';
import {
  Coin,
  CoinPrice,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import {
  selectAvailableCoins,
  selectCoinLoadStatus,
  selectCoinPriceDataLoaded,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';

import { ItemType } from 'rc-menu/lib/interface';

import { default as tBillPrices } from '../../price_data/DTB3.json';
import { TBillYield } from '../simulationResults/simulationReturnCalculator';
import { AgCharts } from 'ag-charts-react';
import {
  selectAgChartTheme,
  selectAgGridTheme,
  selectTheme,
} from '../themes/themeSlice';

const { TabPane } = Tabs;

export interface Marker {
  enabled: boolean;
}

export interface SeriesConfig {
  xKey: string;
  yKey: string;
  yName: string;
  data: CoinPrice[];
  marker: Marker;
}

export function CoinData() {
  const [currentCoin, setCurrentCoin] = useState('BTC');
  const availableCoins = useAppSelector(selectAvailableCoins);
  const coinLoadStatus = useAppSelector(selectCoinLoadStatus);
  const priceDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const darkThemeAg = useAppSelector(selectAgGridTheme);
  const isDark = useAppSelector(selectTheme);
  const chartTheme = useAppSelector(selectAgChartTheme);

  const [columnDefs] = useState<ColDef[]>([
    {
      colId: 'date',
      field: 'date',
      type: ['dateColumn', 'nonEditableColumn'],
      chartDataType: 'time',
      width: 150,
    },
    {
      colId: 'open',
      headerName: 'open',
      valueGetter: (params: { data: CoinPrice }) => {
        return params.data.open == 1 / 0 ? undefined : params.data.open;
      },
      filter: 'agNumberColumnFilter',
      type: ['numericColumn', 'nonEditableColumn'],
      enableValue: true,
    },
    {
      colId: 'high',
      headerName: 'high',
      valueGetter: (params: { data: CoinPrice }) => {
        return params.data.high == 1 / 0 ? undefined : params.data.high;
      },
      filter: 'agNumberColumnFilter',
      type: ['numericColumn', 'nonEditableColumn'],
      enableValue: true,
    },
    {
      colId: 'low',
      headerName: 'low',
      valueGetter: (params: { data: CoinPrice }) => {
        return params.data.low == 1 / 0 ? undefined : params.data.low;
      },
      filter: 'agNumberColumnFilter',
      type: ['numericColumn', 'nonEditableColumn'],
      enableValue: true,
    },
    {
      colId: 'close',
      field: 'close',
      filter: 'agNumberColumnFilter',
      type: ['numericColumn', 'nonEditableColumn'],
      enableValue: true,
    },

    {
      colId: 'unix',
      field: 'unix',
      type: ['dateColumn', 'nonEditableColumn'],
      chartDataType: 'time',
      sort: 'asc',
    },
  ]);

  function getItem(
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

  function getPriceFrequency(): ItemType[] {
    return [
      getItem('Select Frequency', 'placeholder', <ControlOutlined />, true),
      getItem('Daily', 'Daily', <ClockCircleOutlined />, true),
    ];
  }

  function getCoinSelections(): ItemType[] {
    const topItem = [
      getItem('Select Coin/Token', 'placeholder', <DownOutlined />, true),
    ];
    return [
      ...topItem,
      ...availableCoins.map((x: Coin): ItemType => {
        return getItem(x.coinName, x.coinCode, <CopyrightOutlined />, false);
      }),
      ...[
        getItem(
          'Select Other Prices',
          'otherPlaceholder',
          <ControlOutlined />,
          true
        ),
        getItem(
          '3M T-Bill Daily',
          '3mTbillDaily',
          <ClockCircleOutlined />,
          false
        ),
      ],
    ];
  }

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
  const gridOptions: GridOptions = {
    columnDefs: columnDefs,
    rowHeight: 26,
    defaultColDef: {
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      enablePivot: true,
    },
    chartThemes: [chartTheme],
    onFirstDataRendered: onFirstDataRendered,
    enableCharts: true,
    columnTypes: {
      nonEditableColumn: { editable: false },
    },
  };

  function onFirstDataRendered(params: FirstDataRenderedEvent) {
    setTimeout(() => {
      const allColumnIds: string[] = [];
      params.api.getColumns()!.forEach((column) => {
        allColumnIds.push(column.getId());
      });
    }, 200); // TODO: needs to render before it can resize??
  }

  const getCurrentPriceData = () => {
    const empty: CoinPrice[] = [];
    if (currentCoin == '3mTbillDaily') {
      const tbillData = tBillPrices as TBillYield[];
      const tBillCloseData: CoinPrice[] = tbillData.map((x) => {
        return {
          date: x.date,
          unix: new Date(x.date).getTime(),
          close: x.rate,
          open: 1 / 0,
          low: 1 / 0,
          high: 1 / 0,
        };
      });

      return tBillCloseData;
    }

    const availableCoin = availableCoins.find((x) => x.coinCode == currentCoin);

    return availableCoin?.dailyPriceHistory ?? empty;
  };

  function getCoinSeries(): SeriesConfig[] {
    const seriesArray: SeriesConfig[] = [];

    seriesArray.push({
      xKey: 'unix',
      yKey: 'close',
      yName: 'Close',
      data: [...getCurrentPriceData()],
      marker: { enabled: false },
    });

    return seriesArray;
  }

  function getTimeAxisOption(dataLength: number): AgTimeAxisOptions {
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

  function getLoadPriceColor(): string {
    if (isDark) {
      return '#DAAB43';
    } else {
      return '#1890ff';
    }
  }

  return (
    <div>
      <Row className={styles.coinTabSection}>
        <Col span={24}>
          <Tabs>
            <TabPane tab="Individual Coin/Token Data" key={'coinprices'}>
              <Row>
                <Col span={4}>
                  <Menu
                    style={{
                      width: 256,
                      maxHeight: '500px',
                      overflowY: 'auto',
                    }}
                    defaultSelectedKeys={['Daily']}
                    items={getPriceFrequency()}
                  />
                  <Menu
                    style={{
                      width: 256,
                      maxHeight: '500px',
                      overflowY: 'auto',
                    }}
                    defaultSelectedKeys={[currentCoin]}
                    items={getCoinSelections()}
                    onClick={(x) => {
                      setCurrentCoin(x.key);
                    }}
                    activeKey={currentCoin}
                  />
                </Col>
                <Col span={20}>
                  <div hidden={priceDataLoaded}>
                    {coinLoadStatus.map((x, index) => (
                      <Row key={index}>
                        <Col span={8}></Col>
                        <Col span={6}>
                          <span style={{ color: getLoadPriceColor() }}>
                            {x}
                          </span>
                          <CheckOutlined />
                        </Col>
                        <Col span={10}></Col>
                      </Row>
                    ))}
                  </div>
                  <Row>
                    <Col span={24}>
                      <div hidden={!priceDataLoaded}>
                        <div
                          id="myGrid"
                          className={styles.tableParent + ' ' + darkThemeAg}
                          style={{
                            width: '100%',
                            paddingLeft: '60px',
                            paddingRight: '30px',
                          }}
                        >
                          <AgGridReact
                            className={styles.tableParent}
                            rowData={getCurrentPriceData()}
                            gridOptions={gridOptions}
                            columnDefs={columnDefs}
                            onFirstDataRendered={onFirstDataRendered}
                            sideBar={sideBar}
                          ></AgGridReact>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div
                        hidden={!priceDataLoaded}
                        style={{
                          width: '100%',
                          paddingLeft: '60px',
                          paddingRight: '30px',
                          paddingTop: '20px',
                        }}
                      >
                        <AgCharts
                          options={{
                            height: 300,
                            navigator: {
                              enabled: true,
                              height: 5,
                              spacing: 6,
                            },
                            axes: [
                              getTimeAxisOption(getCoinSeries()[0].data.length),
                              {
                                type: 'number',
                                position: 'left',
                                label: {
                                  format: '$~s',
                                },
                              },
                            ],
                            series: getCoinSeries(),
                            legend: {
                              position: 'top',
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
                                    stroke: '#DAAB43',
                                    cursor: 'crosshair',
                                    marker: {
                                      stroke: '#DAAB43',
                                      fill: '#DAAB43',
                                      enabled: false,
                                    },
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
/*

*/
