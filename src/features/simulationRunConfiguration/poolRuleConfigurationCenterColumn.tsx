import { Row } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import {
  LiquidityPoolCoin,
  PoolType,
  UpdateRule,
  UpdateRuleParameter,
} from './simulationRunConfigModels';
import { PoolRuleConfigurationTypeSection } from './poolRuleConfigurationTypeSection';
import { PoolRuleConfigurationStrategySelectorSection } from './poolRuleConfigurationStrategySelectorSection';
import { PoolRuleConfigurationParametersSection } from './poolRuleConfigurationParametersSection';

interface PoolRuleConfigurationCenterColumnProps {
  coinDataLoaded: boolean;
  isRunLocked: boolean;
  localPoolType: PoolType;
  localUpdateRule: UpdateRule;
  availablePoolTypes: PoolType[];
  availableUpdateRules: UpdateRule[];
  poolConstituents: LiquidityPoolCoin[];
  poolNumeraire: string;
  enableArbBots: boolean;
  isUniversal: boolean;
  runStatusIndex: number;
  setLocalPoolType: Dispatch<SetStateAction<PoolType>>;
  setLocalUpdateRule: Dispatch<SetStateAction<UpdateRule>>;
  setEnableArbBots: Dispatch<SetStateAction<boolean>>;
  setIsUniversal: Dispatch<SetStateAction<boolean>>;
  onPoolNumeraireChange: (value: string) => void;
  onUpdateRuleFactor: (
    updateRule: UpdateRuleParameter,
    e: number | string | null,
    applicableCoins: LiquidityPoolCoin[]
  ) => void;
}

export function PoolRuleConfigurationCenterColumn({
  coinDataLoaded,
  isRunLocked,
  localPoolType,
  localUpdateRule,
  availablePoolTypes,
  availableUpdateRules,
  poolConstituents,
  poolNumeraire,
  enableArbBots,
  isUniversal,
  runStatusIndex,
  setLocalPoolType,
  setLocalUpdateRule,
  setEnableArbBots,
  setIsUniversal,
  onPoolNumeraireChange,
  onUpdateRuleFactor,
}: PoolRuleConfigurationCenterColumnProps) {
  return (
    <div>
      <Row>
        <PoolRuleConfigurationTypeSection
          coinDataLoaded={coinDataLoaded}
          isRunLocked={isRunLocked}
          localPoolType={localPoolType}
          availablePoolTypes={availablePoolTypes}
          availableUpdateRules={availableUpdateRules}
          poolConstituents={poolConstituents}
          poolNumeraire={poolNumeraire}
          setLocalPoolType={setLocalPoolType}
          setLocalUpdateRule={setLocalUpdateRule}
          onPoolNumeraireChange={onPoolNumeraireChange}
        />
        <PoolRuleConfigurationStrategySelectorSection
          coinDataLoaded={coinDataLoaded}
          isRunLocked={isRunLocked}
          localPoolType={localPoolType}
          localUpdateRule={localUpdateRule}
          availableUpdateRules={availableUpdateRules}
          enableArbBots={enableArbBots}
          setLocalUpdateRule={setLocalUpdateRule}
          setEnableArbBots={setEnableArbBots}
        />
        <PoolRuleConfigurationParametersSection
          coinDataLoaded={coinDataLoaded}
          runStatusIndex={runStatusIndex}
          localPoolType={localPoolType}
          localUpdateRule={localUpdateRule}
          availableUpdateRules={availableUpdateRules}
          poolConstituents={poolConstituents}
          isUniversal={isUniversal}
          setLocalUpdateRule={setLocalUpdateRule}
          setIsUniversal={setIsUniversal}
          onUpdateRuleFactor={onUpdateRuleFactor}
        />
      </Row>
    </div>
  );
}
