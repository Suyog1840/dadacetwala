'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Subheading } from '../ui/Subheading';
import { createMentor, getMentors, assignMentor } from '@/actions/mentor';
import { getEnrolledStudents } from '@/actions/admin';

interface Mentor {
    id: string; // MentorProfile ID
    name: string;
    contact: string;
    userId: string;
    user?: {
        email: string;
    };
    createdAt: string;
}

interface Student {
    id: string;
    name: string;
    status: string;
    mentor: string | null;
    mentorId: string | null;
    appId: string;
}

export const MentorsTab = () => {
    const [activeView, setActiveView] = useState<'list' | 'assignments'>('list');

    // Mentor List State
    const [mentors, setMentors] = useState<Mentor[]>([]);

    // Assignment State
    const [students, setStudents] = useState<Student[]>([]);
    const [assigningId, setAssigningId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [iscreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        // Always fetch mentors, fetch students if in assignment view or just pre-fetch all? 
        // Let's fetch both for simplicity as volume is low
        try {
            const [mentorsData, studentsData] = await Promise.all([
                getMentors(),
                getEnrolledStudents()
            ]);

            setMentors(mentorsData as any);

            const mappedStudents = studentsData.map((u: any) => {
                // Handle various casing and array/object structures for StudentProfile
                let profile = u.StudentProfile || u.studentProfile;
                if (Array.isArray(profile)) profile = profile[0];

                const mentorId = profile?.mentorId || null;
                // Try to get name from nested relation, fall back to lookup in mentors list
                const mentorNameResult = profile?.mentor?.name ||
                    (mentorId ? (mentorsData as any).find((m: any) => m.id === mentorId)?.name : null);

                return {
                    id: u.id,
                    name: profile?.name || u.userName || 'Unknown',
                    status: 'Verified',
                    mentor: mentorNameResult,
                    mentorId: mentorId,
                    appId: u.userName || 'N/A'
                };
            });

            setStudents(mappedStudents);

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async (studentId: string, mentorId: string) => {
        setAssigningId(studentId);
        try {
            const res = await assignMentor(studentId, mentorId);
            if (res.success) {
                const mentorName = mentors.find(m => m.id === mentorId)?.name || 'Unknown';
                setStudents(prev => prev.map(s =>
                    s.id === studentId ? { ...s, mentor: mentorName, mentorId: mentorId } : s
                ));
            } else {
                alert('Failed to assign mentor');
            }
        } catch (error) {
            console.error(error);
            alert('Error assigning mentor');
        } finally {
            setAssigningId(null);
        }
    };

    // ... handleCreate ...
    // Note: Re-inserting handleCreate here for context reference or just skipping if already present.
    // The previous tool call modified up to line 144 which was partly inside/before handleCreate.
    // Wait, the previous tool call replaced fetchMentors but cut off before handleCreate was fully defined?
    // Actually, I need to be careful with line numbers.
    // Let's assume handleCreate is there. I will replace the Return statement and Header area.

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const form = new FormData();
        form.append('name', formData.name);
        form.append('contact', formData.contact);
        form.append('email', formData.email);
        form.append('password', formData.password);

        try {
            const res = await createMentor(null, form);
            if (res.success) {
                setIsCreateModalOpen(false);
                setFormData({ name: '', contact: '', email: '', password: '' });
                fetchData(); // Changed to new generic fetch
            } else {
                setError(res.error || 'Failed to create mentor');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderAssignmentTable = () => (
        <div className="overflow-x-auto h-[600px] overflow-y-auto">
            <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-gray-100">
                        <th className="text-left pb-3 pl-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                        <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">App ID</th>
                        <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Current Mentor</th>
                        <th className="text-right pb-3 pr-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {students.map((student) => (
                        <tr key={student.id} className="group hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 pl-2">
                                <div className="font-bold text-xs text-[#020617]">{student.name}</div>
                            </td>
                            <td className="py-2.5">
                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">{student.appId}</span>
                            </td>
                            <td className="py-2.5">
                                <div className="text-[10px] font-medium text-[#1e40af]">{student.mentor || 'Unassigned'}</div>
                            </td>
                            <td className="py-2.5 pr-2 text-right">
                                <div className="flex justify-end items-center gap-2">
                                    <select
                                        className="bg-gray-50 border border-gray-200 text-gray-600 text-[9px] rounded px-1 py-1 w-32 focus:outline-none focus:border-blue-500"
                                        onChange={(e) => handleAssign(student.id, e.target.value)}
                                        value={student.mentorId || ""}
                                        disabled={assigningId === student.id}
                                    >
                                        <option value="" disabled>Assign Mentor...</option>
                                        {mentors.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                    {assigningId === student.id && <span className="text-[8px] text-blue-500">...</span>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Heading as="h3" className="mb-0.5">Mentors & Assignments</Heading>
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={() => setActiveView('list')}
                            className={`text-[9px] font-black uppercase tracking-widest transition-colors ${activeView === 'list' ? 'text-[#1e40af] underline' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Mentor List
                        </button>
                        <button
                            onClick={() => setActiveView('assignments')}
                            className={`text-[9px] font-black uppercase tracking-widest transition-colors ${activeView === 'assignments' ? 'text-[#1e40af] underline' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Student Assignments
                        </button>
                    </div>
                </div>
                {activeView === 'list' && (
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-8 bg-[#020617] text-white text-[9px] font-bold uppercase tracking-widest px-4 rounded-lg shadow-lg shadow-gray-900/10"
                    >
                        + Add Mentor
                    </Button>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="text-center py-8 text-xs text-gray-500">Loading...</div>
            ) : activeView === 'list' ? (
                // Existing Mentor List Table
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* ... Existing Table Header ... */}
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left pb-3 pl-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Login Details</th>
                                <th className="text-right pb-3 pr-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mentors.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-4 text-xs text-gray-500">No mentors found.</td></tr>
                            ) : (
                                mentors.map((m) => (
                                    <tr key={m.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-2.5 pl-2">
                                            <div className="font-bold text-xs text-[#020617]">{m.name}</div>
                                        </td>
                                        <td className="py-2.5">
                                            <div className="text-[10px] font-medium text-gray-600">{m.contact}</div>
                                        </td>
                                        <td className="py-2.5">
                                            <div className="text-[9px] text-gray-500">{m.user?.email}</div>
                                        </td>
                                        <td className="py-2.5 pr-2 text-right">
                                            <div className="text-[9px] text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                renderAssignmentTable()
            )}

            {/* Create Modal */}
            {iscreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <Heading as="h3" className="mb-4">Add New Mentor</Heading>
                        {error && <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded">{error}</div>}
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Contact Number</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                    value={formData.contact}
                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email (Username)</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Password</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#020617] text-white text-xs"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Mentor'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
