import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Activity, LogOut, Leaf, Users, UsersRound, UserCircle2 } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Leaf size={26} color="white" />
        <h1>TaskFlow</h1>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span className="navbar-user-tag">
          <UserCircle2 size={20} color="white" className="navbar-user-icon" />
          {user.role}
        </span>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <LayoutDashboard size={15} /> Dashboard
        </button>
        <button
          onClick={() => navigate('/tasks')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ClipboardList size={15} /> Tasks
        </button>
        <button
          onClick={() => navigate('/teams')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <UsersRound size={15} /> Teams
        </button>
        <button
          onClick={() => navigate('/users')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Users size={15} /> Users
        </button>
        <button
          onClick={() => navigate('/activity')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Activity size={15} /> Activity
        </button>
        <button
          onClick={handleLogout}
          className="btn-danger"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;