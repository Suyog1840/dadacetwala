'use client';

import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// Mock User Data for Dashboard context
const MOCK_USER = {
    name: 'Siddharth M.',
    role: 'Enrolled Student',
    avatar: 'SM'
};

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar user={MOCK_USER} onLogout={() => { console.log('Logout') }} />
            <main className="flex-grow py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
}
