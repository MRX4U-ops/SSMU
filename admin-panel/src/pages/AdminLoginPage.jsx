import React, { useState } from 'react';
import { api, setToken } from '../services/api';

export default function AdminLoginPage({ onLoggedIn }) {
  const [email, setEmail] = useState('admin@ssmu.edu');

  const login = async () => {
    const { data } = await api.post('/auth/google-login', { email, name: 'Admin User', google_id: 'admin-google-id' });
    setToken(data.token);
    onLoggedIn(data.user);
  };

  return <div><h2>Admin Login</h2><input value={email} onChange={(e) => setEmail(e.target.value)} /><button onClick={login}>Login</button></div>;
}
