import { useQuery } from '@tanstack/react-query';
import { listMyTeams, listTeamPlayers, TeamOut, PlayerOut } from '~/api/teams';

export function useMyTeams() {
  return useQuery({
    queryKey: ['teams', 'my'],
    queryFn: listMyTeams,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTeamRoster(teamId?: number) {
  return useQuery({
    queryKey: ['teams', teamId, 'players'],
    queryFn: () => listTeamPlayers(teamId!),
    enabled: !!teamId,
    staleTime: 60 * 1000,
  });
}

// small convenience helpers
export type TeamPick = { id: number; name: string } | null;
export type PlayerPick = { id: number; name: string; skill?: number | null };
