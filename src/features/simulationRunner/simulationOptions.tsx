import {
  Button,
  Col,
  DatePicker,
  Divider,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import { SimulatorGuide } from '../documentation/simulatorGuide';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeSimulationRunnerCurrentStepIndex } from './simulationRunnerSlice';
import {
  removeSelectedCoins,
  selectStartDate,
  selectEndDate,
  selectAvailableCoins,
  selectCoinPriceDataLoaded,
  selectSelectedCoinsToAddToPool,
  upsertSelectedCoins,
  setDateRange,
  selectSimplifiedPoolVariations,
  upsertSelectedSimplifiedPool,
  removeSelectedSimplifiedPool,
  selectedSimplifiedPools,
  selectSimulationSimplifiedIncludeLvrRuns,
  selectSimulationSimplifiedIncludeRvrRuns,
  changeSimulationSimplifiedIncludeLvrRuns,
  changeSimulationSimplifiedIncludeRvRuns,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { SimulationRunButton } from './simulationRunButton';
import { useMemo } from 'react';

const { Option } = Select;
const { RangePicker } = DatePicker;

export function SimulatorOptions() {
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const simplifiedPools = useAppSelector(selectedSimplifiedPools);
  const simplifiedPoolVariations = useAppSelector(
    selectSimplifiedPoolVariations
  );
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const dateFormat = 'YYYY/MM/DD';

  const availableCoins = useAppSelector(selectAvailableCoins);
  const selectedCoins = useAppSelector(selectSelectedCoinsToAddToPool);

  const simplifiedIncludeLvr = useAppSelector(
    selectSimulationSimplifiedIncludeLvrRuns
  );
  const simplifiedIncludeRvr = useAppSelector(
    selectSimulationSimplifiedIncludeRvrRuns
  );
  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return (
      current < dayjs('2020-11-20', 'YYYY-MM-DD') ||
      current > dayjs('2024-09-01', 'YYYY-MM-DD')
    );
  };

  const selectedCoinCodes = useMemo(() => {
    return selectedCoins.map((x) => x.coinCode);
  }, [selectedCoins]);

  const dispatch = useAppDispatch();
  return (
    <div>
      <Row>
        <Col span={12} style={{ padding: 30 }}>
          <Row>
            <Col span={24}>
              <h3>TLDR: Pre-Run Example Results and analytics</h3>
            </Col>
            <Col span={24}>
              <p>
                Not sure what to run? We have run some interesting examples for
                you.
              </p>
            </Col>
            <Col span={24}>
              <Button
                href="/examples"
                type="primary"
                size="large"
                style={{ backgroundColor: 'green' }}
              >
                View Example Results
              </Button>
            </Col>
            <Divider />
          </Row>
          <Row>
            <Col span={24}>
              <h3>ELI5: Simple Simulation Runner</h3>
              <p>
                Don&apos;t care about fine tuning parameters? Just choose your
                tokens and your pool types you want to run. This chooses default
                parameters and will likely be less performant given that the
                default parameters have not undergone optimisation and are not
                basket-aware. It is still useful though for quick comparisons.
              </p>
              <Row>
                <Col span={6}>
                  <Col span={24}>1. Choose tokens</Col>
                  <Col span={24}>
                    <Select
                      size="small"
                      mode="multiple"
                      disabled={!coinDataLoaded}
                      allowClear
                      value={selectedCoinCodes}
                      style={{
                        marginTop: '10px',
                        width: '150px',
                      }}
                      placeholder="Select coins"
                      onSelect={(item: string) =>
                        dispatch(upsertSelectedCoins(item))
                      }
                      onDeselect={(item: string) => {
                        dispatch(removeSelectedCoins(item));
                      }}
                      children={availableCoins.map((object) => (
                        <Option key={object.coinCode} value={object.coinCode}>
                          {object.coinCode}
                        </Option>
                      ))}
                    />
                  </Col>
                </Col>
                <Col span={10}>
                  <Col span={24}>
                    2. Choose pools
                    <Tooltip title="Gyroscope requires token specific configuration, use the advanced simulator to configure">
                      <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                    </Tooltip>
                  </Col>
                  <Col span={24}>
                    <Select
                      size="small"
                      mode="multiple"
                      disabled={!coinDataLoaded}
                      allowClear
                      value={simplifiedPools}
                      style={{
                        marginTop: '10px',
                        width: '250px',
                      }}
                      placeholder="Select pools to run"
                      onSelect={(item: string) =>
                        dispatch(upsertSelectedSimplifiedPool(item))
                      }
                      onDeselect={(item: string) => {
                        dispatch(removeSelectedSimplifiedPool(item));
                      }}
                      children={(selectedCoins.length > 2
                        ? simplifiedPoolVariations.filter(
                            (x) =>
                              x.toLowerCase().indexOf('cow') == -1 &&
                              x.toLowerCase().indexOf('gyroscope') == -1
                          )
                        : simplifiedPoolVariations
                      ).map((object) => (
                        <Option key={object} value={object}>
                          {object}
                        </Option>
                      ))}
                    />
                  </Col>
                  <Col
                    span={24}
                    style={{ marginTop: '10px', marginLeft: '5px' }}
                  >
                    <Radio
                      value={simplifiedIncludeLvr}
                      checked={simplifiedIncludeLvr}
                      onClick={() => {
                        dispatch(changeSimulationSimplifiedIncludeLvrRuns());
                      }}
                    >
                      Show LVR
                    </Radio>
                    <Radio
                      value={simplifiedIncludeLvr}
                      checked={simplifiedIncludeRvr}
                      onClick={() => {
                        dispatch(changeSimulationSimplifiedIncludeRvRuns());
                      }}
                    >
                      Show RVR
                    </Radio>
                  </Col>
                </Col>
                <Col span={8}>
                  <Col span={24}>3. Choose Time Range</Col>
                  <Col span={24}>
                    <RangePicker
                      size="small"
                      style={{ marginTop: '10px', fontSize: '7x' }}
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
                  <SimulationRunButton simplifiedPoolRun={true} />
                </Col>
              </Row>
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Col span={24}>
                <h3>Advanced Simulation Runner</h3>
              </Col>
              <Col span={24}>
                <p>
                  For those wanting to test specific parameter settings,
                  specific pool initial values and configurations, you can
                  access the advanced simulator.
                </p>
              </Col>
              <Button
                type="primary"
                size="large"
                style={{ backgroundColor: 'green' }}
                onClick={() => {
                  dispatch(changeSimulationRunnerCurrentStepIndex(1));
                }}
              >
                Begin Advanced Simulation Runner
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={12} style={{ padding: 30 }}>
          <SimulatorGuide />
        </Col>
      </Row>
    </div>
  );
}
