import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import API from '../api/axios';

function CreateTeam() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Team name is required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await API.post('/teams', { name, description });
      setSuccess('Team created successfully!');
      setTimeout(() => navigate('/teams'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <button
        onClick={() => navigate('/teams')}
        className="btn-secondary"
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Teams
      </button>

      <div className="card" style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2e7d32, #43a047)',
            borderRadius: '50%', width: '60px', height: '60px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Users size={28} color="white" />
          </div>
          <h2 style={{ color: '#2e7d32' }}>Create New Team</h2>
          <p style={{ color: '#888', marginTop: '4px', fontSize: '0.9rem' }}>
            You will be automatically assigned as team leader
          </p>
        </div>

        {error && (
          <p style={{
            background: '#ffebee', color: '#c62828', padding: '10px',
            borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem'
          }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{
            background: '#e8f5e9', color: '#2e7d32', padding: '10px',
            borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            ✓ {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>
              Team Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dev Team, Design Squad..."
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this team work on?"
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', fontSize: '1rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTeam;