import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/activity');
      setLogs(res.data.logs);
    } catch (err) {
      setError('Failed to load activity logs');
    }
  };

  const getActionColor = (action) => {
    if (action.includes('created')) return '#e8f5e9';
    if (action.includes('updated')) return '#e3f2fd';
    if (action.includes('deleted')) return '#fce4ec';
    return '#f5f5f5';
  };

  const getActionEmoji = (action) => {
    if (action.includes('created')) return '✅';
    if (action.includes('updated')) return '✏️';
    if (action.includes('deleted')) return '🗑️';
    return '📌';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📜 Activity Log</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>
          ← Dashboard
        </button>
      </div>

      <p style={{ color: '#888' }}>All recent actions in your workspace</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {logs.length === 0 && (
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
          No activity yet!
        </p>
      )}

      {logs.map((log) => (
        <div key={log._id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '14px 16px',
          background: getActionColor(log.action),
          borderRadius: '8px',
          marginBottom: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>
            {getActionEmoji(log.action)}
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              {log.user?.name}
              <span style={{
                fontWeight: 'normal', color: '#555',
                margin: '0 6px'
              }}>
                {log.action}
              </span>
              <em>{log.task?.title}</em>
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#888' }}>
              🕐 {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityLog;