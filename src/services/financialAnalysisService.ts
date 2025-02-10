import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import {
  FinancialAnalysisRequestDto,
  FinancialAnalysisResultDto,
} from '../models';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}

export const financialAnalysisService = createApi({
  reducerPath: 'financialAnalysisService',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    runFinancialAnalysis: builder.mutation({
      query: (bodyParam: { request: FinancialAnalysisRequestDto }) => ({
        url: '/runFinancialAnalysis',
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(bodyParam.request),
      }),
      transformResponse: (
        response: string,
        meta?: FetchBaseQueryMeta
      ): FinancialAnalysisResultDto | null => {
        if (meta?.response?.status === 200 && response) {
          try {
            //It is possible for a certain product that a certain ratio cannot be calculated, instead of defaulting to 0
            //we can pass NaN so that a warning/error can be displayed for a given metric on a give product
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
