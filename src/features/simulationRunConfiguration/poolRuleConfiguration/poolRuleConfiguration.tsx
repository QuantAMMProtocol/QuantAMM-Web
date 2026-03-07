import { Row, Col } from 'antd';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
  changeSimulationRunnerCurrentStepIndex,
  selectSimulationRunStatusStepIndex,
} from '../../simulationRunner/simulationRunnerSlice';
import styles from '../simulationRunConfiguration.module.css';
import {
  selectCoinPriceDataLoaded,
  selectAvailableUpdateRules,
  selectPoolConstituents,
  generateAndAddPoolToSim,
  selectAvailablePoolTypes,
  selectPoolType,
  setPoolCoinNumeraire,
  selectPoolNumeraire,
  selectSimulationPools,
} from '../simulationRunConfigurationSlice';
import {
  LiquidityPoolCoin,
  PoolType,
  UpdateRule,
  UpdateRuleParameter,
} from '../simulationRunConfigModels';
import { LiquidityPoolConfiguration } from '../liquidityPoolConfiguration';
import {
  AddPoolButtonSection,
  SummaryAndContinueSection,
} from './poolRuleConfigurationSections';
import { getDefaultUpdateRuleForPoolType } from '../utils/poolRuleConfigurationUtils';
import { PoolRuleConfigurationCenterColumn } from './poolRuleConfigurationCenterColumn';
import { getUpdatedRuleForFactorChange } from '../utils/poolRuleConfigurationUpdateRuleFactor';

export function PoolRuleConfiguration() {
  const availableUpdateRules = useAppSelector(selectAvailableUpdateRules);
  const availablePoolTypes = useAppSelector(selectAvailablePoolTypes);
  const poolType = useAppSelector(selectPoolType);
  const poolConstituents = useAppSelector(selectPoolConstituents);
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const poolNumeraire = useAppSelector(selectPoolNumeraire);
  const simulationPools = useAppSelector(selectSimulationPools);
  const dispatch = useAppDispatch();

  const currentInitialRule =
    getDefaultUpdateRuleForPoolType(poolType.name, availableUpdateRules) ??
    availableUpdateRules.find((rule) => rule.updateRuleName === 'HODL') ??
    availableUpdateRules[0];

  const currentInitialPoolType =
    availablePoolTypes.find((type) => type.name === poolType.name) ??
    availablePoolTypes[0];

  const [localUpdateRule, setLocalUpdateRule] =
    useState<UpdateRule>(currentInitialRule);

  const [localPoolType, setLocalPoolType] = useState<PoolType>(
    currentInitialPoolType
  );
  const [enableArbBots, setEnableArbBots] = useState(true);

  const [isUniversal, setIsUniversal] = useState(true);
  const isRunLocked = runStatusIndex === 2;

  function handleUpdateRuleFactor(
    updateRuleParam: UpdateRuleParameter,
    e: number | string | null,
    applicableCoins: LiquidityPoolCoin[]
  ) {
    const newValue = `${e ?? 0}`;

    setLocalUpdateRule((prevRule) => {
      return getUpdatedRuleForFactorChange(
        prevRule,
        updateRuleParam,
        newValue,
        applicableCoins,
        isUniversal
      );
    });
  }

  return (
    <div>
      <Row gutter={[20, 20]} className={styles.poolConfigurationRow}>
        <Col xs={24} xl={12} xxl={10}>
          <LiquidityPoolConfiguration />
        </Col>
        <Col xs={24} xl={12} xxl={8} className={styles.poolRuleCenterColumn}>
          <PoolRuleConfigurationCenterColumn
            coinDataLoaded={coinDataLoaded}
            isRunLocked={isRunLocked}
            localPoolType={localPoolType}
            localUpdateRule={localUpdateRule}
            availablePoolTypes={availablePoolTypes}
            availableUpdateRules={availableUpdateRules}
            poolConstituents={poolConstituents}
            poolNumeraire={poolNumeraire}
            enableArbBots={enableArbBots}
            isUniversal={isUniversal}
            runStatusIndex={runStatusIndex}
            setLocalPoolType={setLocalPoolType}
            setLocalUpdateRule={setLocalUpdateRule}
            setEnableArbBots={setEnableArbBots}
            setIsUniversal={setIsUniversal}
            onPoolNumeraireChange={(value) => {
              dispatch(setPoolCoinNumeraire(value));
            }}
            onUpdateRuleFactor={handleUpdateRuleFactor}
          />
          <AddPoolButtonSection
            coinDataLoaded={coinDataLoaded}
            isRunLocked={isRunLocked}
            localPoolType={localPoolType}
            poolNumeraire={poolNumeraire}
            localUpdateRule={localUpdateRule}
            poolConstituents={poolConstituents}
            enableArbBots={enableArbBots}
            onAddPool={(payload) => {
              dispatch(generateAndAddPoolToSim(payload));
            }}
          />
        </Col>
        <SummaryAndContinueSection
          coinDataLoaded={coinDataLoaded}
          isRunLocked={isRunLocked}
          simulationPoolsLength={simulationPools.length}
          onContinue={() => {
            dispatch(changeSimulationRunnerCurrentStepIndex(2));
          }}
        />
      </Row>
    </div>
  );
}
