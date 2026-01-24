'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';

import { enrollStudentFirstStep } from '@/actions/enrollment';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/actions/payment';
import { finalizeAccount, getCurrentUser } from '@/actions/user';

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
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        academicStream: 'Engineering',
        homeUniversity: 'Mumbai University (MU)',
        gender: 'Male',
        category: 'Open',
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
            // 1️⃣ Call Server Action for Registration
            const result = await enrollStudentFirstStep({
                ...formData,
                plan: plan
            });

            if (!result.success || !result.userId || (!result.tempPassword && !result.isExistingUser)) {
                console.error('Signup error:', result.error);
                alert(`Failed to create account: ${result.error || 'Unknown error'}`);
                return;
            }

            setRegisteredUserId(result.userId);
            setCurrentTempPassword(result.tempPassword || null);
            if (result.isExistingUser) {
                setIsExistingUser(true);
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

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                setIsLoading(false);
                return;
            }

            let userId = registeredUserId;

            if (!userId) {
                // Try to get from session if missing (edge case)
                const user = await getCurrentUser();
                userId = user?.id || null;
            }

            if (!userId) {
                alert('User registration not found. Please try Step 1 again.');
                setStep(1);
                setIsLoading(false);
                return;
            }

            // Create Order
            const result = await createRazorpayOrder(Number(price));

            if (!result.success || !result.orderId) {
                console.error('Order creation error:', result.error);
                alert(`Could not initiate payment: ${result.error}`);
                setIsLoading(false);
                return;
            }

            const options = {
                key: result.keyId,
                amount: result.amount,
                currency: result.currency,
                name: "Dadacetwala",
                description: `Enrollment for ${getPlanName()}`,
                order_id: result.orderId,
                image: '/logo.png', // Add logo if available
                handler: async function (response: any) {
                    try {
                        const verifyResult = await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: userId!,
                            amount: Number(price)
                        });

                        if (verifyResult.success) {
                            setIsLoading(false);
                            // ALWAYS go to Step 3 as per user request to allow credential creation/update
                            setStep(3);
                        } else {
                            console.error('Payment verification failed:', verifyResult.error);
                            alert(`Payment verification failed: ${verifyResult.error}`);
                            setIsLoading(false);
                        }
                    } catch (e: any) {
                        console.error('Handler Exception:', e);
                        alert(`Verification error: ${e.message}`);
                        setIsLoading(false);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.contactNumber.replace(/\D/g, ''), // Remove non-digits for cleaner passing
                },
                theme: {
                    color: "#1e40af",
                },
                modal: {
                    ondismiss: function () {
                        setIsLoading(false);
                    }
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred during payment processing.');
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
            // Ensure we are logged in.
            let user = await getCurrentUser();

            if (!user && currentTempPassword && formData.email) {
                // Log in with temp password via API
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        identifier: formData.email,
                        password: currentTempPassword
                    })
                });

                if (!response.ok) {
                    const res = await response.json();
                    if (res.error?.toLowerCase().includes('email not confirmed')) {
                        alert(`DadaCETWala Error: Email confirmation enabled. Disable "Confirm email" in Supabase or confirm your email manually.`);
                    } else {
                        alert(`Failed to authenticate setup session: ${res.error}`);
                    }
                    return;
                }
                // Refresh user after login
                user = await getCurrentUser();
            }

            // Update password & username via Server Action (Passing temp creds in case session is lost)
            // Update password & username via Server Action (Passing temp creds in case session is lost)
            // Note: We prioritize using the established session, but if that fails, the server action needs the creds to re-auth
            const result = await finalizeAccount(
                formData.password,
                formData.username,
                formData.email,
                currentTempPassword || undefined
            );

            if (!result.success) {
                console.error('Finalize error:', result.error);
                alert(`Failed to finish setup: ${result.error}`);
                setIsLoading(false);
                return;
            }

            console.log('Account finalized successfully. Redirecting...');
            window.location.href = '/student/dashboard';

        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred while finishing setup.');
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

    // Success View
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-3xl">
                        ✓
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#020617] mb-2">Enrollment Successful!</h2>
                        <p className="text-gray-600">
                            {isExistingUser
                                ? "Your account has been upgraded. You can now access the student dashboard."
                                : "Your account has been created. You can now access the student dashboard."}
                        </p>
                    </div>
                    <a href="/student/dashboard" className="block w-full">
                        <Button fullWidth size="lg">Go to Dashboard</Button>
                    </a>
                </div>
            </div>
        );
    }

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                            <Input
                                label="Annual Family Income"
                                placeholder="e.g. 500000"
                                name="familyIncome"
                                value={formData.familyIncome}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-1">
                            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                Score Details (Optional)
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
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
                        <Button
                            fullWidth
                            size="md"
                            onClick={handlePayment}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : `PAY SECURELY ₹${price}`}
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
