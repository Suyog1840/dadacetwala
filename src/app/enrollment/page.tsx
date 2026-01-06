'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

// Enrollment Flow Component
function EnrollmentFlow() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const plan = searchParams.get('plan') || 'expert';
    const price = searchParams.get('price') || '4999';

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        academicStream: 'Engineering',
        homeUniversity: 'Mumbai University (MU)',
        gender: 'Male',
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

    const handleNext = () => {
        setIsLoading(true);
        // Simulate API call/processing
        setTimeout(() => {
            setStep(prev => prev + 1);
            setIsLoading(false);
        }, 800);
    };

    const handlePayment = () => {
        setIsLoading(true);
        // Simulate Payment Processing
        setTimeout(() => {
            setStep(prev => prev + 1);
            setIsLoading(false);
        }, 1500);
    };

    const handleFinish = () => {
        setIsLoading(true);
        // Simulate Account Creation & Redirect
        setTimeout(() => {
            // Navigate to dashboard or login
            router.push('/student'); // Change to actual dashboard route
            setIsLoading(false);
        }, 1000);
    };

    // Helper to get Plan Name
    const getPlanName = () => {
        switch (plan) {
            case 'basic': return 'Basic Access';
            case 'expert': return 'Expert Counseling';
            case 'vip': return 'VIP Direct';
            default: return 'Selected Plan';
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
                {/* Back / Change Plan */}
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
                    {/* Header */}
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
                        {/* Row 1: Basic Info - 3 Cols */}
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

                        {/* Row 2: Academic & Personal - 3 Cols */}
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

                        {/* Row 3: Income - 3 Cols constrained */}
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

                        {/* Score Details divider */}
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
                    {/* Header Section */}
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
                                <span className="text-[10px] font-black text-[#020617]">#TXN_9423812</span>
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

                        <div className="flex justify-center items-center mt-4 space-x-2 opacity-50">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Secured by</span>
                            <div className="w-6 h-1.5 bg-gray-300 rounded-full"></div>
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
                        Welcome to the Dadacetwala Family<br />cscsc@gmail.com
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
