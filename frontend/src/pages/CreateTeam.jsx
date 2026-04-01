import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import API from '../api/axios';

function CreateTeam() {
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors]           = useState({});
  const [touched, setTouched]         = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess]         = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();

  const validate = (n, d) => {
    const errs = {};
    if (!n.trim())                 errs.name        = 'Team name is required';
    else if (n.trim().length < 2)  errs.name        = 'Team name must be at least 2 characters';
    else if (n.trim().length > 50) errs.name        = 'Team name must be under 50 characters';
    if (d.length > 200)            errs.description = 'Description must be under 200 characters';
    return errs;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(name, description));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, description: true });
    const errs = validate(name, description);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setLoading(true);
      setServerError('');
      await API.post('/teams', { name, description });
      setSuccess('Team created successfully!');
      setTimeout(() => navigate('/teams'), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create team');
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

        {serverError && (
          <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {serverError}
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

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>
              Team Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); if (touched.name) setErrors(validate(e.target.value, description)); }}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Dev Team, Design Squad..."
              style={{ width: '100%', borderColor: touched.name && errors.name ? '#e53935' : undefined }}
            />
            {touched.name && errors.name && (
              <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors.name}</p>
            )}
            <p style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '4px' }}>{name.length}/50 characters</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); if (touched.description) setErrors(validate(name, e.target.value)); }}
              onBlur={() => handleBlur('description')}
              placeholder="What does this team work on?"
              rows={3}
              style={{ width: '100%', resize: 'vertical', borderColor: touched.description && errors.description ? '#e53935' : undefined }}
            />
            {touched.description && errors.description && (
              <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors.description}</p>
            )}
            <p style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '4px' }}>{description.length}/200 characters</p>
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