import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

interface Student {
    id: number;
    name: string;
    appId: string;
    mobile: string;
    email: string;
    status: 'Verified' | 'Pending' | 'Action Req';
    mentor: string | null;
}

export const EnrollmentsTab = () => {
    const [students, setStudents] = useState<Student[]>([
        { id: 1, name: 'Rahul Patil', appId: 'EN24001', mobile: '+91 9876543210', email: 'rahul@gmail.com', status: 'Verified', mentor: 'Amit Sir' },
        { id: 2, name: 'Sneha Deshmukh', appId: 'EN24005', mobile: '+91 9123456780', email: 'sneha.d@gmail.com', status: 'Pending', mentor: null },
        { id: 3, name: 'Vikram Singh', appId: 'EN24012', mobile: '+91 9988776655', email: 'vikram.s@outlook.com', status: 'Action Req', mentor: null },
    ]);

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-xl border border-gray-100 overflow-hidden">
            {/* Header & Limits */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-black text-[#020617] mb-0.5">Enrolled Students</h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Manage enrollments and mentor assignments.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-8 pl-8 pr-3 text-[9px] font-bold bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:bg-white w-40 transition-all"
                        />
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <Button variant="outline" className="h-8 w-8 p-0 rounded-lg bg-gray-50 border-gray-100 text-gray-400 hover:text-[#1e40af] hover:bg-white transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    </Button>
                    <div className="w-[1px] h-8 bg-gray-100 mx-1"></div>
                    <Button variant="outline" className="h-8 text-[9px] font-bold uppercase tracking-widest border-gray-200 px-3">
                        Export
                    </Button>
                    <Button className="h-8 bg-[#020617] text-white text-[9px] font-bold uppercase tracking-widest px-4 rounded-lg shadow-lg shadow-gray-900/10">
                        + Add
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left pb-3 pl-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">App ID</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="text-left pb-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Mentor</th>
                            <th className="text-right pb-3 pr-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
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
                                    <div className="text-[10px] font-medium text-gray-600">{student.mobile}</div>
                                    <div className="text-[9px] text-gray-400">{student.email}</div>
                                </td>
                                <td className="py-2.5">
                                    <span className={`inline-block px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${student.status === 'Verified' ? 'bg-green-50 text-green-600' :
                                        student.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                                            'bg-red-50 text-red-600'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="py-2.5">
                                    {student.mentor ? (
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-black text-blue-600">
                                                {student.mentor[0]}
                                            </div>
                                            <span className="text-[10px] font-bold text-[#1e40af]">{student.mentor}</span>
                                        </div>
                                    ) : (
                                        <span className="text-[9px] font-bold text-gray-400 italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="py-2.5 pr-2 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {!student.mentor && (
                                            <button className="text-[8px] font-black uppercase tracking-widest text-[#1e40af] hover:bg-blue-50 px-2 py-1 rounded-md border border-transparent hover:border-blue-100 transition-all">
                                                Assign
                                            </button>
                                        )}
                                        <button className="text-[8px] font-black uppercase tracking-widest text-[#1e40af] hover:bg-blue-50 px-2 py-1 rounded-md border border-transparent hover:border-blue-100 transition-all flex items-center gap-1">
                                            <span>⬇</span> Pref List
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
