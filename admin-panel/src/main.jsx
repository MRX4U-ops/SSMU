import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  const [user, setUser] = useState(null);
  return user ? <AdminDashboardPage /> : <AdminLoginPage onLoggedIn={setUser} />;
}

createRoot(document.getElementById('root')).render(<App />);
