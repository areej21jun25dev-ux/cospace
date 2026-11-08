import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [{ to: '/', label: 'Home' }];
  if (user) {
    links.push({ to: '/resources', label: 'Resources' });
    links.push({ to: '/my-bookings', label: 'My Bookings' });
  }
  if (user?.role === 'admin') links.push({ to: '/admin', label: 'Admin' });

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">CoSpace</Link>

        <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          {user ? (
            <>
              <span className="text-sm">Hi, {user.name}</span>
              <button onClick={handleLogout} className="bg-white text-indigo-600 px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-white text-indigo-600 px-3 py-1 rounded">Login</Link>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="text-left">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}