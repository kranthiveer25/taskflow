import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Activity, CheckCircle, Clock, Loader, Users, UsersRound } from 'lucide-react';
import API from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const isAdmin = user.role === 'admin' || user.role === 'teamleader';
      const endpoint = isAdmin ? '/dashboard/admin' : '/dashboard/user';
      const res = await API.get(endpoint);
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard');
    }
  };

  if (!stats) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#2e7d32', fontSize: '1.1rem' }}>Loading...</p>
    </div>
  );

  return (
    <div className="page">

      {/* Header */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '24px',
        marginBottom: '24px', boxShadow: '0 4px 12px rgba(46,125,50,0.08)',
        borderLeft: '5px solid #43a047'
      }}>
        <h2 style={{ color: '#2e7d32', fontSize: '1.5rem' }}>
          Welcome back, {user.name}!
        </h2>
        <p style={{ color: '#888', marginTop: '4px' }}>
          Role: <strong style={{ color: '#43a047' }}>{user.role}</strong>
        </p>
      </div>

      {/* Nav Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/tasks')}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <ClipboardList size={16} /> Task Board
        </button>
        <button
          onClick={() => navigate('/activity')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <Activity size={16} /> Activity Log
        </button>
      </div>

      {error && (
        <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {/* Stat Cards */}
      <h3 style={{ color: '#2e7d32', marginBottom: '16px' }}>Your Stats</h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>

        <div className="stat-card">
          <ClipboardList size={24} color="#43a047" style={{ margin: '0 auto 8px' }} />
          <h4>Total Tasks</h4>
          <p>{stats.totalTasks}</p>
        </div>

        <div className="stat-card" style={{ borderTopColor: '#ff9800' }}>
          <Clock size={24} color="#ff9800" style={{ margin: '0 auto 8px' }} />
          <h4>Pending</h4>
          <p style={{ color: '#ff9800' }}>{stats.pendingTasks}</p>
        </div>

        <div className="stat-card" style={{ borderTopColor: '#1976d2' }}>
          <Loader size={24} color="#1976d2" style={{ margin: '0 auto 8px' }} />
          <h4>In Progress</h4>
          <p style={{ color: '#1976d2' }}>{stats.inProgressTasks}</p>
        </div>

        <div className="stat-card" style={{ borderTopColor: '#2e7d32' }}>
          <CheckCircle size={24} color="#2e7d32" style={{ margin: '0 auto 8px' }} />
          <h4>Completed</h4>
          <p style={{ color: '#2e7d32' }}>{stats.completedTasks}</p>
        </div>

        {(user.role === 'admin' || user.role === 'teamleader') && (
          <>
            <div className="stat-card" style={{ borderTopColor: '#9c27b0' }}>
              <Users size={24} color="#9c27b0" style={{ margin: '0 auto 8px' }} />
              <h4>Total Users</h4>
              <p style={{ color: '#9c27b0' }}>{stats.totalUsers}</p>
            </div>
            <div className="stat-card" style={{ borderTopColor: '#00acc1' }}>
              <UsersRound size={24} color="#00acc1" style={{ margin: '0 auto 8px' }} />
              <h4>Total Teams</h4>
              <p style={{ color: '#00acc1' }}>{stats.totalTeams}</p>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <div style={{
          background: 'white', borderRadius: '12px', padding: '24px',
          boxShadow: '0 4px 12px rgba(46,125,50,0.08)'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Recent Activity
          </h3>
          {stats.recentActivity.map((log) => (
            <div key={log._id} style={{
              padding: '12px', borderBottom: '1px solid #f1f8e9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span>
                <strong style={{ color: '#2e7d32' }}>{log.user?.name}</strong>
                <span style={{ color: '#888', margin: '0 6px' }}>→</span>
                {log.action}
                <span style={{ color: '#888', margin: '0 6px' }}>→</span>
                <em style={{ color: '#555' }}>{log.task?.title}</em>
              </span>
              <span style={{ color: '#aaa', fontSize: '0.8rem', whiteSpace: 'nowrap', marginLeft: '12px' }}>
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