import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  GqlChain,
  GetCurrentPricesDocument,
  type GetCurrentPricesQuery,
} from '../../__generated__/graphql-types';
import type { RootState, AppDispatch } from '../../app/store';
import { CURRENT_LIVE_FACTSHEETS } from '../documentation/factSheets/liveFactsheets';

export const COIN_PRICE_CHAINS: GqlChain[] = Array.from(
  new Set(
    CURRENT_LIVE_FACTSHEETS.factsheets.map((f) => f.poolChain as GqlChain)
  )
);

export interface CoinPriceEntry {
  address: string;
  price: number;
  updatedAt: number;
}

export interface CoinCurrentPriceState {
  byChain: Partial<Record<GqlChain, Record<string, CoinPriceEntry>>>;
  statusByChain: Partial<
    Record<GqlChain, 'idle' | 'loading' | 'succeeded' | 'failed'>
  >;
  errorByChain: Partial<Record<GqlChain, string | null>>;
  lastUpdatedAt: number | null;
  polling: { isRunning: boolean; intervalMs: number };
}

export const COIN_CURRENT_PRICE_SLICE_KEY = 'coinCurrentPrices';

const toLower = (s: string) => s?.toLowerCase?.() ?? '';

let _coinPricePollTimer: ReturnType<typeof setInterval> | null = null;

const makeInitialByChain = (): CoinCurrentPriceState['byChain'] =>
  COIN_PRICE_CHAINS.reduce(
    (acc, c) => {
      acc[c] = {};
      return acc;
    },
    {} as CoinCurrentPriceState['byChain']
  );

const makeInitialStatus = (): CoinCurrentPriceState['statusByChain'] =>
  COIN_PRICE_CHAINS.reduce(
    (acc, c) => {
      acc[c] = 'idle';
      return acc;
    },
    {} as CoinCurrentPriceState['statusByChain']
  );

const makeInitialErrors = (): CoinCurrentPriceState['errorByChain'] =>
  COIN_PRICE_CHAINS.reduce(
    (acc, c) => {
      acc[c] = null;
      return acc;
    },
    {} as CoinCurrentPriceState['errorByChain']
  );

const initialState: CoinCurrentPriceState = {
  byChain: makeInitialByChain(),
  statusByChain: makeInitialStatus(),
  errorByChain: makeInitialErrors(),
  lastUpdatedAt: null,
  polling: { isRunning: false, intervalMs: 30_000 },
};

export const fetchCoinCurrentPrices = createAsyncThunk<
  {
    perChain: Record<GqlChain, Record<string, CoinPriceEntry>>;
    fetchedAt: number;
  },
  { client: ApolloClient<NormalizedCacheObject>; chains?: GqlChain[] }
>('coinCurrentPrices/fetch', async ({ client, chains }) => {
  const usedChains = (
    chains && chains.length > 0 ? chains : COIN_PRICE_CHAINS
  ).slice();
  const fetchedAt = Date.now();
  const results = await Promise.all(
    usedChains.map(async (chain) => {
      const { data } = await client.query<GetCurrentPricesQuery>({
        query: GetCurrentPricesDocument,
        variables: { chains: [chain] },
        fetchPolicy: 'network-only',
      });

      const items = data?.tokenGetCurrentPrices ?? [];
      const mapForChain: Record<string, CoinPriceEntry> = {};

      for (const item of items) {
        const addrLower = toLower(item?.address ?? '');
        if (!addrLower) continue;
        mapForChain[addrLower] = {
          address: item.address,
          price: Number(item.price),
          updatedAt: fetchedAt,
        };
      }

      return { chain, mapForChain };
    })
  );

  const perChain: Record<GqlChain, Record<string, CoinPriceEntry>> = {} as Record<
    GqlChain,
    Record<string, CoinPriceEntry>
  >;
  for (const { chain, mapForChain } of results) {
    perChain[chain] = mapForChain;
  }

  return { perChain, fetchedAt };
});

