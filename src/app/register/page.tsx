'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Heading } from '../../components/ui/Heading';
import { Subheading } from '../../components/ui/Subheading';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            {/* Logo */}
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <span className="text-xl font-black text-[#1e40af]">D</span>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <Heading as="h1" className="mb-2">Create Account</Heading>
                <Subheading>
                    Unlock powerful list of colleges
                </Subheading>
            </div>

            {/* Register Card */}
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8">

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                First Name
                            </label>
                            <Input
                                placeholder="Rahul"
                                className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                Last Name
                            </label>
                            <Input
                                placeholder="Patil"
                                className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Mobile Number
                        </label>
                        <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Email Address
                        </label>
                        <Input
                            type="email"
                            placeholder="rahul@example.com"
                            className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Create Password
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                        />
                    </div>

                    <div className="pt-2">
                        <Link href="/?login=true" className="block w-full">
                            <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest">
                                Register & Unlock
                            </Button>
                        </Link>
                    </div>
                </form>

                {/* Footer Login Link */}
                <div className="mt-8 text-center">
                    <Subheading className="text-center">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#1e40af] hover:text-[#1e3a8a] ml-1 normal-case tracking-normal">
                            Sign In
                        </Link>
                    </Subheading>
                </div>

            </div>
        </div>
    );
}
