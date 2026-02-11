import { Checkbox, Col, DatePicker, Divider, Row, Select, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { InfoCircleOutlined } from '@ant-design/icons';
import { SimulationRunButton } from '../simulationRunButton';
import runnerStyles from '../simulationRunnerCommon.module.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface SimpleRunnerSectionProps {
  coinDataLoaded: boolean;
  selectedCoinCodes: string[];
  availableCoins: { coinCode: string }[];
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

export function SimpleRunnerSection({
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
          Don&apos;t care about fine tuning parameters? Just choose your tokens and
          your pool types you want to run. This chooses default parameters and
          will likely be less performant given that the default parameters have
          not undergone optimisation and are not basket-aware. It is still useful
          though for quick comparisons.
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
                value={[dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)]}
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
