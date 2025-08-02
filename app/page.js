'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
    else router.push(user.role === 'admin' ? '/admin' : '/user');
  }, [user]);

  return <p>Redirecting...</p>;
}
