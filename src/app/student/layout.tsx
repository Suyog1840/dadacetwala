'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import { useRouter } from 'next/navigation';
import { User } from '@/types';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { getCurrentUser } = await import('@/actions/user');
                const userData = await getCurrentUser();
                if (userData) {
                    if (!userData.isEnrolled && userData.role !== 'admin' && userData.role !== 'super_admin') {
                        router.push('/');
                        return;
                    }

                    setUser({
                        name: userData.userName || userData.email?.split('@')[0] || 'User',
                        email: userData.email || '',
                        role: (userData.role as any) || 'unenrolled',
                        isEnrolled: userData.isEnrolled
                    });
                }
            } catch (error) {
                console.error("Layout fetch user error:", error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar user={user} onLogout={handleLogout} />
            <main className="flex-grow py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
}
