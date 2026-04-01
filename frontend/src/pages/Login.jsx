import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Mail, Lock } from 'lucide-react';
import API from '../api/axios';

function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, []);

  const validate = (em, pw) => {
    const errs = {};
    if (!em.trim())                                      errs.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))    errs.email    = 'Enter a valid email address';
    if (!pw)                                             errs.password = 'Password is required';
    else if (pw.length < 6)                              errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(email, password));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(email, password);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setLoading(true);
      setServerError('');
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 35%, #388e3c 65%, #66bb6a 100%)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2e7d32, #43a047)',
            borderRadius: '50%', width: '64px', height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Leaf size={32} color="white" />
          </div>
          <h2 style={{ color: '#2e7d32', fontSize: '1.6rem' }}>TaskFlow</h2>
          <p style={{ color: '#888', marginTop: '4px' }}>Sign in to your workspace</p>
        </div>

        {serverError && (
          <p style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {serverError}
          </p>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (touched.email) setErrors(validate(e.target.value, password)); }}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                style={{ width: '100%', paddingLeft: '36px', borderColor: touched.email && errors.email ? '#e53935' : undefined }}
              />
            </div>
            {touched.email && errors.email && (
              <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors.email}</p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#444' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); if (touched.password) setErrors(validate(email, e.target.value)); }}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                style={{ width: '100%', paddingLeft: '36px', borderColor: touched.password && errors.password ? '#e53935' : undefined }}
              />
            </div>
            {touched.password && errors.password && (
              <p style={{ color: '#e53935', fontSize: '0.8rem', marginTop: '4px' }}>⚠ {errors.password}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2e7d32', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;