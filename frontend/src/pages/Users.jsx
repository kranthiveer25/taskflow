import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, Mail, Shield } from 'lucide-react';
import API from '../api/axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      setUsers(res.data.users);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const roleColors = {
    admin: { bg: '#e8f5e9', color: '#2e7d32' },
    teamleader: { bg: '#e3f2fd', color: '#1976d2' },
    member: { bg: '#f5f5f5', color: '#555' }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#2e7d32' }}>Loading users...</p>
    </div>
  );

  return (
    <div className="page">

      {/* Header */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '20px 24px',
        marginBottom: '24px', boxShadow: '0 4px 12px rgba(46,125,50,0.08)',
        borderLeft: '5px solid #43a047',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UsersIcon size={24} color="#2e7d32" />
          <h2 style={{ color: '#2e7d32', margin: 0 }}>All Users</h2>
        </div>
        <span style={{
          background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px',
          padding: '4px 14px', fontSize: '0.85rem', fontWeight: '600'
        }}>
          {users.length} registered
        </span>
      </div>

      {error && (
        <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {/* Users List */}
      <div className="card">
        {users.map((u, index) => (
          <div key={u._id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px',
            borderBottom: index < users.length - 1 ? '1px solid #f1f8e9' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2e7d32, #43a047)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '1rem'
              }}>
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: '#222' }}>{u.name}</p>
                <p style={{ margin: '3px 0 0', color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} /> {u.email}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: roleColors[u.role]?.bg || '#f5f5f5',
                color: roleColors[u.role]?.color || '#555',
                padding: '3px 12px', borderRadius: '12px',
                fontSize: '0.8rem', fontWeight: '500',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Shield size={12} /> {u.role}
              </span>
              <span style={{ color: '#aaa', fontSize: '0.78rem' }}>
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;