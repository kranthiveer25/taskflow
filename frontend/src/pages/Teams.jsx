import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, UserPlus, Trash2 } from 'lucide-react';
import API from '../api/axios';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState({});
  const [addEmail, setAddEmail] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isLeader = user?.role === 'teamleader' || user?.role === 'admin';

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await API.get('/teams');
      setTeams(res.data.teams);
      for (const team of res.data.teams) {
        fetchMembers(team._id);
      }
    } catch (err) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (teamId) => {
    try {
      const res = await API.get(`/teams/${teamId}/members`);
      setMembers(prev => ({ ...prev, [teamId]: res.data.members }));
    } catch (err) {
      console.error('Failed to fetch members for team', teamId);
    }
  };

  const handleAddMember = async (teamId) => {
    const email = addEmail[teamId]?.trim();
    if (!email) return;
    try {
      setError('');
      setSuccess('');
      await API.post(`/teams/${teamId}/members`, { email });
      setSuccess('Member added successfully!');
      setAddEmail(prev => ({ ...prev, [teamId]: '' }));
      fetchMembers(teamId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      setError('');
      setSuccess('');
      await API.delete(`/teams/${teamId}/members/${memberId}`);
      setSuccess('Member removed successfully!');
      fetchMembers(teamId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#2e7d32' }}>Loading teams...</p>
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
          <Users size={24} color="#2e7d32" />
          <h2 style={{ color: '#2e7d32', margin: 0 }}>My Teams</h2>
        </div>
        {isLeader && (
          <button
            onClick={() => navigate('/teams/create')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Create Team
          </button>
        )}
      </div>

      {error && (
        <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontWeight: '600' }}>
          ✓ {success}
        </p>
      )}

      {/* No teams */}
      {teams.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <Users size={48} color="#ccc" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#888' }}>No teams yet</h3>
          <p style={{ color: '#aaa', marginBottom: '20px' }}>Create a team to get started</p>
          {isLeader && (
            <button
              onClick={() => navigate('/teams/create')}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Create Your First Team
            </button>
          )}
        </div>
      )}

      {/* Team Cards */}
      {teams.map((team) => (
        <div key={team._id} className="card" style={{ marginBottom: '20px' }}>

          {/* Team Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px',
            paddingBottom: '16px', borderBottom: '1px solid #f1f8e9'
          }}>
            <div>
              <h3 style={{ color: '#2e7d32', margin: 0 }}>{team.name}</h3>
              {team.description && (
                <p style={{ color: '#888', fontSize: '0.88rem', marginTop: '4px' }}>
                  {team.description}
                </p>
              )}
            </div>
            <span style={{
              background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px',
              padding: '4px 14px', fontSize: '0.82rem', fontWeight: '600'
            }}>
              {members[team._id]?.length || 0} members
            </span>
          </div>

          {/* Members List */}
          <h4 style={{ color: '#555', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Members
          </h4>
          {members[team._id]?.length > 0 ? (
            <div style={{ marginBottom: '16px' }}>
              {members[team._id].map((m) => (
                <div key={m._id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', background: '#f9fffe', borderRadius: '8px',
                  marginBottom: '6px', border: '1px solid #e8f5e9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2e7d32, #43a047)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 'bold', fontSize: '0.9rem'
                    }}>
                      {m.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem' }}>{m.user?.name}</p>
                      <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>{m.user?.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: m.role === 'teamleader' ? '#e8f5e9' : '#f5f5f5',
                      color: m.role === 'teamleader' ? '#2e7d32' : '#666',
                      padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '500'
                    }}>
                      {m.role}
                    </span>
                    {isLeader && m.role !== 'teamleader' && (
                      <button
                        onClick={() => handleRemoveMember(team._id, m._id)}
                        style={{
                          background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a',
                          borderRadius: '6px', padding: '4px 8px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem'
                        }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: '16px' }}>No members yet</p>
          )}

          {/* Add Member */}
          {isLeader && (
            <div style={{
              display: 'flex', gap: '8px', paddingTop: '12px',
              borderTop: '1px solid #f1f8e9'
            }}>
              <input
                type="email"
                placeholder="Enter member email to add..."
                value={addEmail[team._id] || ''}
                onChange={(e) => setAddEmail(prev => ({ ...prev, [team._id]: e.target.value }))}
                style={{ flex: 1 }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember(team._id)}
              />
              <button
                onClick={() => handleAddMember(team._id)}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <UserPlus size={15} /> Add Member
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Teams;