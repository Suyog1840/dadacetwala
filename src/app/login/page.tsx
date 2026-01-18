'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { Heading } from '@/components/ui/Heading';
import { Subheading } from '@/components/ui/Subheading';
import { getCurrentUser } from '@/actions/user'; // Import action for role check

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    identifier: '', // email or username
    password: '',
    otp: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'password') {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password
          })
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Login failed');
          return;
        }

        if (result.success) {
          // Fetch user to check role and redirect
          // Since we just logged in via API (cookies set), we can use server action to get user
          const user = await getCurrentUser();

          if (user?.role === 'admin' || user?.role === 'super_admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/student/dashboard');
          }
          router.refresh();
        }

      } else {
        setError('OTP login is not fully implemented yet. Please use password login.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of UI is same, just rendering)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center text-gray-400 hover:text-[#1e40af] transition-colors text-[10px] font-black uppercase tracking-widest">
        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Home
      </Link>

      {/* Logo */}
      {/* Logo */}
      <Link href="/" className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 hover:bg-blue-100 transition-colors">
        <span className="text-xl font-black text-[#1e40af]">D</span>
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <Heading as="h1" className="mb-2">
          Welcome Back
        </Heading>
        <Subheading>
          Login to your counseling portal
        </Subheading>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8">



        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-[10px] font-bold p-3 rounded-xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Email Address or Username
            </label>
            <Input
              name="identifier"
              type="text"
              value={formData.identifier}
              onChange={handleInputChange}
              placeholder="Email or Username"
              className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <Link href="#" className="text-[9px] font-bold text-[#1e40af] hover:underline">
                FORGOT?
              </Link>
            </div>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
              required
            />
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Footer Register Link */}
        <div className="mt-8 text-center">
          <Subheading className="text-center">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#1e40af] hover:text-[#1e3a8a] ml-1 normal-case tracking-normal">
              Register Now
            </Link>
          </Subheading>
        </div>

      </div>
    </div>
  );
}
