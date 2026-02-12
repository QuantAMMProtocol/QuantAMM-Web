import { describe, expect, it } from 'vitest';
import { runBalancer, runHodl } from './simulations';
import {
  Chain,
  Coin,
  CoinPrice,
  LiquidityPool,
  LiquidityPoolCoin,
} from '../simulationRunConfiguration/simulationRunConfigModels';

const createCoin = (
  coinCode: string,
  prices: { unix: number; close: number }[]
): Coin => {
  const dailyPriceHistory: CoinPrice[] = prices.map((p) => ({
    unix: p.unix,
    close: p.close,
    open: p.close,
    high: p.close,
    low: p.close,
    date: new Date(p.unix).toISOString(),
  }));

  return {
    coinName: coinCode,
    coinCode,
    dailyPriceHistory,
    dailyPriceHistoryMap: new Map(
      prices.map((p) => [
        p.unix,
        {
          unix: p.unix,
          close: p.close,
          open: p.close,
          high: p.close,
          low: p.close,
          date: new Date(p.unix).toISOString(),
        },
      ])
    ),
    dailyReturns: new Map(),
    coinComparisons: new Map(),
    deploymentByChain: new Map([
      [
        Chain.Base,
        { address: `0x${coinCode}`, oracles: new Map(), approvalStatus: true },
      ],
    ]),
  };
};

const createConstituent = (
  coin: Coin,
  amount: number,
  currentPrice: number,
  weight: number
): LiquidityPoolCoin => ({
  coin,
  amount,
  currentPrice,
  currentPriceUnix: coin.dailyPriceHistory[0]?.unix,
  marketValue: amount * currentPrice,
  weight,
  factorValue: null,
});

const createPool = (poolConstituents: LiquidityPoolCoin[]): LiquidityPool =>
  ({
    id: 'pool-1',
    name: 'pool-1',
    poolConstituents,
    feeHooks: [],
    swapImports: [],
    poolType: {
      name: 'Weighted',
      mandatoryProperties: [],
      shortDescription: '',
      requiresPoolNumeraire: false,
    },
    updateRule: {
      updateRuleName: 'Momentum',
      updateRuleKey: 'momentum',
      updateRuleSimKey: 'momentum',
      updateRuleResultProfileSummary: '',
      heatmapKeys: [],
      updateRuleRunUrl: undefined,
      updateRuleTrainUrl: undefined,
      applicablePoolTypes: [],
      updateRuleParameters: [],
      chainDeploymentDetails: new Map(),
    },
    runStatus: '',
    poolNumeraireCoinCode: '',
    enableAutomaticArbBots: false,
  }) as LiquidityPool;

describe('simulationRunner/simulations view-model logic', () => {
  it('runHodl builds snapshots across time and updates market weights', () => {
    const eth = createCoin('ETH', [
      { unix: 1000, close: 10 },
      { unix: 2000, close: 12 },
    ]);
    const usdc = createCoin('USDC', [
      { unix: 1000, close: 20 },
      { unix: 2000, close: 18 },
    ]);

    const pool = createPool([
      createConstituent(eth, 1, 10, 50),
      createConstituent(usdc, 1, 20, 50),
    ]);

    const snapshots = runHodl(pool, 1000, 3000);

    expect(snapshots).toHaveLength(2);
    expect(snapshots[0].coinsHeld).toHaveLength(2);
    expect(snapshots[0].totalPoolMarketValue).toBe(30);
    expect(snapshots[0].coinsHeld[0].weight).toBeCloseTo(33.33, 2);
    expect(snapshots[0].coinsHeld[1].weight).toBeCloseTo(66.67, 2);
  });

  it('runHodl supports second-based timestamps fallback when ms filter misses', () => {
    const eth = createCoin('ETH', [
      { unix: 1, close: 10 },
      { unix: 2, close: 11 },
    ]);
    const usdc = createCoin('USDC', [
      { unix: 1, close: 20 },
      { unix: 2, close: 19 },
    ]);

    const pool = createPool([
      createConstituent(eth, 1, 10, 50),
      createConstituent(usdc, 1, 20, 50),
    ]);

    const snapshots = runHodl(pool, 1000, 3000);
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0].unix).toBe(2);
  });

  it('runBalancer rebalances amounts based on relative price moves and preserves value', () => {
    const eth = createCoin('ETH', [
      { unix: 1000, close: 10 },
      { unix: 2000, close: 20 },
    ]);
    const usdc = createCoin('USDC', [
      { unix: 1000, close: 10 },
      { unix: 2000, close: 5 },
    ]);

    const pool = createPool([
      createConstituent(eth, 1, 10, 50),
      createConstituent(usdc, 1, 10, 50),
    ]);

    const snapshots = runBalancer(pool, 1000, 2000);

    expect(snapshots).toHaveLength(2);
    expect(snapshots[0].totalPoolMarketValue).toBeCloseTo(20, 10);
    expect(snapshots[1].coinsHeld[0].amount).toBeCloseTo(0.5, 10);
    expect(snapshots[1].coinsHeld[1].amount).toBeCloseTo(2, 10);
    expect(snapshots[1].totalPoolMarketValue).toBeCloseTo(20, 10);
    expect(snapshots[1].feeForSnapshot).toBeCloseTo(0, 10);
  });
});
