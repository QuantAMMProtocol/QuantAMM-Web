import { Col, Row } from 'antd';

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
import { SimpleRunnerSection } from './simulationSimpleRunnerSection';
import {
  AdvancedRunnerSection,
  SimulatorIntroSection,
} from './simulationOptionsSections';

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
