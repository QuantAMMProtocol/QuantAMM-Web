import { Button, Col, Divider, Row } from 'antd';

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
import { useMemo } from 'react';
import runnerStyles from './simulationRunnerCommon.module.css';
import { SimpleRunnerSection } from './sections/simulationSimpleRunnerSection';

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
          <Row>
            <Col span={24}>
              <h1 className={runnerStyles.optionsHeader}>
                QuantAMM Historic Simulator
              </h1>
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
                className={runnerStyles.greenButton}
              >
                View Example Results
              </Button>
            </Col>
            <Divider />
          </Row>
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
          <Row>
            <Col span={24}>
              <Col span={24}>
                <h3>Advanced Simulation Runner</h3>
              </Col>
              <Col span={24}>
                <p>
                  For those wanting to test specific parameter settings, specific
                  pool initial values and configurations, you can access the
                  advanced simulator.
                </p>
              </Col>
              <Button
                type="primary"
                size="large"
                className={runnerStyles.greenButton}
                onClick={() => dispatch(changeSimulationRunnerCurrentStepIndex(1))}
              >
                Begin Advanced Simulation Runner
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={12} className={runnerStyles.panelPadding}>
          <SimulatorGuide />
        </Col>
      </Row>
    </div>
  );
}
