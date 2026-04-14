import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => { api.get('/admin/analytics').then((r) => setAnalytics(r.data)); }, []);

  const createCourse = async () => {
    const title = prompt('Course title');
    if (title) await api.post('/admin/course', { title });
  };

  const upload = async (event) => {
    const form = new FormData();
    form.append('file', event.target.files[0]);
    await api.post('/admin/upload', form);
    alert('Uploaded for preview');
  };

  return (
    <div>
      <h1>SSMU MCQs Admin</h1>
      <button onClick={createCourse}>Add Course</button>
      <input type="file" accept=".pdf,.doc,.docx" onChange={upload} />
      <pre>{JSON.stringify(analytics, null, 2)}</pre>
    </div>
  );
}
