import { Radio } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { LiquidityPoolCoin, UpdateRule } from '../simulationRunConfigModels';
import styles from '../simulationRunConfiguration.module.css';

interface PoolRuleConfigurationUniversalToggleProps {
  localUpdateRule: UpdateRule;
  availableUpdateRules: UpdateRule[];
  poolConstituents: LiquidityPoolCoin[];
  isUniversal: boolean;
  setLocalUpdateRule: Dispatch<SetStateAction<UpdateRule>>;
  setIsUniversal: Dispatch<SetStateAction<boolean>>;
}

export function PoolRuleConfigurationUniversalToggle({
  localUpdateRule,
  availableUpdateRules,
  poolConstituents,
  isUniversal,
  setLocalUpdateRule,
  setIsUniversal,
}: PoolRuleConfigurationUniversalToggleProps) {
  return (
    <div
      id="UniversalToggle"
      hidden={
        localUpdateRule.updateRuleName.toLowerCase().indexOf('cowamm') !== -1 ||
        localUpdateRule.updateRuleName.toLowerCase().indexOf('gyro') !== -1
      }
    >
      <Radio.Group
        onChange={(e) => {
          const nextIsUniversal = e.target.value;

          if (!nextIsUniversal) {
            setLocalUpdateRule((prevRule) => ({
              ...prevRule,
              updateRuleParameters: prevRule.updateRuleParameters.map(
                (param) => ({
                  ...param,
                  applicableCoins: poolConstituents.map((token) => ({
                    coin: token.coin,
                    weight: token.weight,
                    currentPrice: token.currentPrice,
                    currentPriceUnix: token.currentPriceUnix,
                    amount: token.amount,
                    marketValue: token.marketValue,
                    factorValue: param.factorValue,
                  })),
                })
              ),
            }));
          } else {
            const foundRule = availableUpdateRules.find(
              (x) => x.updateRuleName === localUpdateRule.updateRuleName
            );

            if (foundRule) {
              setLocalUpdateRule((prevRule) => ({
                ...prevRule,
                updateRuleParameters: foundRule.updateRuleParameters.map(
                  (param) => ({
                    ...param,
                    applicableCoins: [],
                  })
                ),
              }));
            }
          }
          setIsUniversal(nextIsUniversal);
        }}
        size="small"
        className={styles.universalToggleGroup}
        value={isUniversal}
      >
        <Radio.Button
          value={true}
          disabled
          className={styles.universalToggleLabel}
        >
          Parameters applied to
        </Radio.Button>
        <Radio.Button value={true} className={styles.universalToggleOption}>
          All Tokens
        </Radio.Button>
        <Radio.Button value={false} className={styles.universalToggleOption}>
          Per Token
        </Radio.Button>
      </Radio.Group>
    </div>
  );
}
