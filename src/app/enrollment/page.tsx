'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';

// Enrollment Flow Component
function EnrollmentFlow() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const plan = searchParams.get('plan') || 'expert';
    const price = searchParams.get('price') || '4999';

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
    const [currentTempPassword, setCurrentTempPassword] = useState<string | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        academicStream: 'Engineering',
        homeUniversity: 'Mumbai University (MU)',
        gender: 'Male',
        category: 'Open', // New category field
        email: '',
        familyIncome: '',
        mhtcet: '',
        jee: '',
        neet: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = async () => {
        if (!formData.email || !formData.fullName || !formData.contactNumber) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            // 1️⃣ Create auth user with TEMP password
            // Generating a random password that meets basic complexity
            const tempPassword = `Temp@${Math.random().toString(36).slice(-8)}${Math.floor(Math.random() * 10)}`;

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: tempPassword,
            });

            if (error || !data.user) {
                console.error('Signup error:', error);
                alert(`Failed to create account: ${error?.message || 'Unknown error'}`);
                return;
            }

            const userId = data.user.id;
            setRegisteredUserId(userId);
            setCurrentTempPassword(tempPassword);

            // 2️⃣ Insert into User table (Prisma model)
            const { error: userError } = await supabase.from('User').insert({
                id: userId,
                authProviderId: userId,
                userName: formData.email.split('@')[0], // Default username
                email: formData.email,
                contact: formData.contactNumber,
                role: 'student',
                isRegistered: true,
                isEnrolled: false,
                status: 'active',
                updatedAt: new Date()
            });

            if (userError) {
                console.error('User table error:', userError);
                alert(`Failed to save user data: ${userError.message}`);
                return;
            }

            // 3️⃣ Insert StudentProfile (Prisma model)
            const { error: profileError } = await supabase.from('StudentProfile').insert({
                id: crypto.randomUUID(),
                userId: userId,
                name: formData.fullName, // Save student's full name for verification
                examType: formData.academicStream,
                category: formData.category, // Save the selected category
                homeUniversity: formData.homeUniversity,
                domicileState: 'Maharashtra',
                cetPercentile: parseFloat(formData.mhtcet) || null,
                jeePercentile: parseFloat(formData.jee) || null,
                isCounselingActive: false,
                plan: plan
            });

            if (profileError) {
                console.error('Profile error:', profileError);
                alert(`Failed to save student profile: ${profileError.message}`);
                return;
            }

            // 4️⃣ Move to payment step
            setStep(2);
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            // Use local state if session is not available
            let userId = registeredUserId;

            if (!userId) {
                const { data: sessionData } = await supabase.auth.getUser();
                userId = sessionData.user?.id || null;
            }

            if (!userId) {
                alert('User registration not found. Please try Step 1 again.');
                setStep(1);
                return;
            }

            // Mark payment success in Payment table (Prisma model)
            const { error: paymentError } = await supabase.from('Payment').insert({
                id: crypto.randomUUID(),
                userId: userId,
                amount: Number(price),
                currency: 'INR',
                paymentStatus: 'SUCCESS',
                transactionId: `TXN_${Date.now()}`,
                paidAt: new Date()
            });

            if (paymentError) {
                console.error('Payment error:', paymentError);
                alert(`Payment recording failed: ${paymentError.message}`);
                return;
            }

            // Mark user as enrolled in User table
            const { error: userUpdateError } = await supabase
                .from('User')
                .update({
                    isEnrolled: true,
                    enrolledAt: new Date(),
                    updatedAt: new Date()
                })
                .eq('id', userId);

            if (userUpdateError) {
                console.error('User update error:', userUpdateError);
                alert(`Failed to update enrollment status: ${userUpdateError.message}`);
                return;
            }

            setStep(3);
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred during payment processing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = async () => {
        if (!formData.password || formData.password !== formData.confirmPassword) {
            alert('Passwords do not match or are empty');
            return;
        }

        setIsLoading(true);

        try {
            // Ensure we have a session. If not, try to sign in with temp password
            const { data: sessionInfo } = await supabase.auth.getSession();

            if (!sessionInfo.session && currentTempPassword && formData.email) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: currentTempPassword
                });

                if (signInError) {
                    console.error('Sign-in with temp password failed:', signInError);

                    if (signInError.message.toLowerCase().includes('email not confirmed')) {
                        alert(`DadaCETWala Error: Email confirmation is enabled in your Supabase project. 
                        
To allow setting a password immediately, please go to your Supabase Dashboard -> Authentication -> Providers -> Email and DISABLE "Confirm email". 

Alternatively, check your email to confirm the account before finishing this setup.`);
                    } else {
                        alert(`Session expired. Please try to log in again or contact support: ${signInError.message}`);
                    }
                    return;
                }
            }

            // Update password from temp to user-chosen one
            const { error: authError } = await supabase.auth.updateUser({
                password: formData.password,
            });

            if (authError) {
                console.error('Password update error:', authError);
                alert(`Failed to set password: ${authError.message}`);
                return;
            }

            // Save permanent username if provided
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;

            if (userId && formData.username) {
                await supabase
                    .from('User')
                    .update({
                        userName: formData.username,
                        updatedAt: new Date()
                    })
                    .eq('id', userId);
            }

            router.push('/student/dashboard');
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred while finishing setup.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to get Plan Name
    const getPlanName = () => {
        switch (plan.toLowerCase()) {
            case 'basic': return 'Basic Access';
            case 'expert': return 'Expert Counseling';
            case 'vip': return 'VIP Direct';
            default: return plan.charAt(0).toUpperCase() + plan.slice(1);
        }
    };

    // Step Indicator Component
    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8 max-w-xl mx-auto px-4">
            {[
                { id: 1, label: 'Details' },
                { id: 2, label: 'Payment' },
                { id: 3, label: 'Account' }
            ].map((s, idx, arr) => (
                <div key={s.id} className="flex items-center">
                    <div className="flex flex-col items-center relative z-10">
                        <div className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-colors
                            ${step >= s.id
                                ? 'bg-[#1e40af] border-[#1e40af] text-white'
                                : 'bg-white border-gray-200 text-gray-300'}
                        `}>
                            {step > s.id ? (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            ) : s.id}
                        </div>
                        <span className={`
                            absolute top-9 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap
                            ${step >= s.id ? 'text-[#1e40af]' : 'text-gray-300'}
                        `}>
                            {s.label}
                        </span>
                    </div>
                    {idx < arr.length - 1 && (
                        <div className={`w-12 sm:w-24 h-0.5 mx-2 rounded transition-colors duration-300 ${step > s.id ? 'bg-[#1e40af]' : 'bg-gray-200'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    // Step 1: Student Enrollment Form
    if (step === 1) {
        return (
            <div className="max-w-3xl mx-auto">
                <StepIndicator />
                <div className="mb-2 text-left">
                    <button
                        onClick={() => router.push('/pricing')}
                        className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                    >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        Change Plan
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in relative">
                    <div className="pt-4 px-6 text-center border-b border-gray-50 pb-2">
                        <div className="inline-block px-2.5 py-0.5 bg-blue-50 text-[#1e40af] rounded-full text-[8px] font-black uppercase tracking-widest mb-1">
                            Selected Plan: {getPlanName()}
                        </div>
                        <h1 className="text-lg font-black text-[#020617] mb-0 leading-tight">
                            Student Enrollment
                        </h1>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Complete your profile to proceed
                        </p>
                    </div>

                    <div className="px-6 py-6 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Input
                                label="Student Full Name"
                                placeholder="John Doe"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Contact Number"
                                placeholder="+91 00000 00000"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Email ID"
                                type="email"
                                placeholder="student@example.com"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Select
                                label="Academic Stream"
                                name="academicStream"
                                options={[
                                    { label: 'ENGINEERING', value: 'Engineering' },
                                    { label: 'MEDICAL', value: 'Medical' },
                                    { label: 'PHARMACY', value: 'Pharmacy' },
                                ]}
                                value={formData.academicStream}
                                onChange={handleInputChange}
                                required
                            />
                            <Select
                                label="Home University"
                                name="homeUniversity"
                                options={[
                                    { label: 'MUMBAI UNIVERSITY (MU)', value: 'Mumbai University (MU)' },
                                    { label: 'PUNE UNIVERSITY (SPPU)', value: 'Pune University (SPPU)' },
                                    { label: 'NAGPUR UNIVERSITY', value: 'Nagpur University' },
                                ]}
                                value={formData.homeUniversity}
                                onChange={handleInputChange}
                                required
                            />
                            <Select
                                label="Gender"
                                name="gender"
                                options={[
                                    { label: 'MALE', value: 'Male' },
                                    { label: 'FEMALE', value: 'Female' },
                                    { label: 'OTHER', value: 'Other' },
                                ]}
                                value={formData.gender}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Dropdown
                                label="Category"
                                name="category"
                                options={[
                                    { label: 'OPEN', value: 'Open' },
                                    { label: 'NT', value: 'NT' },
                                    { label: 'VJ', value: 'VJ' },
                                    { label: 'SC', value: 'SC' },
                                    { label: 'ST', value: 'ST' },
                                    { label: 'OBC', value: 'OBC' },
                                    { label: 'SBC', value: 'SBC' },
                                    { label: 'EWS', value: 'EWS' },

                                ]}
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-1">
                                <Input
                                    label="Annual Family Income"
                                    placeholder="e.g. 500000"
                                    name="familyIncome"
                                    value={formData.familyIncome}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-1">
                            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                Score Details (Optional)
                            </h3>
                            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto md:mx-0">
                                <Input
                                    label="MHTCET %ILE"
                                    placeholder="0.00"
                                    name="mhtcet"
                                    value={formData.mhtcet}
                                    onChange={handleInputChange}
                                    className="text-center"
                                />
                                <Input
                                    label="JEE %ILE"
                                    placeholder="0.00"
                                    name="jee"
                                    value={formData.jee}
                                    onChange={handleInputChange}
                                    className="text-center"
                                />
                                <Input
                                    label="NEET SCORE"
                                    placeholder="0"
                                    name="neet"
                                    value={formData.neet}
                                    onChange={handleInputChange}
                                    className="text-center"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                fullWidth
                                size="md"
                                onClick={handleNext}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Proceed to Payment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Payment Gateway Mockup
    if (step === 2) {
        return (
            <div className="max-w-md mx-auto">
                <StepIndicator />
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in relative">
                    <div className="bg-[#1e40af] p-4 text-white text-center rounded-b-2xl relative z-10">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Payment Gateway</span>
                            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-bold text-[10px]">D</div>
                        </div>
                        <div className="text-left mb-1">
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Amount Payable</p>
                            <h2 className="text-3xl font-black">₹{price}</h2>
                        </div>
                    </div>

                    <div className="px-5 py-5">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Select Payment Method</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {['UPI', 'CARD', 'NETBANKING', 'WALLET'].map((method) => (
                                <button
                                    key={method}
                                    className={`
                                    py-2.5 rounded-lg border font-black text-[9px] uppercase tracking-wider transition-all
                                    ${method === 'UPI'
                                            ? 'border-[#1e40af] text-[#1e40af] bg-blue-50'
                                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                        }
                                `}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-bold text-gray-500">Transaction ID</span>
                                <span className="text-[10px] font-black text-[#020617]">#TXN_{Date.now().toString().slice(-8)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-500">Convenience Fee</span>
                                <span className="text-[10px] font-black text-green-500">FREE</span>
                            </div>
                        </div>

                        <Button
                            fullWidth
                            size="md"
                            onClick={handlePayment}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : `PAY ₹${price} NOW`}
                        </Button>

                        <div className="text-center mt-3">
                            <button
                                onClick={() => setStep(1)}
                                className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 3: Account Creation
    if (step === 3) {
        return (
            <div className="max-w-md mx-auto">
                <StepIndicator />
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in py-6 px-6 text-center">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    <h2 className="text-xl font-black text-[#020617] mb-1">Payment Successful!</h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-5">
                        Last Step: Create your login credentials
                    </p>

                    <div className="space-y-3 text-left">
                        <Input
                            label="Proposed Username"
                            placeholder="Choose a username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mt-5">
                        <Button
                            fullWidth
                            size="md"
                            onClick={handleFinish}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Finish Setup & Enter Dashboard'}
                        </Button>
                    </div>

                    <div className="mt-5 text-[8px] font-bold text-gray-300 uppercase tracking-wider leading-relaxed">
                        Welcome to the Dadacetwala Family<br />{formData.email}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default function EnrollmentPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar user={null} onLogout={() => { }} />

            <main className="flex-grow py-4 px-4 sm:px-6">
                <Suspense fallback={<div className="text-center pt-20">Loading Enrollment...</div>}>
                    <EnrollmentFlow />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}
