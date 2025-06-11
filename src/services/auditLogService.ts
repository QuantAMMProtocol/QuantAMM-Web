import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

interface AuditLogInfo{
  timestamp: string;
  user: string;
  page: string;
  isMobile?: boolean;
  tosAgreement: string;
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}

export const auditLogService = createApi({
  reducerPath: 'auditLogService',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    runAuditLog: builder.mutation({
      query: (bodyParam: { request: AuditLogInfo }) => ({
        url: '/runAuditLog',
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'ROBODEX-X-CSRF-TOKEN': getCookie('csrf_access_token'),
        },
        body: JSON.stringify(bodyParam.request),
      }),
    }),
  }),
});

export const { useRunAuditLogMutation } = auditLogService;
