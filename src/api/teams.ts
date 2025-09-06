import { axiosClient } from './axiosClient';

export type TeamOut = { id: number; name: string };
export type PlayerOut = { id: number; name: string; skill?: number | null };

export async function listMyTeams(): Promise<TeamOut[]> {
  const { data } = await axiosClient.get<TeamOut[]>('/teams/my');
  return data;
}

export async function listTeamPlayers(teamId: number): Promise<PlayerOut[]> {
  const { data } = await axiosClient.get<PlayerOut[]>(`/teams/${teamId}/players`);
  return data;
}
