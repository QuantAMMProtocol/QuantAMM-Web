import { describe, expect, it } from 'vitest';
import {
  addFeeHooksToPool,
  addFixedFeeToPool,
  addSimplifiedSelectionsToSimulatorPools,
  changeSimulationSimplifiedIncludeLvrRuns,
  changeSimulationSimplifiedIncludeRvRuns,
  generateAndAddPoolToSim,
  getCurrentPrice,
  removeSim,
  upsertSelectedCoins,
  updatePoolWeights,
} from './simulationRunConfigurationSlice';
import simConfigReducer from './simulationRunConfigurationSlice';
import { Coin, LiquidityPoolCoin } from './simulationRunConfigModels';

const createCoin = (history: { unix: number; close: number }[]): Coin => ({
  coinName: 'Test Coin',
  coinCode: 'TST',
  dailyPriceHistory: history.map((entry, index) => ({
    date: `2024-01-${String(index + 1).padStart(2, '0')} 00:00:00`,
    unix: entry.unix,
    open: entry.close,
    high: entry.close,
    low: entry.close,
    close: entry.close,
  })),
  dailyPriceHistoryMap: new Map(),
  dailyReturns: new Map(),
  coinComparisons: new Map(),
  deploymentByChain: new Map(),
});

const createPoolConstituent = (
  coin: Coin,
  marketValue: number
): LiquidityPoolCoin => ({
  coin,
  marketValue,
  currentPrice: 1,
  currentPriceUnix: 1,
  amount: marketValue,
  weight: 0,
  factorValue: null,
});

