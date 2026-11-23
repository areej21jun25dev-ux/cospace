import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const strength = Math.min(
    4,
    (form.password.length >= 6) + (form.password.length >= 10) +
      /[A-Z]/.test(form.password) + /\d/.test(form.password)
  );
  const labels = ['', 'Weak', 'Okay', 'Good', 'Strong'];
  const colors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-lime-500', 'bg-emerald-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data);
      navigate(from || '/resources');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start booking desks and rooms today"
      error={error}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" state={{ from }} className="font-semibold text-indigo-600">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input className="input" placeholder="Areej" value={form.name} onChange={set('name')} required autoFocus />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" className="input" placeholder="you@company.com" value={form.email} onChange={set('email')} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              className="input pr-10"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={set('password')}
              required
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600" aria-label="Show or hide password">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength ? colors[strength] : 'bg-slate-200'}`} />
                ))}
              </div>
              <span className="text-xs text-slate-500">{labels[strength]}</span>
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Confirm password</label>
          <input type={show ? 'text' : 'password'} className="input" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required />
        </div>
        <button className="btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  );
}