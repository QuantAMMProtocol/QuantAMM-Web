import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CoinComparison,
  CoinPrice,
} from '../simulationRunConfiguration/simulationRunConfigModels';

export interface LoadPriceHistoryRequestDto {
  coinCode: string;
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}

export const coinPriceRetrievalService = createApi({
  reducerPath: 'coinPriceRetrievalService',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    loadHistoricDailyPrices: builder.mutation({
      query: (bodyParam: LoadPriceHistoryRequestDto) => ({
        url: '/loadHistoricDailyPrices',
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(bodyParam),
      }),
      transformResponse: (response: CoinPrice[]): CoinPrice[] => {
        return response.map((x) => {
          return {
            unix: x.unix,
            high: x.high,
            low: x.low,
            close: x.close,
            open: x.open,
            date: x.date,
          };
        });
      },
    }),
    loadCoinComparisonData: builder.mutation<Map<string, CoinComparison>, void>(
      {
        query: () => ({
          url: '/loadCoinComparisonData',
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'content-type': 'application/json',
            'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
          },
        }),
        transformResponse: (response: any[]): Map<string, CoinComparison> => {
          const result = new Map<string, CoinComparison>();
          response.forEach((x) =>
            result.set(x.coinPair, {
              covariance: x.covariance,
              trackingError: x.trackingError,
            })
          );
          return result;
        },
      }
    ),
  }),
});

export const {
  useLoadHistoricDailyPricesMutation,
  useLoadCoinComparisonDataMutation,
} = coinPriceRetrievalService;
