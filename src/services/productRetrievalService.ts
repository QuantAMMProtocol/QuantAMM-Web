import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FilterDto } from '../models';
import { GetPoolsQuery } from '../__generated__/graphql-types';
import { getCookie } from './getCookie';

const baseUrl = import.meta.env.VITE_BASE_URL;

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
