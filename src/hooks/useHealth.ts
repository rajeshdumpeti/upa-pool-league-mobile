// src/hooks/useHealth.ts
import { useQuery } from '@tanstack/react-query';
import { getHealth } from '~/api/health';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 30_000,
    retry: 1,
  });
}
