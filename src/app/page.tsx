'use client';

import React, { useEffect, useState } from 'react';
import LandingPage from './Home/LandingPage';
import { User } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: dbUser } = await supabase
          .from('User')
          .select('userName, role')
          .eq('id', authUser.id)
          .single();

        setUser({
          name: dbUser?.userName || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          role: (dbUser?.role as any) || 'student'
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN' && session) {
        checkUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getDashboardLink = () => {
    const role = user?.role as string;
    if (role === 'admin' || role === 'super_admin') {
      return '/admin/dashboard';
    }
    return '/student/dashboard';
  };

  return (
    <main>
      {/* Logged-in User Banner */}
      {!isLoading && user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Welcome back, <span className="text-blue-600">{user.name}</span>! 👋
                  </p>
                  <p className="text-xs text-gray-600">You're already logged in</p>
                </div>
              </div>
              <Link
                href={getDashboardLink()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Go to Dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      <LandingPage user={user} />
    </main>
  );
}
