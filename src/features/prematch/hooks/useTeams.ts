import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listMyTeams, listTeamPlayers, TeamOut, PlayerOut } from '~/api/teams';

export function useMyTeams() {
  return useQuery({ queryKey: ['teams', 'my'], queryFn: listMyTeams });
}
export function useTeamPlayers(teamId: number | null) {
  const qc = useQueryClient();
  const teamsQ = useQuery({
    queryKey: ['teams', 'mine'],
    queryFn: listMyTeams,
    staleTime: 5 * 60 * 1000,
  });

  async function preloadRoster(teamId: number) {
    return qc.prefetchQuery({
      queryKey: ['teams', 'roster', teamId],
      queryFn: () => listTeamPlayers(teamId),
      staleTime: 5 * 60 * 1000,
    });
  }

  function useRoster(teamId?: number) {
    return useQuery({
      queryKey: ['teams', 'roster', teamId],
      queryFn: () => listTeamPlayers(teamId!),
      enabled: !!teamId,
      staleTime: 5 * 60 * 1000,
    });
  }

  return { teamsQ, preloadRoster, useRoster };
}
