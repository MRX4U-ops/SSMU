import axios from 'axios';
export const api = axios.create({ baseURL: 'http://localhost:4000' });
export const setToken = (token) => { api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined; };
