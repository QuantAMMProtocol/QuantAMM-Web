import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import {
  FinancialAnalysisRequestDto,
  FinancialAnalysisResultDto,
} from '../models';
import { getCookie } from './getCookie';

interface RunFinancialAnalysisParams {
  request: FinancialAnalysisRequestDto;
}

export const financialAnalysisService = createApi({
  reducerPath: 'financialAnalysisService',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    runFinancialAnalysis: builder.mutation<
      FinancialAnalysisResultDto | null,
      RunFinancialAnalysisParams
    >({
      query: ({ request }) => ({
        url: '/runFinancialAnalysis',
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(request),
      }),
      transformResponse: (
        response: string,
        meta?: FetchBaseQueryMeta
      ): FinancialAnalysisResultDto | null => {
        if (meta?.response?.status === 200 && response) {
          try {
            const sanitizedResponse = response
              .replace(/:\s*NaN/g, ': null')
              .replace(/: NaN/g, ': null')
              .replace(/NaN/g, 'null');

            return JSON.parse(sanitizedResponse) as FinancialAnalysisResultDto;
          } catch (error) {
            console.error(
              'Error parsing financial analysis result - response:',
              response
            );

            // TODO add notification
            console.error('Error parsing financial analysis result:', error);
          }
        }

        return null;
      },
    }),
  }),
});

export const { useRunFinancialAnalysisMutation } = financialAnalysisService;
