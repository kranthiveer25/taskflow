import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Activity, CheckCircle, Clock, Loader, Users, UsersRound, Globe, Heart, Lightbulb, Star, Award, BookOpen, Layers, Code2, Zap, MessageSquare, TrendingUp, ShieldCheck, UserCircle2, BarChart2 } from 'lucide-react';
import API from '../api/axios';

const quotes = [
  {
    icon: Layers,
    category: 'About the Project',
    text: 'TaskFlow is a modern, full-stack team collaboration platform — built to bring clarity, structure, and efficiency to every stage of project work.',
    color: '#2e7d32',
  },
  {
    icon: UserCircle2,
    category: 'About the Developer',
    text: 'Designed and developed by K. Kranthi Veer as part of a structured MERN stack internship — turning real-world concepts into a working product.',
    color: '#1976d2',
  },
  {
    icon: ShieldCheck,
    category: 'About the Features',
    text: 'Role-based access control, Kanban task boards, JWT authentication, and activity logging — TaskFlow covers the full lifecycle of team task management.',
    color: '#7b1fa2',
  },
  {
    icon: MessageSquare,
    category: 'About Collaboration',
    text: 'Task comments, file attachments, and real-time activity logs keep every team member aligned, accountable, and in the loop — no matter the team size.',
    color: '#00838f',
  },
  {
    icon: Zap,
    category: 'About Efficiency',
    text: 'Deadline tracking with visual overdue indicators, priority levels, and instant status updates help teams stay focused and ship work on time.',
    color: '#f57f17',
  },
  {
    icon: BarChart2,
    category: 'About Insights',
    text: 'Live dashboards give admins and team leaders instant visibility into task statistics, team performance, and individual contributions.',
    color: '#2e7d32',
  },
  {
    icon: Code2,
    category: 'About the Stack',
    text: 'Built using React, Node.js, Express, and MongoDB — TaskFlow simulates a real-world SaaS product, much like Trello or Asana, from the ground up.',
    color: '#c62828',
  },
  {
    icon: TrendingUp,
    category: 'About Growth',
    text: 'Every feature in TaskFlow — from secure auth to file uploads — was built to reflect industry-standard practices and scalable software architecture.',
    color: '#2e7d32',
  },
];

const csibCards = [
  { icon: Heart,      text: 'Built with inspiration from',   highlight: 'CSIB',                        sub: 'csib.co.in' },
  { icon: Globe,      text: 'Visit our mentors at',          highlight: 'csib.co.in',                  sub: 'Centre for Social Innovation & Business' },
  { icon: Lightbulb,  text: 'Driven by the vision of',       highlight: 'CSIB',                        sub: 'Innovation · Collaboration · Impact' },
  { icon: Star,       text: 'Special thanks to',             highlight: 'CSIB Team',                   sub: 'csib.co.in' },
  { icon: Award,      text: 'This project is dedicated to',  highlight: 'CSIB',                        sub: 'For believing in us' },
  { icon: BookOpen,   text: 'Guided & supported by',         highlight: 'csib.co.in',                  sub: 'Shaping the future, one project at a time' },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % quotes.length);
        // Fade in
        setQuoteVisible(true);
      }, 600);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
      <div style={{
        background: 'white', borderRadius: '12px', padding: '24px',
        boxShadow: '0 4px 12px rgba(46,125,50,0.08)', marginBottom: '32px'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} /> Recent Activity
        </h3>
        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          stats.recentActivity.map((log) => (
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
          ))
        ) : (
          <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', padding: '16px 0' }}>
            No recent activity yet.
          </p>
        )}
      </div>

      {/* Quotes Carousel */}
      {(() => {
        const q = quotes[quoteIndex];
        const Icon = q.icon;
        return (
          <div className="quote-carousel" style={{ opacity: quoteVisible ? 1 : 0, marginBottom: '32px' }}>
            <div className="quote-icon-wrap" style={{ background: q.color }}>
              <Icon size={22} color="white" />
            </div>
            <div className="quote-body">
              <span className="quote-category" style={{ color: q.color }}>{q.category}</span>
              <p className="quote-text">"{q.text}"</p>
              <div className="quote-dots">
                {quotes.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => { setQuoteVisible(false); setTimeout(() => { setQuoteIndex(i); setQuoteVisible(true); }, 300); }}
                    className={`quote-dot ${i === quoteIndex ? 'active' : ''}`}
                    style={{ background: i === quoteIndex ? q.color : '#d0d0d0' }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* CSIB Marquee */}
      <div>
        <h3 style={{ color: '#2e7d32', marginBottom: '14px', fontSize: '1rem' }}>
          Made possible by
        </h3>
        <div className="csib-marquee-wrapper">
          <div className="csib-marquee-track">
            {[...csibCards, ...csibCards].map((card, i) => {
              const Icon = card.icon;
              return (
                <a
                  key={i}
                  href="https://csib.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="csib-card"
                >
                  <div className="csib-card-icon">
                    <Icon size={20} color="white" />
                  </div>
                  <div>
                    <p className="csib-card-text">{card.text}</p>
                    <p className="csib-card-highlight">{card.highlight}</p>
                    <p className="csib-card-sub">{card.sub}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;