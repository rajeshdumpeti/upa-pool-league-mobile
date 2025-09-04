import { axiosClient } from './axiosClient';

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { access_token: string; token_type: 'bearer' };
export type MeResponse = { sub: string; email: string; scope: string };

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await axiosClient.post<LoginResponse>('/auth/login', body);
  return data;
}

export async function me(): Promise<MeResponse> {
  const { data } = await axiosClient.get<MeResponse>('/auth/me');
  return data;
}
