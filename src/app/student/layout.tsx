'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@/components/types';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
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
                    role: (dbUser?.role as any) || 'unenrolled'
                });
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
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
