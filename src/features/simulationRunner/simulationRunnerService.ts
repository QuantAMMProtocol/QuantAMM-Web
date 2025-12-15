import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  SimulationRunDto,
  SimulationResult,
  TrainingDto,
} from './simulationRunnerDtos';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}

export const simulationRunnerService = createApi({
  reducerPath: 'simulationRunnerService',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    runSimulation: builder.mutation({
      query: (bodyParam: {
        url: string;
        simulationRunDto: SimulationRunDto;
      }) => ({
        url: '/' + bodyParam.url,
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(bodyParam.simulationRunDto),
      }),
      transformResponse: (response: string): SimulationResult => {
        const sanitizedResponse = response.replace(/:\s*NaN/g, ': null');
        console.log(sanitizedResponse);
        console.log('Sanitized Response:', JSON.parse(sanitizedResponse));
        console.log(JSON.parse(sanitizedResponse) as SimulationResult);
        return JSON.parse(sanitizedResponse);
      },
    }),
    runTraining: builder.mutation({
      query: (bodyParam: { url: string; trainingDto: TrainingDto }) => ({
        url: '/' + bodyParam.url,
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(bodyParam.trainingDto),
      }),
      transformResponse: (response: string): string => {
        return JSON.parse(response);
      },
    }),
    retrieveTraining: builder.mutation({
      query: (bodyParam: { url: string; trainingDto: TrainingDto }) => ({
        url: '/' + bodyParam.url,
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(bodyParam.trainingDto),
      }),
      transformResponse: (response: string): string => {
        return JSON.parse(response);
      },
    }),
  }),
});

export const { useRunSimulationMutation } = simulationRunnerService;
export const { useRunTrainingMutation } = simulationRunnerService;
