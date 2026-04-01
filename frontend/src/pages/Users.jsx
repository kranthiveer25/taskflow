import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, Mail, Shield, Search, X } from 'lucide-react';
import API from '../api/axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

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
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UsersIcon size={24} color="#2e7d32" />
            <h2 style={{ color: '#2e7d32', margin: 0 }}>All Users</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {searchQuery && (
              <span style={{
                background: '#fff3e0', color: '#e65100', borderRadius: '20px',
                padding: '4px 14px', fontSize: '0.85rem', fontWeight: '600'
              }}>
                {filteredUsers.length} of {users.length} shown
              </span>
            )}
            <span style={{
              background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px',
              padding: '4px 14px', fontSize: '0.85rem', fontWeight: '600'
            }}>
              {users.length} total
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px', paddingRight: searchQuery ? '36px' : '12px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', padding: '2px', cursor: 'pointer',
                color: '#aaa', display: 'flex', alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {/* Users List */}
      <div className="card">
        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#aaa' }}>
            <Search size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
            <p>No users match "<strong>{searchQuery}</strong>"</p>
          </div>
        )}
        {filteredUsers.map((u, index) => (
          <div key={u._id} className="user-row" style={{
            borderBottom: index < filteredUsers.length - 1 ? '1px solid #f1f8e9' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #2e7d32, #43a047)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '1rem'
              }}>
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: '600', color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                <p style={{ margin: '3px 0 0', color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Mail size={13} style={{ flexShrink: 0 }} /> {u.email}
                </p>
              </div>
            </div>
            <div className="user-row-right">
              <span style={{
                background: roleColors[u.role]?.bg || '#f5f5f5',
                color: roleColors[u.role]?.color || '#555',
                padding: '3px 12px', borderRadius: '12px',
                fontSize: '0.8rem', fontWeight: '500',
                display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
              }}>
                <Shield size={12} /> {u.role}
              </span>
              <span style={{ color: '#aaa', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
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