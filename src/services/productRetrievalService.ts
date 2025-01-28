import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FilterDto } from '../models';
import { GetPoolsQuery } from '../__generated__/graphql-types';

const baseUrl = import.meta.env.VITE_BASE_URL;

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}

export const productRetrievalService = createApi({
  reducerPath: 'productRetrievalService',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    retrieveProducts: builder.query<GetPoolsQuery, void>({
      query: () => ({
        url: '/products',
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
      }),
    }),
  }),
});

export const { useRetrieveProductsQuery } = productRetrievalService;

export const filtersRetrievalService = createApi({
  reducerPath: 'filtersRetrievalService',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    retrieveFilters: builder.query<FilterDto, void>({
      query: () => ({
        url: '/filters',
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
      }),
    }),
  }),
});

export const { useRetrieveFiltersQuery } = filtersRetrievalService;
