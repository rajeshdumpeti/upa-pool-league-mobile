import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../api/matchService';

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  });
};
