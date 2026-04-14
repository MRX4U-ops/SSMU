import axios from 'axios';

export const api = axios.create({ baseURL: 'http://10.0.2.2:4000' });

export function setToken(token) {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
}
