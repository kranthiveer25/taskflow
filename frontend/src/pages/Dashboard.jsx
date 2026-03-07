import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      navigate('/');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Team leaders and admins see admin dashboard
      const isAdmin = user.role === 'admin' || user.role === 'teamleader';
      const endpoint = isAdmin ? '/dashboard/admin' : '/dashboard/user';
      const res = await API.get(endpoint);
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user.name}! 👋</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>Logout</button>
      </div>

      <p>Role: <strong>{user.role}</strong></p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Your Stats</h3>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', minWidth: '150px' }}>
          <h4>Total Tasks</h4>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalTasks}</p>
        </div>
        <div style={{ padding: '20px', background: '#fff9c4', borderRadius: '8px', minWidth: '150px' }}>
          <h4>Pending</h4>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.pendingTasks}</p>
        </div>
        <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px', minWidth: '150px' }}>
          <h4>Completed</h4>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.completedTasks}</p>
        </div>
        <div style={{ padding: '20px', background: '#fce4ec', borderRadius: '8px', minWidth: '150px' }}>
          <h4>In Progress</h4>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.inProgressTasks}</p>
        </div>
        {(user.role === 'admin' || user.role === 'teamleader') && (
          <>
            <div style={{ padding: '20px', background: '#f3e5f5', borderRadius: '8px', minWidth: '150px' }}>
              <h4>Total Users</h4>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalUsers}</p>
            </div>
            <div style={{ padding: '20px', background: '#e0f7fa', borderRadius: '8px', minWidth: '150px' }}>
              <h4>Total Teams</h4>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalTeams}</p>
            </div>
          </>
        )}
      </div>

      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Recent Activity</h3>
          {stats.recentActivity.map((log) => (
            <div key={log._id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <strong>{log.user?.name}</strong> → {log.action} →{' '}
              <em>{log.task?.title}</em>
              <span style={{ float: 'right', color: '#888', fontSize: '0.85rem' }}>
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;