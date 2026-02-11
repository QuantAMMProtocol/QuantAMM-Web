import {
  LiquidityPoolCoin,
  UpdateRule,
  UpdateRuleParameter,
} from './simulationRunConfigModels';

export function getUpdatedRuleForFactorChange(
  prevRule: UpdateRule,
  updateRuleParam: UpdateRuleParameter,
  newValue: string,
  applicableCoins: LiquidityPoolCoin[],
  isUniversal: boolean
): UpdateRule {
  const updatedParameters = prevRule.updateRuleParameters.map((param) => {
    if (param.factorName === updateRuleParam.factorName) {
      if (isUniversal) {
        return {
          ...param,
          factorValue: newValue,
          applicableCoins: [],
        };
      }

      const updatedApplicableCoins = param.applicableCoins.map((coin) => {
        if (
          applicableCoins.some((ac) => ac.coin.coinCode === coin.coin.coinCode)
        ) {
          return {
            ...coin,
            factorValue: newValue,
          };
        }
        return coin;
      });

      return {
        ...param,
        applicableCoins: updatedApplicableCoins,
      };
    }
    return param;
  });

  return {
    ...prevRule,
    updateRuleParameters: updatedParameters,
  };
}
