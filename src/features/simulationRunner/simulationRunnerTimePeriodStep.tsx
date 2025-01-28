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
import { ChangeEvent, Dispatch, useRef } from 'react';
import { AgCharts } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { selectAgChartTheme } from '../themes/themeSlice';
import { changeSimulationRunnerCurrentStepIndex } from './simulationRunnerSlice';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const handleDownloadSwaps = (
  event: ChangeEvent<HTMLInputElement>,
  dispatch: Dispatch<any>
) => {
  const file = event.target.files?.[0];

  if (file && file.type === 'text/csv') {
    // Ensure it's a CSV file
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const csvContent = loadEvent.target?.result;
      try {
        const rows = (csvContent as string).split('\n');
        const headers = rows[0].split(',');

        const rowsWithoutHeader = rows.slice(1, rows.length - 1);
        // Assuming SwapImport has properties: property1, property2, property3, etc.
        const swapImports: SwapImport[] = rowsWithoutHeader.map((row) => {
          const values = row.split(',');
          return {
            unix: Number(values[headers.indexOf('unix')]),
            tokenIn: values[headers.indexOf('tokenIn')],
            tokenOut: values[headers.indexOf('tokenOut')],
            amountIn:
              Number(values[headers.indexOf('amountIn')]) > 0 //could fail the import here but -ve to 0 is fine
                ? Number(values[headers.indexOf('amountIn')])
                : 0,
          } as unknown as SwapImport;
        });

        dispatch(
          addSwapImportToPools({
            swapImports: swapImports,
          })
        );
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file');
      alert('Error reading the file.');
    };

    reader.readAsText(file); // Read the file as a text string
  } else {
    alert('Please upload a valid JSON file.');
  }
};

const handleDownloadGas = (
  event: ChangeEvent<HTMLInputElement>,
  dispatch: Dispatch<any>
) => {
  const file = event.target.files?.[0];

  if (file && file.type === 'text/csv') {
    // Ensure it's a CSV file
    const reader = new FileReader();
    console.log('handle gas');
    reader.onload = (loadEvent) => {
      const csvContent = loadEvent.target?.result;
      try {
        const rows = (csvContent as string).split('\n');
        const headers = rows[0].split(',');

        const rowsWithoutHeader = rows.slice(1, rows.length - 1);
        // Assuming SwapImport has properties: property1, property2, property3, etc.
        const gasSteps: GasStep[] = rowsWithoutHeader.map((row) => {
          const values = row.split(',');
          return {
            unix: Number(values[headers.indexOf('unix')]),
            value:
              Number(values[headers.indexOf('USD')]) > 0
                ? Number(values[headers.indexOf('USD')])
                : 0,
          } as unknown as GasStep;
        });

        dispatch(
          addGasSteps({
            gas: gasSteps,
          })
        );
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file');
      alert('Error reading the file.');
    };

    reader.readAsText(file); // Read the file as a text string
  } else {
    alert('Please upload a valid JSON file.');
  }
};

export function SimulationRunnerTimePeriodStep() {
  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return (
      current < dayjs('2020-11-20', 'YYYY-MM-DD') ||
      current > dayjs('2024-12-30', 'YYYY-MM-DD')
    );
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

  return (
    <div>
      <Row>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <Divider orientation="center">
                Select Time Range
                <Tooltip title="Select the backtest range period">
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
              <RangePicker
                style={{
                  marginLeft: '10px',
                  width: '100%',
                }}
                disabledDate={disabledDate}
                defaultValue={[
                  dayjs(startDate, dateFormat),
                  dayjs(endDate, dateFormat),
                ]}
                value={[
                  dayjs(startDate, dateFormat),
                  dayjs(endDate, dateFormat),
                ]}
                onChange={(_dates, dateStrings) => {
                  dispatch(
                    setDateRange({
                      startDate: dateStrings[0] + ' 00:00:00',
                      endDate: dateStrings[1] + ' 23:59:00',
                    })
                  );
                }}
              />
            </Col>
            <Col span={24} style={{ paddingLeft: '10px' }}>
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
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
            </Col>
            <Col span={24} style={{ paddingLeft: '10px' }}>
              <p
                hidden={simulationPools.length > 0}
                style={{ marginBottom: '10px' }}
              >
                You need to configure pools to run in the pool step before
                importing swaps.
              </p>
              <div hidden={simulationPools.length == 0}>
                <input
                  type="file"
                  accept=".csv"
                  ref={swapInputRef}
                  style={{ display: 'none' }}
                  onChange={(event) => handleDownloadSwaps(event, dispatch)}
                />
                <label htmlFor="csvUpload">
                  <Button
                    type="primary"
                    onClick={() => swapInputRef.current?.click()}
                    disabled={!coinDataLoaded}
                  >
                    Load Swap CSV (optional)
                  </Button>
                </label>

                <p>Expected CSV header format:</p>
                <p>unix, tokenIn, tokenOut, AmountIn</p>
              </div>
            </Col>
            <Col span={24} style={{ paddingLeft: '10px' }}>
              <Divider orientation="center">
                Gas Settings
                <Tooltip title="Default is 0 gas cost. However you can import daily gas costs in USD which allow more accurate no arbitrage/no trade region modelling.">
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
              <p
                hidden={simulationPools.length > 0}
                style={{ marginBottom: '10px' }}
              >
                You need to configure pools to run in the pool step before
                importing swaps.
              </p>
              <div hidden={simulationPools.length == 0}>
                <input
                  type="file"
                  accept=".csv"
                  ref={gasInputRef}
                  style={{ display: 'none' }}
                  onChange={(event) => handleDownloadGas(event, dispatch)}
                />
                <label htmlFor="gasUpload">
                  <Button
                    type="primary"
                    onClick={() => gasInputRef.current?.click()}
                    disabled={!coinDataLoaded}
                  >
                    Load Swap Cost (optional)
                  </Button>
                </label>

                <p>Expected CSV header format:</p>
                <p>unix, USD</p>
                <p>unix ms format</p>
                <p>Minimum resolution: 1 minute</p>
              </div>
            </Col>
            <Col span={24}>
              <Button
                style={{ backgroundColor: 'green', marginLeft: '10px' }}
                onClick={() => {
                  dispatch(changeSimulationRunnerCurrentStepIndex(3));
                }}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={18} hidden={currentTimeRangeSelection != 'custom'}>
          <CustomTimePeriodPoolPriceHistoryChart />
          <Row>
            <Col span={24}>
              <div hidden={gasSteps.length == 0}>
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
      </Row>
    </div>
  );
}
