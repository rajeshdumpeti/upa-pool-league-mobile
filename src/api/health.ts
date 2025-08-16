import { axiosClient } from './axiosClient';

export async function pingLive() {
  const res = await axiosClient.get('/health/live');
  return res.data;
}
