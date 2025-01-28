import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoadUpdateRuleTrainingFilterDto } from './documentationSlice';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}

export const DocumentationService = createApi({
  reducerPath: 'documentationService',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    loadUpdateRuleTrainingData: builder.mutation({
      query: (bodyParam: LoadUpdateRuleTrainingFilterDto) => ({
        url: '/loadUpdateRuleTrainingData',
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(bodyParam),
      }),
    }),
  }),
});

export const { useLoadUpdateRuleTrainingDataMutation } = DocumentationService;
