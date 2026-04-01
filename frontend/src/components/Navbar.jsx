import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Activity, LogOut, Leaf, Users, UsersRound, UserCircle2, Menu, X } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', className: 'btn-secondary' },
    { label: 'Tasks',     icon: ClipboardList,  path: '/tasks',     className: 'btn-secondary' },
    { label: 'Teams',     icon: UsersRound,      path: '/teams',     className: 'btn-secondary' },
    { label: 'Users',     icon: Users,           path: '/users',     className: 'btn-secondary' },
    { label: 'Activity',  icon: Activity,        path: '/activity',  className: 'btn-secondary' },
  ];

  return (
    <nav className="navbar">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Leaf size={26} color="white" />
        <h1>TaskFlow</h1>
      </div>

      {/* Desktop nav */}
      <div className="navbar-desktop">
        <span className="navbar-user-tag">
          <UserCircle2 size={20} color="white" className="navbar-user-icon" />
          {user.role}
        </span>
        {navItems.map(({ label, icon: Icon, path, className }) => (
          <button key={path} onClick={() => navTo(path)} className={className}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon size={15} /> {label}
          </button>
        ))}
        <button onClick={handleLogout} className="btn-danger"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LogOut size={15} /> Logout
        </button>
      </div>

      {/* Mobile: user tag + hamburger */}
      <div className="navbar-mobile-right">
        <span className="navbar-user-tag">
          <UserCircle2 size={18} color="white" className="navbar-user-icon" />
          {user.role}
        </span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger-btn"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} color="white" /> : <Menu size={22} color="white" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map(({ label, icon: Icon, path }) => (
            <button key={path} onClick={() => navTo(path)} className="mobile-menu-item">
              <Icon size={16} /> {label}
            </button>
          ))}
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-menu-item mobile-menu-danger">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
