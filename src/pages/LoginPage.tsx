import React, { useState } from 'react';
import { useLogin } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.login);
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate(form, {
      onSuccess: (data) => {
        // Assume backend returns: { token, user: { id, role } }
        const role = data.user.role as 'admin' | 'user';
        setAuth(role, data.token, data.user.id);
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      },
      onError: (err: any) => {
        setError(err?.response?.data?.message || 'Login failed');
      }
    });
  };

  return (
    <div className="max-w-sm mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold text-center">Login</h1>
  {/* No role toggle needed, backend determines role */}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50"
          disabled={loginMutation.isPending}
        >{loginMutation.isPending ? 'Logging in...' : 'Login'}</button>
        {error && <p className="text-red-600 text-xs text-center">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
