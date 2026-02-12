import { Button, Col, DatePicker, Divider, Row, Tooltip } from 'antd';
import { CustomTimePeriodPoolPriceHistoryChart } from '../simulationRunConfiguration/customTimePeriodPoolPriceHistoryChart';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectSimulationRunnerTimeRangeSelection } from './simulationRunnerSlice';
import {
  GasStep,
  SwapImport,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import {
  addGasSteps,
  addSwapImportToPools,
  selectCoinPriceDataLoaded,
  selectEndDate,
  selectGasSteps,
  selectSimulationPools,
  selectStartDate,
  setDateRange,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { ChangeEvent, useRef } from 'react';
import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { selectAgChartTheme } from '../themes/themeSlice';
import { changeSimulationRunnerCurrentStepIndex } from './simulationRunnerSlice';
import dayjs, { Dayjs } from 'dayjs';
import { AppDispatch } from '../../app/store';
import runnerStyles from './simulationRunnerCommon.module.css';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const isCsvFile = (file: File) =>
  file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');

function parseCsvContent(csvContent: string) {
  const rows = csvContent
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  if (rows.length < 2) {
    throw new Error('CSV must include headers and at least one data row.');
  }

  const headers = rows[0]
    .split(',')
    .map((header) => header.trim().toLowerCase());
  const dataRows = rows
    .slice(1)
    .map((row) => row.split(',').map((cell) => cell.trim()));

  return { headers, dataRows };
}

function getHeaderIndex(headers: string[], headerName: string): number {
  const index = headers.indexOf(headerName.toLowerCase());
  if (index === -1) {
    throw new Error(`Missing CSV header: ${headerName}`);
  }
  return index;
}

const handleDownloadSwaps = (
  event: ChangeEvent<HTMLInputElement>,
  dispatch: AppDispatch
) => {
  const file = event.target.files?.[0];

  if (file && isCsvFile(file)) {
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const csvContent = loadEvent.target?.result;
      try {
        const { headers, dataRows } = parseCsvContent(String(csvContent ?? ''));
        const unixIndex = getHeaderIndex(headers, 'unix');
        const tokenInIndex = getHeaderIndex(headers, 'tokenIn');
        const tokenOutIndex = getHeaderIndex(headers, 'tokenOut');
        const amountInIndex = getHeaderIndex(headers, 'amountIn');

        const swapImports: SwapImport[] = dataRows.map((values) => {
          const unix = Number(values[unixIndex]);
          const amountIn = Number(values[amountInIndex]);

          return {
            unix: Number.isFinite(unix) ? unix : 0,
            tokenIn: values[tokenInIndex],
            tokenOut: values[tokenOutIndex],
            amountIn: Number.isFinite(amountIn) && amountIn > 0 ? amountIn : 0,
          };
        });

        dispatch(
          addSwapImportToPools({
            swapImports,
          })
        );
      } catch (error) {
        alert('Error parsing CSV file. Please check the file format.');
      }
      event.target.value = '';
    };

    reader.onerror = () => {
      alert('Error reading the file.');
      event.target.value = '';
    };

    reader.readAsText(file);
  } else {
    alert('Please upload a valid CSV file.');
    event.target.value = '';
  }
};

const handleDownloadGas = (
  event: ChangeEvent<HTMLInputElement>,
  dispatch: AppDispatch
) => {
  const file = event.target.files?.[0];

  if (file && isCsvFile(file)) {
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const csvContent = loadEvent.target?.result;
      try {
        const { headers, dataRows } = parseCsvContent(String(csvContent ?? ''));
        const unixIndex = getHeaderIndex(headers, 'unix');
        const usdIndex = getHeaderIndex(headers, 'usd');

        const gasSteps: GasStep[] = dataRows.map((values) => {
          const unix = Number(values[unixIndex]);
          const usdValue = Number(values[usdIndex]);

          return {
            unix: Number.isFinite(unix) ? unix : 0,
            value: Number.isFinite(usdValue) && usdValue > 0 ? usdValue : 0,
          };
        });

        dispatch(
          addGasSteps({
            gas: gasSteps,
          })
        );
      } catch (error) {
        alert('Error parsing CSV file. Please check the file format.');
      }
      event.target.value = '';
    };

    reader.onerror = () => {
      alert('Error reading the file.');
      event.target.value = '';
    };

    reader.readAsText(file);
  } else {
    alert('Please upload a valid CSV file.');
    event.target.value = '';
  }
};

