// src/api/axiosClient.ts
import axios from 'axios';
import { ENV } from '../config/env';

export const axiosClient = axios.create({
  baseURL: ENV.apiBase,
  timeout: 8000,
});
