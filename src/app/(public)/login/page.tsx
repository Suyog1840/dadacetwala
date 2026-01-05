'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      {/* Logo */}
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
        <span className="text-xl font-black text-[#1e40af]">D</span>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-[#020617] mb-2 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Login to your counseling portal
        </p>
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

        <form className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Username or Email
            </label>
            <Input
              placeholder="e.g. rahul_cet"
              className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
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
                type="password"
                placeholder="••••••••"
                className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Enter OTP
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="123456"
                  className="bg-gray-50 border-gray-100 focus:bg-white text-center tracking-[0.5em] font-bold text-lg py-3"
                />
                <Button variant="outline" className="text-[10px] px-4">
                  Send
                </Button>
              </div>
            </div>
          )}

          {/* Sign In Button */}
          <div className="pt-2">
            <Link href="/?login=true" className="block w-full">
              <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest">
                Sign In
              </Button>
            </Link>
          </div>
        </form>

        {/* Footer Register Link */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#1e40af] hover:text-[#1e3a8a] ml-1">
              Register Now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
