import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from './getCookie';

interface AuditLogInfo {
  timestamp: string;
  user: string;
  page: string;
  isMobile?: boolean;
  tosAgreement: string;
}

interface RunAuditLogParams {
  request: AuditLogInfo;
}

export const auditLogService = createApi({
  reducerPath: 'auditLogService',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    runAuditLog: builder.mutation<unknown, RunAuditLogParams>({
      query: ({ request }) => ({
        url: '/runAuditLog',
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(request),
      }),
    }),
  }),
});

export const { useRunAuditLogMutation } = auditLogService;
