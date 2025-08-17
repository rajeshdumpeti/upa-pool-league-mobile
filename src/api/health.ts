// src/api/health.ts
import { axiosClient } from './axiosClient';

export type HealthResponse = {
  ok: boolean;
  service: string;
  check: string;
};

export async function getHealth(): Promise<HealthResponse> {
  const res = await axiosClient.get<HealthResponse>('/health/live');
  return res.data;
}
