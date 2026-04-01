import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowLeft } from 'lucide-react';
import API from '../api/axios';

function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [teamId, setTeamId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [errors, setErrors]           = useState({});
  const [touched, setTouched]         = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess]         = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const validate = (t, tid, aTo, dl) => {
    const errs = {};
    if (!t.trim())          errs.title      = 'Task title is required';
    else if (t.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    if (!tid)               errs.teamId     = 'Please select a team';
    if (!aTo)               errs.assignedTo = 'Please assign to a member';
    if (dl) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(dl) < today) errs.deadline = 'Deadline cannot be in the past';
    }
    return errs;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(title, teamId, assignedTo, deadline));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await API.get('/teams');
      setTeams(res.data.teams);
    } catch (err) {
      setError('Failed to load teams');
    }
  };

  const handleTeamChange = async (selectedTeamId) => {
    setTeamId(selectedTeamId);
    setAssignedTo('');
    if (!selectedTeamId) { setMembers([]); return; }
    try {
      const res = await API.get(`/teams/${selectedTeamId}/members`);
      setMembers(res.data.members);
    } catch (err) {
      setError('Failed to load members');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, teamId: true, assignedTo: true, deadline: true });
    const errs = validate(title, teamId, assignedTo, deadline);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setLoading(true);
      setServerError('');
      await API.post('/tasks', {
        title,
        description,
        priority,
        deadline: deadline || undefined,
        teamId: teamId,
        assignedTo
      });
      setSuccess('Task created successfully!');
      setTimeout(() => navigate('/tasks'), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <button
        onClick={() => navigate('/tasks')}
        className="btn-secondary"
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Task Board
      </button>

      <div className="card" style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2e7d32, #43a047)',
            borderRadius: '50%', width: '60px', height: '60px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <ClipboardList size={28} color="white" />
          </div>
          <h2 style={{ color: '#2e7d32' }}>Create New Task</h2>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Fill in the details below</p>
        </div>

        {serverError && (
          <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {serverError}
          </p>
        )}
        {success && (
          <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontWeight: '600' }}>
            ✓ {success}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); if (touched.title) setErrors(validate(e.target.value, teamId, assignedTo, deadline)); }}
              onBlur={() => handleBlur('title')}
              placeholder="e.g. Build login page"
              style={{ width: '100%', borderColor: touched.title && errors.title ? '#e53935' : undefined }}
            />
            {touched.title && errors.title && (
              <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what needs to be done..."
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Priority */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>
              Priority *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          {/* Deadline */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>Deadline (optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={e => { setDeadline(e.target.value); if (touched.deadline) setErrors(validate(title, teamId, assignedTo, e.target.value)); }}
              onBlur={() => handleBlur('deadline')}
              style={{ width: '100%', borderColor: touched.deadline && errors.deadline ? '#e53935' : undefined }}
            />
            {touched.deadline && errors.deadline && (
              <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors.deadline}</p>
            )}
          </div>

          {/* Team */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>Team *</label>
            <select
              value={teamId}
              onChange={e => { handleTeamChange(e.target.value); if (touched.teamId) setErrors(validate(title, e.target.value, assignedTo, deadline)); }}
              onBlur={() => handleBlur('teamId')}
              style={{ width: '100%', borderColor: touched.teamId && errors.teamId ? '#e53935' : undefined }}
            >
              <option value="">-- Select a team --</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            {touched.teamId && errors.teamId && (
              <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors.teamId}</p>
            )}
          </div>

          {/* Assign To */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>Assign To *</label>
            <select
              value={assignedTo}
              onChange={e => { setAssignedTo(e.target.value); if (touched.assignedTo) setErrors(validate(title, teamId, e.target.value, deadline)); }}
              onBlur={() => handleBlur('assignedTo')}
              style={{ width: '100%', borderColor: touched.assignedTo && errors.assignedTo ? '#e53935' : undefined }}
              disabled={!teamId}
            >
              <option value="">-- Select a member --</option>
              {members.map((m) => (
                <option key={m._id} value={m.user._id}>{m.user.name} ({m.user.email})</option>
              ))}
            </select>
            {!teamId && <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '4px' }}>Select a team first to see members</p>}
            {touched.assignedTo && errors.assignedTo && (
              <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors.assignedTo}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;