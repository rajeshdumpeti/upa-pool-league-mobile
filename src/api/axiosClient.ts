import axios from 'axios';
import { ENV } from '../config/env';

export const axiosClient = axios.create({
  baseURL: ENV.apiBase,
  timeout: 5000,
});
