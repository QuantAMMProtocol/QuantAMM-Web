import { describe, expect, it } from 'vitest';
import { Chain, UpdateRule } from '../simulationRunConfigModels';
import { getDefaultUpdateRuleForPoolType } from './poolRuleConfigurationUtils';

const createUpdateRule = (
  updateRuleName: string,
  applicablePoolTypes: string[]
): UpdateRule => ({
  updateRuleName,
  updateRuleKey: updateRuleName.toLowerCase(),
  updateRuleSimKey: updateRuleName.toLowerCase(),
  updateRuleResultProfileSummary: '',
  heatmapKeys: [],
  updateRuleRunUrl: undefined,
  updateRuleTrainUrl: undefined,
  applicablePoolTypes,
  updateRuleParameters: [],
  chainDeploymentDetails: new Map<Chain, string>(),
});

describe('getDefaultUpdateRuleForPoolType', () => {
  it('returns Momentum for QuantAMM when available', () => {
    const rules = [
      createUpdateRule('HODL', ['QuantAMM', 'Weighted']),
      createUpdateRule('Momentum', ['QuantAMM']),
    ];

    const result = getDefaultUpdateRuleForPoolType('QuantAMM', rules);

    expect(result?.updateRuleName).toBe('Momentum');
  });

  it('returns the first applicable rule for non-QuantAMM pool types', () => {
    const rules = [
      createUpdateRule('HODL', ['Weighted']),
      createUpdateRule('Momentum', ['QuantAMM']),
    ];

    const result = getDefaultUpdateRuleForPoolType('Weighted', rules);

    expect(result?.updateRuleName).toBe('HODL');
  });

  it('returns undefined when no applicable rule exists', () => {
    const rules = [createUpdateRule('HODL', ['Weighted'])];

    const result = getDefaultUpdateRuleForPoolType('Gyroscope', rules);

    expect(result).toBeUndefined();
  });
});
