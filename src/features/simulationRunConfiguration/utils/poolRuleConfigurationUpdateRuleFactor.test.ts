import { describe, expect, it } from 'vitest';
import {
  Chain,
  LiquidityPoolCoin,
  UpdateRule,
  UpdateRuleParameter,
} from '../simulationRunConfigModels';
import { getUpdatedRuleForFactorChange } from './poolRuleConfigurationUpdateRuleFactor';

const createCoin = (
  coinCode: string,
  factorValue: string | null
): LiquidityPoolCoin => ({
  coin: {
    coinName: coinCode,
    coinCode,
    dailyPriceHistory: [],
    dailyPriceHistoryMap: new Map(),
    dailyReturns: new Map(),
    coinComparisons: new Map(),
    deploymentByChain: new Map(),
  },
  amount: 1,
  marketValue: 1,
  currentPrice: 1,
  currentPriceUnix: 1,
  weight: 50,
  factorValue,
});

const createParameter = (
  factorName: string,
  factorValue: string,
  applicableCoins: LiquidityPoolCoin[] = []
): UpdateRuleParameter => ({
  factorName,
  factorDisplayName: factorName,
  factorDescription: `${factorName} description`,
  applicableCoins,
  factorValue,
  minValue: '0',
  maxValue: '10',
  smartContractSortOrder: 0,
});

const createRule = (parameters: UpdateRuleParameter[]): UpdateRule => ({
  updateRuleName: 'Momentum',
  updateRuleKey: 'momentum',
  updateRuleSimKey: 'momentum',
  updateRuleResultProfileSummary: '',
  heatmapKeys: [],
  updateRuleRunUrl: undefined,
  updateRuleTrainUrl: undefined,
  applicablePoolTypes: ['QuantAMM'],
  updateRuleParameters: parameters,
  chainDeploymentDetails: new Map<Chain, string>(),
});

describe('getUpdatedRuleForFactorChange', () => {
  it('updates matching parameter value and clears applicable coins in universal mode', () => {
    const coinA = createCoin('ETH', '1.0000');
    const prevRule = createRule([
      createParameter('k_per_day', '1.0000', [coinA]),
    ]);

    const result = getUpdatedRuleForFactorChange(
      prevRule,
      prevRule.updateRuleParameters[0],
      '2.5000',
      [coinA],
      true
    );

    expect(result.updateRuleParameters[0].factorValue).toBe('2.5000');
    expect(result.updateRuleParameters[0].applicableCoins).toEqual([]);
    expect(prevRule.updateRuleParameters[0].factorValue).toBe('1.0000');
  });

  it('updates only selected coin factors in per-token mode', () => {
    const coinA = createCoin('ETH', '1.0000');
    const coinB = createCoin('USDC', '1.0000');
    const parameter = createParameter('k_per_day', '1.0000', [coinA, coinB]);
    const prevRule = createRule([parameter]);

    const result = getUpdatedRuleForFactorChange(
      prevRule,
      parameter,
      '3.7500',
      [coinB],
      false
    );

    expect(result.updateRuleParameters[0].factorValue).toBe('1.0000');
    expect(result.updateRuleParameters[0].applicableCoins[0].factorValue).toBe(
      '1.0000'
    );
    expect(result.updateRuleParameters[0].applicableCoins[1].factorValue).toBe(
      '3.7500'
    );
  });

  it('leaves parameters unchanged when factor does not match', () => {
    const coinA = createCoin('ETH', '1.0000');
    const parameter = createParameter('k_per_day', '1.0000', [coinA]);
    const prevRule = createRule([parameter]);

    const result = getUpdatedRuleForFactorChange(
      prevRule,
      createParameter('memory', '5.0000'),
      '7.0000',
      [coinA],
      false
    );

    expect(result.updateRuleParameters[0]).toEqual(parameter);
  });
});