const slice = createSlice({
  name: COIN_CURRENT_PRICE_SLICE_KEY,
  initialState,
  reducers: {
    setCoinPriceChains(state, action: PayloadAction<GqlChain[]>) {
      const newChains = action.payload ?? [];

      const nextByChain: CoinCurrentPriceState['byChain'] = {};
      const nextStatus: CoinCurrentPriceState['statusByChain'] = {};
      const nextErrors: CoinCurrentPriceState['errorByChain'] = {};

      newChains.forEach((c) => {
        nextByChain[c] = state.byChain?.[c] ?? {};
        nextStatus[c] = state.statusByChain?.[c] ?? 'idle';
        nextErrors[c] = state.errorByChain?.[c] ?? null;
      });

      state.byChain = nextByChain;
      state.statusByChain = nextStatus;
      state.errorByChain = nextErrors;
    },
    setPollingState(
      state,
      action: PayloadAction<{ isRunning: boolean; intervalMs?: number }>
    ) {
      state.polling.isRunning = !!action.payload?.isRunning;
      if (typeof action.payload?.intervalMs === 'number') {
        state.polling.intervalMs = action.payload.intervalMs;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoinCurrentPrices.pending, (state, action) => {
        const chains =
          action.meta.arg.chains && action.meta.arg.chains.length > 0
            ? action.meta.arg.chains
            : COIN_PRICE_CHAINS;
        chains.forEach((c) => {
          state.statusByChain[c] = 'loading';
        });
      })
      .addCase(fetchCoinCurrentPrices.fulfilled, (state, action) => {
        const { perChain, fetchedAt } = action.payload;
        (Object.keys(perChain) as GqlChain[]).forEach((chain) => {
          const map = perChain?.[chain] ?? {};
          state.byChain[chain] = { ...(state.byChain?.[chain] ?? {}), ...map };
          state.statusByChain[chain] = 'succeeded';
          state.errorByChain[chain] = null;
        });
        state.lastUpdatedAt = fetchedAt;
      })
      .addCase(fetchCoinCurrentPrices.rejected, (state, action) => {
        const chains =
          action.meta.arg.chains && action.meta.arg.chains.length > 0
            ? action.meta.arg.chains
            : COIN_PRICE_CHAINS;
        chains.forEach((c) => {
          state.statusByChain[c] = 'failed';
          state.errorByChain[c] =
            action.error?.message ?? 'Failed to fetch current prices';
        });
      });
  },
});

export const startCoinCurrentPricesPolling =
  (
    client: ApolloClient<NormalizedCacheObject>,
    intervalMs = 30_000,
    chains?: GqlChain[]
  ) =>
  (dispatch: AppDispatch): void => {
    if (_coinPricePollTimer) {
      clearInterval(_coinPricePollTimer);
      _coinPricePollTimer = null;
    }

    dispatch(setPollingState({ isRunning: true, intervalMs }));

    const tick = (): void => {
      void dispatch(fetchCoinCurrentPrices({ client, chains }));
    };

    tick();
    _coinPricePollTimer = setInterval(tick, intervalMs);
  };

export const stopCoinCurrentPricesPolling =
  () =>
  (dispatch: AppDispatch): void => {
    if (_coinPricePollTimer) {
      clearInterval(_coinPricePollTimer);
      _coinPricePollTimer = null;
    }
    dispatch(setPollingState({ isRunning: false }));
  };

export const selectCoinCurrentPricesState = (
  state: RootState
): CoinCurrentPriceState | null => state.currentPrices ?? null;

export const selectCoinPollingInfo = (
  state: RootState
): CoinCurrentPriceState['polling'] =>
  state.currentPrices.polling ?? { isRunning: false, intervalMs: 30_000 };

export const selectCoinLastUpdatedAt = (state: RootState): number | null =>
  state.currentPrices.lastUpdatedAt ?? null;

export const selectCoinChainStatus =
  (chain: GqlChain) =>
  (state: RootState): 'idle' | 'loading' | 'succeeded' | 'failed' =>
    state.currentPrices.statusByChain?.[chain] ?? 'idle';

export const selectCoinChainError =
  (chain: GqlChain) =>
  (state: RootState): string | null =>
    state.currentPrices.errorByChain?.[chain] ?? null;

export const selectCoinPricesForChain =
  (chain: GqlChain) =>
  (state: RootState): Record<string, CoinPriceEntry> =>
    state.currentPrices.byChain?.[chain] ?? {};

export const selectCoinPrice =
  (chain: GqlChain, address: string) =>
  (state: RootState): CoinPriceEntry | undefined => {
    const lower = toLower(address);
    if (!lower) return undefined;
    return state.currentPrices.byChain?.[chain]?.[lower];
  };

export const { setCoinPriceChains, setPollingState } = slice.actions;
export default slice.reducer;
