'use client';

import React from 'react';
import Link from 'next/link';

interface College {
    collegeCode: string;
    collegeName: string;
    status: string | null;
    district: string | null;
    homeUniversity: string | null;
    minority: string | null;
    branches: string[];
}

interface Props {
    colleges: College[];
    currentPage: number;
    totalPages: number;
}

export function CollegeTable({ colleges, currentPage, totalPages }: Props) {
    if (colleges.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 mt-6">
                <div className="text-gray-400 text-sm font-medium">No colleges found matching your criteria.</div>
            </div>
        );
    }

    return (
        <div className="mt-6 flex flex-col gap-6">
            <div className="bg-white rounded-[1.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 pl-6 pr-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-[80px]">Code</th>
                                <th className="text-left py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest min-w-[250px]">College Details</th>
                                <th className="text-left py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-[150px]">Location</th>
                                <th className="text-left py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-[120px]">Status</th>
                                <th className="text-left py-4 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest min-w-[200px]">Branches Available</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {colleges.map((college) => (
                                <CollegeRow key={college.collegeCode} college={college} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="text-xs text-gray-400 font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                    {currentPage > 1 && (
                        <Link
                            href={`/student/colleges?page=${currentPage - 1}`}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                            Previous
                        </Link>
                    )}
                    {currentPage < totalPages && (
                        <Link
                            href={`/student/colleges?page=${currentPage + 1}`}
                            className="bg-[#020617] text-white hover:bg-[#1e293b] px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-gray-900/10"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

function CollegeRow({ college }: { college: College }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <tr className="group hover:bg-blue-50/30 transition-colors">
            <td className="py-4 pl-6 pr-4 align-top">
                <span className="font-black text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {college.collegeCode}
                </span>
            </td>
            <td className="py-4 px-4 align-top">
                <div className="flex flex-col gap-1">
                    <div className="font-bold text-sm text-gray-900 leading-snug">
                        {college.collegeName}
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium">
                        {college.homeUniversity || 'Unknown University'}
                    </div>
                    {college.minority && college.minority !== 'Non-Minority' && (
                        <span className="inline-block mt-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                            {college.minority}
                        </span>
                    )}
                </div>
            </td>
            <td className="py-4 px-4 align-top">
                <div className="flex flex-col text-xs">
                    <span className="font-bold text-gray-700">{college.district || 'N/A'}</span>
                    <span className="text-[10px] text-gray-400">Maharashtra</span>
                </div>
            </td>
            <td className="py-4 px-4 align-top">
                <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase ${college.status?.toLowerCase().includes('government')
                    ? 'bg-green-50 text-green-700'
                    : college.status?.toLowerCase().includes('aided') && !college.status?.toLowerCase().includes('un-aided')
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                    {college.status || 'Unknown'}
                </span>
            </td>
            <td className="py-4 px-4 align-top">
                <div className="flex flex-wrap gap-1.5 transition-all">
                    {(expanded ? college.branches : college.branches.slice(0, 3)).map((branch, idx) => (
                        <span key={idx} className="inline-block px-2 py-0.5 border border-gray-100 bg-white rounded text-[9px] font-medium text-gray-600 shadow-sm">
                            {branch}
                        </span>
                    ))}

                    {college.branches.length === 0 && (
                        <span className="text-[9px] text-gray-400 italic">No branch info</span>
                    )}

                    {!expanded && college.branches.length > 3 && (
                        <button
                            onClick={() => setExpanded(true)}
                            className="inline-block px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[9px] font-bold transition-colors cursor-pointer"
                        >
                            +{college.branches.length - 3} more
                        </button>
                    )}

                    {expanded && college.branches.length > 3 && (
                        <button
                            onClick={() => setExpanded(false)}
                            className="inline-block px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[9px] font-bold transition-colors cursor-pointer"
                        >
                            Show Less
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

