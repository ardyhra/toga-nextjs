// pages/login.js
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Gunakan fungsi login dari AuthContext
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
        <Head><title>Login Admin</title></Head>
        <div className="login-form-container">
            <h2>Login Admin</h2>
            <p>Silakan masuk untuk mengelola data TOGA.</p>
            {error && <p className="alert-danger">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Memproses...' : 'Login'}
                </button>
            </form>
        </div>
    </div>
  );
}