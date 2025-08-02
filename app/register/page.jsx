'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
    } else {
      setSuccess('✅ Registered! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    }
  };

  return (
    <main className="login-container">
      <h1 className="login-title">Register New Account</h1>
      <form className="login-form" onSubmit={handleRegister}>
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

        <button type="submit" className="login-btn">Register</button>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </form>
    </main>
  );
}
