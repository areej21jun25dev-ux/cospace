import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Building2, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
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
    setMenu(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <Building2 size={24} /> CoSpace
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>{l.label}</NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu(!menu)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="text-sm font-medium">{user.name}</span>
              </button>
              {menu && (
                <div className="fade-up absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs capitalize text-indigo-700">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Login</Link>
              <Link to="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">Sign up</Link>
            </>
          )}
        </div>

        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <button onClick={handleLogout} className="px-3 py-2 text-left text-sm text-red-600">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}