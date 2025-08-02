'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import '../globals.css';

export default function LoginPage() {
  const { data: session } = useSession();
  const { login } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user && isAdmin) {
      const email = session.user.email;
      const namePart = email?.split('@')[0];
      login({
        username: email,
        password: namePart,
        role: 'admin',
      });
      router.push('/admin');
    }
  }, [session, isAdmin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (isAdmin) {
      await signIn('github');
      return;
    }

    if (!username || !password) {
      setError('Username and password required');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      login({ username, password, role: 'user' });
      router.push('/user');
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <main className="login-container">
      <h1 className="login-title">Welcome Back</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          Login as Admin (GitHub only)
        </label>

        {!isAdmin && (
          <>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit" className="login-btn">
          {isAdmin ? 'Login with GitHub' : 'Login'}
        </button>

        {error && <p className="error-msg">{error}</p>}

        {/* ✅ Register link added here */}
        {!isAdmin && (
          <p className="text-sm mt-4">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-500 underline hover:text-blue-700">
              Register here
            </a>
          </p>
        )}
      </form>
    </main>
  );
}
