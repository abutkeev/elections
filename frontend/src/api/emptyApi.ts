import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from '@/store';

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: headers => {
      const token = store.getState().auth.token;
      const { instanceId } = store.getState().websocket;
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
        headers.append('X-Instance-Id', instanceId);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
