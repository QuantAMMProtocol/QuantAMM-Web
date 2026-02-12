import { describe, expect, it } from 'vitest';
import { Chain, LiquidityPool } from './simulationRunConfigModels';
import {
  buildRuleParametersString,
  reorderReadoutStringArray,
  sortTokenAddresses,
} from './simulationUtils';

const ethAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const btcAddress = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

const createPool = (): LiquidityPool =>
  ({
    poolConstituents: [
      {
        coin: {
          coinCode: 'BTC',
          deploymentByChain: new Map([[Chain.Base, { address: btcAddress }]]),
        },
      },
      {
        coin: {
          coinCode: 'ETH',
          deploymentByChain: new Map([[Chain.Base, { address: ethAddress }]]),
        },
      },
    ],
    updateRule: {
      updateRuleParameters: [
        { factorName: 'kappa', smartContractSortOrder: 2 },
        { factorName: 'delta', smartContractSortOrder: 1 },
        { factorName: 'lamb', smartContractSortOrder: 3 },
      ],
    },
  }) as unknown as LiquidityPool;

describe('simulationUtils view-model logic', () => {
  it('sorts token addresses case-insensitively without mutating input', () => {
    const input = [
      '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      '0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    ];
    const sorted = sortTokenAddresses(input);

    expect(sorted).toEqual([
      '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      '0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    ]);
    expect(input[0]).toBe('0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
  });

  it('builds non-lambda rule parameter rows in factor sort order and token address order', () => {
    const pool = createPool();
    const rule = buildRuleParametersString(
      pool,
      {
        kappa: ['2', '1'],
        delta: ['20', '10'],
        lamb: ['0.7', '0.3'],
      },
      [ethAddress, btcAddress],
      Chain.Base,
      false
    );

    expect(rule).toBe('[\n  [10, 20] // delta,\n  [1, 2] // kappa\n]');
  });

  it('builds lambda-only rule parameter rows and reorders readouts by address sort order', () => {
    const pool = createPool();
    const lambdaRule = buildRuleParametersString(
      pool,
      {
        kappa: ['2', '1'],
        lamb: ['0.7', '0.3'],
      },
      [ethAddress.toUpperCase(), btcAddress.toUpperCase()],
      Chain.Base,
      true
    );

    const reorderedReadout = reorderReadoutStringArray(
      pool,
      ['btc-readout', 'eth-readout'],
      [ethAddress, btcAddress],
      Chain.Base
    );

    expect(lambdaRule).toBe('[0.3, 0.7]');
    expect(reorderedReadout).toEqual(['eth-readout', 'btc-readout']);
  });
});
