'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { Heading } from '@/components/ui/Heading';
import { Subheading } from '@/components/ui/Subheading';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                setIsLoading(false);
                return;
            }

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                    contact: formData.contact // Depending on if API uses it or not (API currently only takes email/pass, I might need to update API if I want to save name/contact in metadata)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Registration failed');
                return;
            }

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
            <Link href="/" className="absolute top-8 left-8 flex items-center text-gray-400 hover:text-[#1e40af] transition-colors text-[10px] font-black uppercase tracking-widest">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Home
            </Link>

            {/* Logo */}
            <Link href="/" className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 hover:bg-blue-100 transition-colors">
                <span className="text-xl font-black text-[#1e40af]">D</span>
            </Link>

            {/* Header */}
            <div className="text-center mb-8">
                <Heading as="h1" className="mb-2">Create Account</Heading>
                <Subheading>
                    Unlock powerful list of colleges
                </Subheading>
            </div>

            {/* Register Card */}
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8">

                {success ? (
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 text-3xl">
                            ✓
                        </div>
                        <Heading as="h2">Success!</Heading>
                        <p className="text-sm text-gray-500">
                            Account created successfully. Redirecting you to login...
                        </p>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSignup}>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-[10px] font-bold p-3 rounded-xl border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                    First Name
                                </label>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Rahul"
                                    className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Last Name
                                </label>
                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Patil"
                                    className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                Mobile Number
                            </label>
                            <Input
                                name="contact"
                                type="tel"
                                value={formData.contact}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                                className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="rahul@example.com"
                                className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                Create Password
                            </label>
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

                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                Confirm Password
                            </label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="bg-gray-50 border-gray-100 focus:bg-white text-sm py-3"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest disabled:opacity-50"
                            >
                                {isLoading ? 'Registering...' : 'Register & Unlock'}
                            </Button>
                        </div>
                    </form>
                )}


                {/* Footer Login Link */}
                <div className="mt-8 text-center">
                    <Subheading className="text-center">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-[#1e40af] hover:text-[#1e3a8a] ml-1"
                        >
                            Sign In
                        </Link>
                    </Subheading>
                </div>

            </div>
        </div>
    );
}
