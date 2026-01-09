'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabaseClient';
import { Heading } from '@/components/ui/Heading';
import { Subheading } from '@/components/ui/Subheading';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      if (activeTab === 'password') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.identifier,
          password: formData.password,
        });

        if (error) {
          alert(`Login failed: ${error.message}`);
          return;
        }

        if (data.user) {
          // Check role from User table
          const { data: dbUser, error: dbError } = await supabase
            .from('User')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (dbError) {
            console.error('Error fetching user profile:', dbError);
          }

          if (dbUser?.role === 'admin' || dbUser?.role === 'super_admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/student/dashboard');
          }
        }
      } else {
        alert('OTP login is not fully implemented yet. Please use password login.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      {/* Logo */}
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
        <span className="text-xl font-black text-[#1e40af]">D</span>
      </div>

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

        {/* Tabs */}
        <div className="flex items-center mb-8 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'password'
              ? 'text-[#1e40af] border-b-2 border-[#1e40af]'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab('otp')}
            className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'otp'
              ? 'text-[#1e40af] border-b-2 border-[#1e40af]'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Email OTP
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Username */}
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <Input
              name="identifier"
              type="email"
              value={formData.identifier}
              onChange={handleInputChange}
              placeholder="e.g. rahul@example.com"
              className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
              required
            />
          </div>

          {/* Password / OTP Input */}
          {activeTab === 'password' ? (
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
          ) : (
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Enter OTP
              </label>
              <div className="flex gap-2">
                <Input
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="123456"
                  className="bg-gray-50 border-gray-100 focus:bg-white text-center tracking-[0.5em] font-bold text-lg py-3"
                />
                <Button variant="outline" className="text-[10px] px-4" type="button">
                  Send
                </Button>
              </div>
            </div>
          )}

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
