'use client';

import React from 'react';
import LandingPage from './Home/LandingPage';
import { User } from '@/types';

export default function Home() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isLoggedIn = searchParams?.get('login') === 'true';

  const user: User | null = isLoggedIn ? {
    name: 'cdcd',
    email: 'cdcd@example.com',
    role: 'unenrolled', // or 'student'
    avatar: 'https://i.pravatar.cc/150?img=12'
  } : null;

  return (
    <main>
      <LandingPage user={user} />
    </main>
  );
}
