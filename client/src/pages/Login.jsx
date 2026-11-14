import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/resources');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Login to book your workspace"
      error={error}
      footer={<>New here? <Link to="/register" className="font-medium text-indigo-600">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" className="input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input type="password" className="input" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn-primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </AuthCard>
  );
}