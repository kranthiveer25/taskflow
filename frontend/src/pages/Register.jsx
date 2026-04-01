import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, User, Mail, Lock, Shield } from 'lucide-react';
import API from '../api/axios';

const validate = ({ name, email, password }) => {
  const errors = {};
  if (!name.trim())                                          errors.name     = 'Name is required';
  else if (name.trim().length < 2)                           errors.name     = 'Name must be at least 2 characters';
  if (!email.trim())                                         errors.email    = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))       errors.email    = 'Enter a valid email address';
  if (!password)                                             errors.password = 'Password is required';
  else if (password.length < 6)                              errors.password = 'Password must be at least 6 characters';
  return errors;
};

const Field = ({ name, label, type, Icon, placeholder, form, errors, touched, handleChange, handleBlur }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <Icon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
      <input
        type={type}
        value={form[name]}
        onChange={e => handleChange(name, e.target.value)}
        onBlur={() => handleBlur(name)}
        placeholder={placeholder}
        style={{ width: '100%', paddingLeft: '36px', borderColor: touched[name] && errors[name] ? '#e53935' : undefined }}
      />
    </div>
    {touched[name] && errors[name] && (
      <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors[name]}</p>
    )}
  </div>
);

function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'member' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validate(updated));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setLoading(true);
      setServerError('');
      await API.post('/auth/register', form);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length >= 9 ? 3 : form.password.length >= 6 ? 2 : form.password.length >= 1 ? 1 : 0;
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength];
  const strengthColor = ['', '#e53935', '#ff9800', '#2e7d32'][strength];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 35%, #388e3c 65%, #66bb6a 100%)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2e7d32, #43a047)',
            borderRadius: '50%', width: '64px', height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
          }}>
            <Leaf size={32} color="white" />
          </div>
          <h2 style={{ color: '#2e7d32', fontSize: '1.6rem' }}>Create Account</h2>
          <p style={{ color: '#888', marginTop: '4px' }}>Join your TaskFlow workspace</p>
        </div>

        {serverError && (
          <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {serverError}
          </p>
        )}

        <form onSubmit={handleRegister} noValidate>
          <Field name="name"     label="Full Name" type="text"     Icon={User}  placeholder="Enter your full name"
            form={form} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
          <Field name="email"    label="Email"     type="email"    Icon={Mail}  placeholder="Enter your email"
            form={form} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
          <Field name="password" label="Password"  type="password" Icon={Lock}  placeholder="Min. 6 characters"
            form={form} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />

          {/* Password strength bar */}
          {form.password.length > 0 && (
            <div style={{ marginTop: '-8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    height: '4px', flex: 1, borderRadius: '2px',
                    background: strength >= i ? strengthColor : '#e0e0e0',
                    transition: 'background 0.3s'
                  }} />
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: strengthColor }}>{strengthLabel} password</p>
            </div>
          )}

          {/* Role */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>Role</label>
            <div style={{ position: 'relative' }}>
              <Shield size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <select
                value={form.role}
                onChange={e => handleChange('role', e.target.value)}
                style={{ width: '100%', paddingLeft: '36px' }}
              >
                <option value="member">Member</option>
                <option value="teamleader">Team Leader</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#2e7d32', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