describe('simulationRunConfigurationSlice view-model logic', () => {
  it('resolves current price from millisecond timestamps', () => {
    const currentDate = '2024-01-01 00:00:00';
    const coin = createCoin([
      { unix: 1704067300000, close: 20 },
      { unix: 1704067200000, close: 10 },
    ]);

    const result = getCurrentPrice(coin, currentDate);

    expect(result).toEqual({
      close: 10,
      closeUnix: 1704067200000,
    });
  });

  it('falls back to second-based timestamps when millisecond lookup misses', () => {
    const currentDate = '2024-01-01 00:00:00';
    const coin = createCoin([
      { unix: 1704067300, close: 20 },
      { unix: 1704067201, close: 11 },
    ]);

    const result = getCurrentPrice(coin, currentDate);

    expect(result).toEqual({
      close: 11,
      closeUnix: 1704067201,
    });
  });

  it('updates pool weights as percentages of total market value', () => {
    const coin = createCoin([{ unix: 1704067200000, close: 1 }]);
    const constituents = [
      createPoolConstituent(coin, 20),
      createPoolConstituent(coin, 80),
    ];

    updatePoolWeights(constituents);

    expect(constituents[0].weight).toBe(20);
    expect(constituents[1].weight).toBe(80);
  });

  it('filters Cow and Gyroscope simplified pools when selected coins exceed two', () => {
    const baseState = simConfigReducer(undefined, { type: '@@INIT' });
    const seededState = {
      ...baseState,
      selectedCoinsToAddToPool: [
        baseState.availableCoins[0],
        baseState.availableCoins[1],
      ],
      selectedSimplifiedPools: ['CowAMM Weighted', 'Gyroscope', 'QuantAMM'],
    };

    const nextState = simConfigReducer(
      seededState,
      upsertSelectedCoins(baseState.availableCoins[2].coinCode)
    );

    expect(nextState.selectedCoinsToAddToPool).toHaveLength(3);
    expect(nextState.selectedSimplifiedPools).toEqual(['QuantAMM']);
  });

  it('adds and removes simulation pools using explicit ids', () => {
    const baseState = simConfigReducer(undefined, { type: '@@INIT' });
    const clearedState = {
      ...baseState,
      simulationLiquidityPools: [],
    };

    const addedState = simConfigReducer(
      clearedState,
      generateAndAddPoolToSim({
        id: 'pool-42',
        updateRule: baseState.initialLiquidityPool.updateRule,
        poolConstituents: baseState.initialLiquidityPool.poolConstituents,
        poolType: baseState.initialLiquidityPool.poolType,
        enableAutomaticArbBots: true,
      })
    );

    expect(addedState.simulationLiquidityPools).toHaveLength(1);
    expect(addedState.simulationLiquidityPools[0].id).toBe('pool-42');
    expect(addedState.simulationLiquidityPools[0].enableAutomaticArbBots).toBe(
      true
    );

    const removedState = simConfigReducer(addedState, removeSim('pool-42'));

    expect(removedState.simulationLiquidityPools).toHaveLength(0);
  });

  it('toggles simplified LVR and RVR flags', () => {
    const baseState = simConfigReducer(undefined, { type: '@@INIT' });

    const afterLvrToggle = simConfigReducer(
      baseState,
      changeSimulationSimplifiedIncludeLvrRuns()
    );
    const afterRvrToggle = simConfigReducer(
      afterLvrToggle,
      changeSimulationSimplifiedIncludeRvRuns()
    );

    expect(afterLvrToggle.simulationSimplifiedIncludeLvrRuns).toBe(true);
    expect(afterRvrToggle.simulationSimplifiedIncludeRvrRuns).toBe(true);
  });

  it('expands simplified QuantAMM selection into base + LVR + RVR pools when toggles are enabled', () => {
    const baseState = simConfigReducer(undefined, { type: '@@INIT' });
    const seededState = {
      ...baseState,
      simulationLiquidityPools: [],
      selectedCoinsToAddToPool: [
        baseState.availableCoins[0],
        baseState.availableCoins[1],
      ],
      selectedSimplifiedPools: ['QuantAMM: Momentum'],
      simulationSimplifiedIncludeLvrRuns: true,
      simulationSimplifiedIncludeRvrRuns: true,
    };

    const nextState = simConfigReducer(
      seededState,
      addSimplifiedSelectionsToSimulatorPools()
    );

    const updateRuleNames = nextState.simulationLiquidityPools.map(
      (pool) => pool.updateRule.updateRuleName
    );

    expect(nextState.simulationLiquidityPools.length).toBeGreaterThanOrEqual(3);
    expect(updateRuleNames).toEqual(
      expect.arrayContaining(['Momentum', 'LVR - Momentum', 'RVR - Momentum'])
    );
    expect(
      nextState.simulationLiquidityPools.every(
        (pool) => pool.enableAutomaticArbBots
      )
    ).toBe(true);
  });

  it('replaces existing fixed-fee hook values for a pool', () => {
    const baseState = simConfigReducer(undefined, { type: '@@INIT' });
    const coinA = createCoin([
      { unix: 1, close: 10 },
      { unix: 2, close: 11 },
    ]);
    const coinB = createCoin([
      { unix: 1, close: 20 },
      { unix: 2, close: 21 },
    ]);

    const seededState = {
      ...baseState,
      simulationLiquidityPools: [
        {
          ...baseState.initialLiquidityPool,
          id: 'pool-fee',
          poolConstituents: [
            createPoolConstituent(coinA, 50),
            createPoolConstituent(coinB, 50),
          ],
          feeHooks: [
            {
              hookName: 'swapFee',
              hookTargetTokens: ['A', 'B'],
              hookTimeSteps: [{ unix: 123, value: 1 }],
              minValue: 0,
              maxValue: 0,
              unit: 'bps',
            },
          ],
        },
      ],
    };

    const nextState = simConfigReducer(
      seededState,
      addFixedFeeToPool({
        fixedFee: 5,
        poolId: 'pool-fee',
        feeHookName: 'swapFee',
      })
    );

    const hook = nextState.simulationLiquidityPools[0].feeHooks.find(
      (item) => item.hookName === 'swapFee'
    );
    expect(hook?.hookTimeSteps).toEqual([
      { unix: 1, value: 5 },
      { unix: 2, value: 5 },
      { unix: 1, value: 5 },
      { unix: 2, value: 5 },
    ]);
    expect(hook?.unit).toBe('bps');
  });

  it('replaces imported fee-hook time series by hook name', () => {
    const baseState = simConfigReducer(undefined, { type: '@@INIT' });

    const seededState = {
      ...baseState,
      simulationLiquidityPools: [
        {
          ...baseState.initialLiquidityPool,
          id: 'pool-import-fee',
          feeHooks: [
            {
              hookName: 'swapFee',
              hookTargetTokens: ['ETH'],
              hookTimeSteps: [{ unix: 111, value: 3 }],
              minValue: 0,
              maxValue: 0,
              unit: 'bps',
            },
            {
              hookName: 'otherHook',
              hookTargetTokens: ['ETH'],
              hookTimeSteps: [{ unix: 222, value: 1 }],
              minValue: 0,
              maxValue: 0,
              unit: 'bps',
            },
          ],
        },
      ],
    };

    const nextState = simConfigReducer(
      seededState,
      addFeeHooksToPool({
        feeHookName: 'swapFee',
        poolId: 'pool-import-fee',
        fees: [
          { unix: 1, value: 8 },
          { unix: 2, value: 9 },
        ],
      })
    );

    const targetPool = nextState.simulationLiquidityPools[0];
    const swapFeeHook = targetPool.feeHooks.find(
      (item) => item.hookName === 'swapFee'
    );
    const otherHook = targetPool.feeHooks.find(
      (item) => item.hookName === 'otherHook'
    );

    expect(swapFeeHook?.hookTimeSteps).toEqual([
      { unix: 1, value: 8 },
      { unix: 2, value: 9 },
    ]);
    expect(otherHook?.hookTimeSteps).toEqual([{ unix: 222, value: 1 }]);
  });
});