export function SimulationRunnerTimePeriodStep() {
  const disabledDate = (current: Dayjs) => {
    const yesterday = dayjs().subtract(1, 'day').endOf('day');
    return current < dayjs('2021-11-20', 'YYYY-MM-DD') || current > yesterday;
  };

  const dispatch = useAppDispatch();
  const currentTimeRangeSelection = useAppSelector(
    selectSimulationRunnerTimeRangeSelection
  );

  const gasSteps = useAppSelector(selectGasSteps);
  const simulationPools = useAppSelector(selectSimulationPools);
  const chartTheme = useAppSelector(selectAgChartTheme);
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const swapInputRef = useRef<HTMLInputElement | null>(null);
  const gasInputRef = useRef<HTMLInputElement | null>(null);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);

  const TimePeriodControlPanel = () => (
    <Col span={6}>
      <Row>
        <Col span={24}>
          <Divider orientation="center">
            Select Time Range
            <Tooltip title="Select the backtest range period">
              <InfoCircleOutlined className={runnerStyles.infoIcon} />
            </Tooltip>
          </Divider>
          <RangePicker
            style={{
              //staying inline given rendering priorities
              marginLeft: '10px',
              width: '100%',
            }}
            disabledDate={disabledDate}
            value={[dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)]}
            onChange={(_dates, dateStrings) => {
              if (!dateStrings[0] || !dateStrings[1]) {
                return;
              }
              dispatch(
                setDateRange({
                  startDate: dateStrings[0] + ' 00:00:00',
                  endDate: dateStrings[1] + ' 23:59:00',
                })
              );
            }}
          />
        </Col>
        <Col span={24} className={runnerStyles.leftPadding10}>
          <Divider orientation="center">
            Import Swaps
            <Tooltip
              title="A general pool parameter is automatic optimal arb trading. 
                These swaps are applied even if there is optimal arb trading. 
                They are applied after the arb trades. 
                There can only be one trade per unix value on one token. 
                V2 will allow multiple trades ordered on the same unix timestamp. 
                The import will be rejected if there are multiple"
            >
              <InfoCircleOutlined className={runnerStyles.infoIcon} />
            </Tooltip>
          </Divider>
        </Col>
        <Col span={24} className={runnerStyles.leftPadding10}>
          <p
            hidden={simulationPools.length > 0}
            className={runnerStyles.marginBottom10}
          >
            You need to configure pools to run in the pool step before importing
            swaps.
          </p>
          <div hidden={simulationPools.length === 0}>
            <input
              type="file"
              accept=".csv"
              ref={swapInputRef}
              className={runnerStyles.hiddenFileInput}
              onChange={(event) => handleDownloadSwaps(event, dispatch)}
            />
            <Button
              type="primary"
              onClick={() => swapInputRef.current?.click()}
              disabled={!coinDataLoaded}
            >
              Load Swap CSV (optional)
            </Button>

            <p>Expected CSV header format:</p>
            <p>unix, tokenIn, tokenOut, amountIn</p>
          </div>
        </Col>
        <Col span={24} className={runnerStyles.leftPadding10}>
          <Divider orientation="center">
            Gas Settings
            <Tooltip title="Default is 0 gas cost. However you can import daily gas costs in USD which allow more accurate no arbitrage/no trade region modelling.">
              <InfoCircleOutlined className={runnerStyles.infoIcon} />
            </Tooltip>
          </Divider>
          <p
            hidden={simulationPools.length > 0}
            className={runnerStyles.marginBottom10}
          >
            You need to configure pools to run in the pool step before importing
            swaps.
          </p>
          <div hidden={simulationPools.length === 0}>
            <input
              type="file"
              accept=".csv"
              ref={gasInputRef}
              className={runnerStyles.hiddenFileInput}
              onChange={(event) => handleDownloadGas(event, dispatch)}
            />
            <Button
              type="primary"
              onClick={() => gasInputRef.current?.click()}
              disabled={!coinDataLoaded}
            >
              Load Gas Cost CSV (optional)
            </Button>

            <p>Expected CSV header format:</p>
            <p>unix, USD</p>
            <p>unix ms format</p>
            <p>Minimum resolution: 1 minute</p>
          </div>
        </Col>
        <Col span={24}>
          <Button
            className={`${runnerStyles.greenButton} ${runnerStyles.marginLeft10}`}
            onClick={() => {
              dispatch(changeSimulationRunnerCurrentStepIndex(3));
            }}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Col>
  );

  const GasCostChartSection = () => (
    <Col span={18} hidden={currentTimeRangeSelection !== 'custom'}>
      <CustomTimePeriodPoolPriceHistoryChart />
      <Row>
        <Col span={24}>
          <div hidden={gasSteps.length === 0}>
            <AgCharts
              options={{
                height: 300,
                axes: [
                  {
                    type: 'time',
                    interval: {
                      step: agCharts.time.month.every(
                        gasSteps.length > 150 ? 3 : 1
                      ),
                    },
                    label: {
                      format: '%m/%y',
                    },
                  },
                  {
                    type: 'number',
                    position: 'left',
                    keys: ['value'],
                  },
                ],
                series: [
                  {
                    type: 'line',
                    xKey: 'unix',
                    yKey: 'value',
                    yName: 'Gas Cost (USD)',
                    data: gasSteps,
                    stroke: '#DAAB43',
                    marker: { enabled: false },
                  },
                ],
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
  );

  return (
    <div>
      <Row>
        <TimePeriodControlPanel />
        <GasCostChartSection />
      </Row>
    </div>
  );
}
