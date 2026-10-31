import { useState } from 'react';
import { Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/resources', label: 'Resources' },
  { to: '/my-bookings', label: 'My Bookings' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">CoSpace</Link>

        <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>

        <div className="hidden md:flex items-center gap-6">
          {links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          <Link to="/login" className="bg-white text-indigo-600 px-3 py-1 rounded">Login</Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
}