import { useQuery } from '@tanstack/react-query';
import { listMyTeams, listTeamPlayers } from '~/api/teams';

export function useMyTeams() {
  return useQuery({ queryKey: ['teams', 'my'], queryFn: listMyTeams });
}
export function useTeamPlayers(teamId: number | null) {
  return useQuery({
    queryKey: ['teams', teamId, 'players'],
    queryFn: () => listTeamPlayers(teamId as number),
    enabled: !!teamId,
  });
}
