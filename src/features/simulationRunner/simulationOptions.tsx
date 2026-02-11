import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Row,
  Select,
  Tooltip,
} from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';

import dayjs, { Dayjs } from 'dayjs';
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
import runnerStyles from './simulationRunnerCommon.module.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

function SimulatorIntroSection() {
  return (
    <Row>
      <Col span={24}>
        <h1 className={runnerStyles.optionsHeader}>QuantAMM Historic Simulator</h1>
      </Col>
      <Col span={24}>
        <p>Not sure what to run? We have run some interesting examples for you.</p>
      </Col>
      <Col span={24}>
        <Button
          href="/examples"
          type="primary"
          size="large"
          className={runnerStyles.greenButton}
        >
          View Example Results
        </Button>
      </Col>
      <Divider />
    </Row>
  );
}

interface SimpleRunnerSectionProps {
  coinDataLoaded: boolean;
  selectedCoinCodes: string[];
  availableCoins: Array<{ coinCode: string }>;
  simplifiedPools: string[];
  selectablePoolVariations: string[];
  simplifiedIncludeLvr: boolean;
  simplifiedIncludeRvr: boolean;
  disabledDate: (current: Dayjs) => boolean;
  startDate: string;
  endDate: string;
  onSelectCoin: (item: string) => void;
  onDeselectCoin: (item: string) => void;
  onSelectPool: (item: string) => void;
  onDeselectPool: (item: string) => void;
  onToggleLvr: () => void;
  onToggleRvr: () => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

function SimpleRunnerSection({
  coinDataLoaded,
  selectedCoinCodes,
  availableCoins,
  simplifiedPools,
  selectablePoolVariations,
  simplifiedIncludeLvr,
  simplifiedIncludeRvr,
  disabledDate,
  startDate,
  endDate,
  onSelectCoin,
  onDeselectCoin,
  onSelectPool,
  onDeselectPool,
  onToggleLvr,
  onToggleRvr,
  onDateRangeChange,
}: SimpleRunnerSectionProps) {
  const dateFormat = 'YYYY/MM/DD';

  return (
    <Row>
      <Col span={24}>
        <h3>ELI5: Simple Simulation Runner</h3>
        <p>
          Don&apos;t care about fine tuning parameters? Just choose your tokens
          and your pool types you want to run. This chooses default parameters
          and will likely be less performant given that the default parameters
          have not undergone optimisation and are not basket-aware. It is still
          useful though for quick comparisons.
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
                className={runnerStyles.optionsCoinSelect}
                placeholder="Select coins"
                onSelect={onSelectCoin}
                onDeselect={onDeselectCoin}
              >
                {availableCoins.map((object) => (
                  <Option key={object.coinCode} value={object.coinCode}>
                    {object.coinCode}
                  </Option>
                ))}
              </Select>
            </Col>
          </Col>
          <Col span={10}>
            <Col span={24}>
              2. Choose pools
              <Tooltip title="Gyroscope requires token specific configuration, use the advanced simulator to configure">
                <InfoCircleOutlined className={runnerStyles.infoIcon} />
              </Tooltip>
            </Col>
            <Col span={24}>
              <Select
                size="small"
                mode="multiple"
                disabled={!coinDataLoaded}
                allowClear
                value={simplifiedPools}
                className={runnerStyles.optionsPoolSelect}
                placeholder="Select pools to run"
                onSelect={onSelectPool}
                onDeselect={onDeselectPool}
              >
                {selectablePoolVariations.map((object) => (
                  <Option key={object} value={object}>
                    {object}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={24} className={runnerStyles.optionsToggleRow}>
              <Checkbox checked={simplifiedIncludeLvr} onChange={onToggleLvr}>
                Show LVR
              </Checkbox>
              <Checkbox checked={simplifiedIncludeRvr} onChange={onToggleRvr}>
                Show RVR
              </Checkbox>
            </Col>
          </Col>
          <Col span={8}>
            <Col span={24}>3. Choose Time Range</Col>
            <Col span={24}>
              <RangePicker
                size="small"
                className={runnerStyles.optionsRangePicker}
                disabledDate={disabledDate}
                value={[
                  dayjs(startDate, dateFormat),
                  dayjs(endDate, dateFormat),
                ]}
                onChange={(_dates, dateStrings) => {
                  if (!dateStrings[0] || !dateStrings[1]) {
                    return;
                  }
                  onDateRangeChange(dateStrings[0], dateStrings[1]);
                }}
              />
            </Col>
            <SimulationRunButton simplifiedPoolRun={true} />
          </Col>
        </Row>
        <Divider />
      </Col>
    </Row>
  );
}

interface AdvancedRunnerSectionProps {
  onBegin: () => void;
}

function AdvancedRunnerSection({ onBegin }: AdvancedRunnerSectionProps) {
  return (
    <Row>
      <Col span={24}>
        <Col span={24}>
          <h3>Advanced Simulation Runner</h3>
        </Col>
        <Col span={24}>
          <p>
            For those wanting to test specific parameter settings, specific pool
            initial values and configurations, you can access the advanced
            simulator.
          </p>
        </Col>
        <Button
          type="primary"
          size="large"
          className={runnerStyles.greenButton}
          onClick={onBegin}
        >
          Begin Advanced Simulation Runner
        </Button>
      </Col>
    </Row>
  );
}

export function SimulatorOptions() {
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const simplifiedPools = useAppSelector(selectedSimplifiedPools);
  const simplifiedPoolVariations = useAppSelector(
    selectSimplifiedPoolVariations
  );
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);

  const availableCoins = useAppSelector(selectAvailableCoins);
  const selectedCoins = useAppSelector(selectSelectedCoinsToAddToPool);

  const simplifiedIncludeLvr = useAppSelector(
    selectSimulationSimplifiedIncludeLvrRuns
  );
  const simplifiedIncludeRvr = useAppSelector(
    selectSimulationSimplifiedIncludeRvrRuns
  );

  const disabledDate = (current: Dayjs) => {
    const yesterday = dayjs().subtract(1, 'day').endOf('day');
    return (
      current < dayjs('2021-11-20', 'YYYY-MM-DD') || current > yesterday
    );
  };

  const selectedCoinCodes = useMemo(() => {
    return selectedCoins.map((x) => x.coinCode);
  }, [selectedCoins]);

  const selectablePoolVariations = useMemo(
    () =>
      selectedCoins.length > 2
        ? simplifiedPoolVariations.filter(
            (x) =>
              x.toLowerCase().indexOf('cow') === -1 &&
              x.toLowerCase().indexOf('gyroscope') === -1
          )
        : simplifiedPoolVariations,
    [selectedCoins.length, simplifiedPoolVariations]
  );

  const dispatch = useAppDispatch();
  return (
    <div>
      <Row>
        <Col span={12} className={runnerStyles.panelPadding}>
          <SimulatorIntroSection />
          <SimpleRunnerSection
            coinDataLoaded={coinDataLoaded}
            selectedCoinCodes={selectedCoinCodes}
            availableCoins={availableCoins}
            simplifiedPools={simplifiedPools}
            selectablePoolVariations={selectablePoolVariations}
            simplifiedIncludeLvr={simplifiedIncludeLvr}
            simplifiedIncludeRvr={simplifiedIncludeRvr}
            disabledDate={disabledDate}
            startDate={startDate}
            endDate={endDate}
            onSelectCoin={(item) => dispatch(upsertSelectedCoins(item))}
            onDeselectCoin={(item) => dispatch(removeSelectedCoins(item))}
            onSelectPool={(item) =>
              dispatch(upsertSelectedSimplifiedPool(item))
            }
            onDeselectPool={(item) =>
              dispatch(removeSelectedSimplifiedPool(item))
            }
            onToggleLvr={() => {
              dispatch(changeSimulationSimplifiedIncludeLvrRuns());
            }}
            onToggleRvr={() => {
              dispatch(changeSimulationSimplifiedIncludeRvRuns());
            }}
            onDateRangeChange={(rangeStartDate, rangeEndDate) => {
              dispatch(
                setDateRange({
                  startDate: rangeStartDate + ' 00:00:00',
                  endDate: rangeEndDate + ' 23:59:00',
                })
              );
            }}
          />
          <AdvancedRunnerSection
            onBegin={() => dispatch(changeSimulationRunnerCurrentStepIndex(1))}
          />
        </Col>
        <Col span={12} className={runnerStyles.panelPadding}>
          <SimulatorGuide />
        </Col>
      </Row>
    </div>
  );
}
