import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Subheading } from '../ui/Subheading';
import { getEnrolledStudents } from '@/actions/admin';
import { getMentors, assignMentor } from '@/actions/mentor';
import { PreferenceUpload } from '@/components/mentor/PreferenceUpload';

interface Student {
    id: string; // User ID
    name: string;
    appId: string;
    mobile: string;
    email: string;
    plan: string | null;
    mentor: string | null;
    mentorId: string | null;

    preferenceListUrl: string | null;

    // New Fields for Export
    enrolledAt: string | null;
    paymentStatus: string | null;
    familyIncome: string | null;
    category: string | null;
    domicileState: string | null;
    rank: number | null;
    examType: string | null;
    cetPercentile: number | null;
    jeePercentile: number | null;
    pcbPercentile: number | null;
    diplomaPercentage: number | null;
}

import { SearchInput } from '@/components/ui/SearchInput';
import { FilterSelect } from '@/components/ui/FilterSelect';
import { ExportButton } from '@/components/ui/ExportButton';

// ... (Interface remains same)

export const EnrollmentsTab = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [mentors, setMentors] = useState<any[]>([]); // Store mentors list
    const [isLoading, setIsLoading] = useState(true);
    const [assigningId, setAssigningId] = useState<string | null>(null); // For loading state during assignment

    // Filter States (Search query receives debounced value from component)
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPlan, setFilterPlan] = useState('All');
    const [filterMentor, setFilterMentor] = useState('All');
    const [filterPref, setFilterPref] = useState('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [studentsData, mentorsData] = await Promise.all([
                getEnrolledStudents(),
                getMentors()
            ]);

            setMentors(mentorsData || []);

            const mappedStudents = studentsData.map((u: any) => {
                let profile = u.StudentProfile || u.studentProfile;
                if (Array.isArray(profile)) profile = profile[0];

                return {
                    id: u.id,
                    name: profile?.name || u.userName || 'Unknown',
                    appId: u.userName || 'N/A',
                    mobile: u.contact || 'N/A',
                    email: u.email,
                    plan: profile?.plan || 'N/A',
                    mentor: profile?.mentor?.name || null,
                    mentorId: profile?.mentorId || null,

                    preferenceListUrl: u.preferenceListUrl || null,

                    enrolledAt: u.enrolledAt || null,
                    paymentStatus: u.status === 'active' ? 'Complete' : 'Not Complete',
                    familyIncome: profile?.familyIncome || null,
                    category: profile?.category || null,
                    domicileState: profile?.domicileState || null,
                    rank: profile?.rank || null,
                    examType: profile?.examType || null,
                    cetPercentile: profile?.cetPercentile || null,
                    jeePercentile: profile?.jeePercentile || null,
                    pcbPercentile: profile?.pcbPercentile || null,
                    diplomaPercentage: profile?.diplomaPercentage || null,
                };
            });

            setStudents(mappedStudents);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async (studentId: string, mentorId: string) => {
        setAssigningId(studentId);
        try {
            // Treat 'unassigned' string as null for the backend
            const finalMentorId = mentorId === 'unassigned' ? null : mentorId;
            const res = await assignMentor(studentId, finalMentorId as any);

            if (res.success) {
                const mentorName = finalMentorId
                    ? (mentors.find(m => m.id === finalMentorId)?.name || 'Unknown')
                    : null;

                setStudents(prev => prev.map(s =>
                    s.id === studentId ? { ...s, mentor: mentorName, mentorId: finalMentorId } : s
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

    // Filter Logic
    const filteredStudents = students.filter(student => {
        // 1. Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matches =
                student.name.toLowerCase().includes(q) ||
                student.appId.toLowerCase().includes(q) ||
                student.email.toLowerCase().includes(q) ||
                student.mobile.includes(q);
            if (!matches) return false;
        }

        // 2. Plan
        if (filterPlan !== 'All') {
            if (filterPlan === 'No Plan') {
                if (student.plan && student.plan !== 'N/A' && student.plan !== 'No Plan') return false;
            } else {
                if (student.plan !== filterPlan) return false;
            }
        }

        // 3. Mentor
        if (filterMentor === 'Assigned' && !student.mentorId) return false;
        if (filterMentor === 'Unassigned' && student.mentorId) return false;

        // 4. Pref List
        if (filterPref === 'Uploaded' && !student.preferenceListUrl) return false;
        if (filterPref === 'Missing' && student.preferenceListUrl) return false;

        return true;
    });

    // Options for Dropdowns
    const uniquePlans = Array.from(new Set(students.map(s => s.plan || 'No Plan'))).filter(p => p !== 'N/A' && p !== 'No Plan');
    const planOptions = [
        ...uniquePlans.map(p => ({ label: p, value: p })),
        { label: 'No Plan', value: 'No Plan' }
    ];

    const mentorOptions = [
        { label: 'Assigned', value: 'Assigned' },
        { label: 'Unassigned', value: 'Unassigned' }
    ];

    const prefOptions = [
        { label: 'Uploaded', value: 'Uploaded' },
        { label: 'Missing', value: 'Missing' }
    ];

    // Export Logic
    const handleExport = () => {
        const headers = [
            'Student Name', 'App ID', 'Email', 'Mobile',
            'Plan', 'Enrolled At', 'Payment Status', 'Mentor',
            'Preference List', 'Family Income', 'Category',
            'Domicile', 'Rank', 'Exam Type', 'CET %', 'JEE %', 'PCB %', 'Diploma %'
        ];

        const rows = filteredStudents.map(s => [
            `"${s.name}"`,
            `"${s.appId}"`,
            `"${s.email}"`,
            `"${s.mobile}"`,
            `"${s.plan || 'No Plan'}"`,
            `"${s.enrolledAt ? new Date(s.enrolledAt).toLocaleDateString() : 'N/A'}"`,
            `"${s.paymentStatus || 'N/A'}"`,
            `"${s.mentor || 'Unassigned'}"`,
            `"${s.preferenceListUrl ? 'Uploaded' : 'Missing'}"`,
            `"${s.familyIncome || 'N/A'}"`,
            `"${s.category || 'N/A'}"`,
            `"${s.domicileState || 'N/A'}"`,
            `"${s.rank || 'N/A'}"`,
            `"${s.examType || 'N/A'}"`,
            `"${s.cetPercentile || 'N/A'}"`,
            `"${s.jeePercentile || 'N/A'}"`,
            `"${s.pcbPercentile || 'N/A'}"`,
            `"${s.diplomaPercentage || 'N/A'}"`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `enrollments_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Heading as="h3" className="mb-0.5">Enrolled Students</Heading>
                        <Subheading className="text-[9px]">
                            Manage enrollments and mentor assignments. ({filteredStudents.length} / {students.length})
                        </Subheading>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <SearchInput
                        onSearch={setSearchQuery}
                        placeholder="Search by Name, App ID..."
                        className="w-56"
                    />

                    <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>

                    <FilterSelect
                        value={filterPlan}
                        onChange={setFilterPlan}
                        options={planOptions}
                        defaultLabel="All Plans"
                    />

                    <FilterSelect
                        value={filterMentor}
                        onChange={setFilterMentor}
                        options={mentorOptions}
                        defaultLabel="All Mentors"
                    />

                    <FilterSelect
                        value={filterPref}
                        onChange={setFilterPref}
                        options={prefOptions}
                        defaultLabel="Pref List: All"
                    />

                    <div className="flex-1"></div>

                    <ExportButton onExport={handleExport} />

                    <Button className="h-8 bg-[#020617] text-white text-[9px] font-bold uppercase tracking-widest px-4 rounded-lg shadow-lg shadow-gray-900/10">
                        + Add
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto h-[600px] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-gray-100">
                            <th className="text-left pb-3 pl-4 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[40px]">Sr.N.</th>
                            <th className="text-left pb-3 pl-2 text-[8px] font-black text-gray-400 uppercase tracking-widest min-w-[120px]">Student Profile</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[100px]">Contact</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[80px]">Income</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[120px]">Category / Dom</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[90px]">Rank</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[150px]">Scores</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[80px]">Plan</th>
                            <th className="text-center pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[140px]">Mentor</th>
                            <th className="text-center pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest w-[200px]">Preference List</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan={10} className="text-center py-4 text-xs text-gray-500">Loading enrollments...</td></tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr><td colSpan={10} className="text-center py-4 text-xs text-gray-500">No students found matching your filters.</td></tr>
                        ) : (
                            filteredStudents.map((student, index) => (
                                <tr key={student.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="py-3 pl-4 text-[9px] font-bold text-gray-400">
                                        {index + 1}
                                    </td>
                                    <td className="py-3 pl-2">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-bold text-xs text-[#020617]">{student.name}</div>
                                            <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider w-fit">{student.appId}</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5">
                                        <div className="text-[10px] font-medium text-gray-600">{student.mobile}</div>
                                        <div className="text-[9px] text-gray-400">{student.email}</div>
                                    </td>
                                    <td className="py-2.5">
                                        <div className="text-[10px] font-medium text-gray-600">{student.familyIncome || 'N/A'}</div>
                                    </td>
                                    <td className="py-2.5">
                                        <div className="text-[10px] font-bold text-gray-700">{student.category || '-'}</div>
                                        <div className="text-[9px] text-gray-400">{student.domicileState || '-'}</div>
                                    </td>
                                    <td className="py-2.5">
                                        <div className="font-black text-xs text-[#1e40af]">#{student.rank || 'N/A'}</div>
                                        <div className="text-[8px] uppercase tracking-wider text-gray-400">{student.examType || '-'}</div>
                                    </td>
                                    <td className="py-2.5">
                                        <div className="space-y-1">
                                            {(student.cetPercentile && student.cetPercentile > 0) ? (
                                                <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                    <span className="text-gray-400">MHTCET</span>
                                                    <span className="font-bold text-gray-700">{student.cetPercentile}%</span>
                                                </div>
                                            ) : null}
                                            {(student.jeePercentile && student.jeePercentile > 0) ? (
                                                <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                    <span className="text-gray-400">JEE</span>
                                                    <span className="font-bold text-gray-700">{student.jeePercentile}%</span>
                                                </div>
                                            ) : null}
                                            {(student.pcbPercentile && student.pcbPercentile > 0) ? (
                                                <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                    <span className="text-gray-400">NEET</span>
                                                    <span className="font-bold text-gray-700">{student.pcbPercentile}%</span>
                                                </div>
                                            ) : null}
                                            {(student.diplomaPercentage && student.diplomaPercentage > 0) ? (
                                                <div className="text-[9px] flex items-center justify-between gap-2 w-24">
                                                    <span className="text-gray-400">Diploma</span>
                                                    <span className="font-bold text-gray-700">{student.diplomaPercentage}%</span>
                                                </div>
                                            ) : null}
                                            {!student.cetPercentile && !student.jeePercentile && !student.pcbPercentile && !student.diplomaPercentage && (
                                                <span className="text-[9px] text-gray-300 italic">No scores</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-2.5">
                                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${(!student.plan || student.plan === 'N/A' || student.plan === 'No Plan')
                                            ? 'bg-gray-100 text-gray-500'
                                            : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {student.plan && student.plan !== 'N/A' ? student.plan : 'No Plan'}
                                        </span>
                                    </td>
                                    <td className="py-2.5 text-center">
                                        <div className="relative inline-block w-[130px]">
                                            <select
                                                className={`appearance-none w-full bg-gray-50 border text-[9px] rounded-lg px-2 py-1.5 pr-6 focus:outline-none focus:border-blue-500 font-bold transition-all ${student.mentor ? 'text-blue-700 border-blue-100 bg-blue-50' : 'text-gray-500 border-gray-200'
                                                    }`}
                                                onChange={(e) => handleAssign(student.id, e.target.value)}
                                                value={student.mentorId || "unassigned"}
                                                disabled={assigningId === student.id}
                                            >
                                                <option value="unassigned" className="text-gray-400 font-medium">Unassigned</option>
                                                {mentors.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                {assigningId === student.id ? (
                                                    <div className="w-2 h-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <svg className={`w-2 h-2 ${student.mentor ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 pr-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <PreferenceUpload
                                                studentId={student.id}
                                                studentUserName={student.appId} // appId is mapped to userName
                                                currentUrl={student.preferenceListUrl}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
