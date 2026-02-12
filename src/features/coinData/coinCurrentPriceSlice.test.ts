import { describe, expect, it } from 'vitest';
import { GqlChain } from '../../__generated__/graphql-types';
import coinCurrentPricesReducer, {
  COIN_PRICE_CHAINS,
  fetchCoinCurrentPrices,
  selectCoinChainStatus,
  selectCoinPrice,
  setCoinPriceChains,
  setPollingState,
} from './coinCurrentPriceSlice';

const getTestChains = (): [GqlChain, GqlChain] => [
  COIN_PRICE_CHAINS[0] ?? GqlChain.Base,
  COIN_PRICE_CHAINS[1] ?? GqlChain.Arbitrum,
];

describe('coinCurrentPriceSlice view-model logic', () => {
  it('updates polling state and interval', () => {
    const baseState = coinCurrentPricesReducer(undefined, { type: '@@INIT' });
    const nextState = coinCurrentPricesReducer(
      baseState,
      setPollingState({ isRunning: true, intervalMs: 15_000 })
    );

    expect(nextState.polling.isRunning).toBe(true);
    expect(nextState.polling.intervalMs).toBe(15_000);
  });

  it('retains data for selected chains and drops removed chains', () => {
    const [chainA, chainB] = getTestChains();
    const baseState = coinCurrentPricesReducer(undefined, { type: '@@INIT' });
    const seededState = {
      ...baseState,
      byChain: {
        [chainA]: {
          '0xabc': { address: '0xAbC', price: 100, updatedAt: 123 },
        },
        [chainB]: {
          '0xdef': { address: '0xDef', price: 200, updatedAt: 456 },
        },
      },
      statusByChain: {
        [chainA]: 'succeeded',
        [chainB]: 'failed',
      },
      errorByChain: {
        [chainA]: null,
        [chainB]: 'boom',
      },
    };

    const nextState = coinCurrentPricesReducer(
      seededState,
      setCoinPriceChains([chainA])
    );

    expect(nextState.byChain[chainA]?.['0xabc']?.price).toBe(100);
    expect(nextState.byChain[chainB]).toBeUndefined();
    expect(nextState.statusByChain[chainA]).toBe('succeeded');
    expect(nextState.statusByChain[chainB]).toBeUndefined();
    expect(nextState.errorByChain[chainB]).toBeUndefined();
  });

  it('handles thunk lifecycle actions for loading, success, and failure', () => {
    const [chainA] = getTestChains();
    const baseState = coinCurrentPricesReducer(undefined, { type: '@@INIT' });
    const arg = { client: {} as any, chains: [chainA] };

    const loadingState = coinCurrentPricesReducer(
      baseState,
      fetchCoinCurrentPrices.pending('req-1', arg)
    );
    expect(loadingState.statusByChain[chainA]).toBe('loading');

    const successState = coinCurrentPricesReducer(
      loadingState,
      fetchCoinCurrentPrices.fulfilled(
        {
          perChain: {
            [chainA]: {
              '0xabc': {
                address: '0xAbC',
                price: 123.45,
                updatedAt: 111,
              },
            },
          } as any,
          fetchedAt: 111,
        },
        'req-1',
        arg
      )
    );

    expect(successState.statusByChain[chainA]).toBe('succeeded');
    expect(successState.byChain[chainA]?.['0xabc']?.price).toBe(123.45);
    expect(successState.lastUpdatedAt).toBe(111);

    const failedState = coinCurrentPricesReducer(
      baseState,
      fetchCoinCurrentPrices.rejected(new Error('network error'), 'req-2', arg)
    );
    expect(failedState.statusByChain[chainA]).toBe('failed');
    expect(failedState.errorByChain[chainA]).toContain('network error');
  });

  it('selectors return normalized lookup results and fallback status', () => {
    const [chainA, chainB] = getTestChains();
    const state = {
      currentPrices: {
        byChain: {
          [chainA]: {
            '0xabc': { address: '0xAbC', price: 99, updatedAt: 1 },
          },
        },
        statusByChain: {
          [chainA]: 'succeeded',
        },
        errorByChain: {},
        lastUpdatedAt: 1,
        polling: { isRunning: false, intervalMs: 30_000 },
      },
    } as any;

    expect(selectCoinPrice(chainA, '0xABC')(state)?.price).toBe(99);
    expect(selectCoinPrice(chainA, '')(state)).toBeUndefined();
    expect(selectCoinChainStatus(chainB)(state)).toBe('idle');
  });
});
