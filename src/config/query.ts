import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // sensible defaults for mobile
      staleTime: 30_000, // 30s; avoid refetching on every focus
      gcTime: 1000 * 60 * 5, // 5 minutes in milliseconds
      refetchOnReconnect: true,
      refetchOnWindowFocus: false, // not a web app
    },
    mutations: {
      retry: 0,
    },
  },
});
