'use client';

import React from 'react';
import LandingPage from './Home/LandingPage';
import { User } from '../../types';

export default function Home() {
  // Mock user for now, set to null to see login button
  const mockUser: User | null = null;

  return (
    <main>
      <LandingPage user={mockUser} />
    </main>
  );
}
