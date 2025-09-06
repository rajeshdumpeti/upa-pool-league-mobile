import { axiosClient } from './axiosClient';

export type Team = { id: number; name: string };
export type Player = { id: number; name: string; skill?: number | null };

export async function listMyTeams(): Promise<Team[]> {
  const { data } = await axiosClient.get<Team[]>('/teams/my');
  return data;
}
export async function listTeamPlayers(teamId: number): Promise<Player[]> {
  const { data } = await axiosClient.get<Player[]>(`/teams/${teamId}/players`);
  return data;
}
