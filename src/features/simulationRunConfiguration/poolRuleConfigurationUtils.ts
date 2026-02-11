import { UpdateRule } from './simulationRunConfigModels';

export const getDefaultUpdateRuleForPoolType = (
  poolTypeName: string,
  availableUpdateRules: UpdateRule[]
): UpdateRule | undefined => {
  if (poolTypeName === 'QuantAMM') {
    return availableUpdateRules.find((x) => x.updateRuleName === 'Momentum');
  }
  return availableUpdateRules.find((x) =>
    x.applicablePoolTypes.some((poolType) => poolType === poolTypeName)
  );
};
