'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterSelect } from '@/components/ui/FilterSelect';
import { Button } from '@/components/ui/Button';

// Standard MaharashtraDistricts/Universities - simplified for MVP
const DISTRICTS = [
    'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Ahmednagar',
    'Amravati', 'Sangli', 'Kolhapur', 'Satara', 'Solapur', 'Jalgaon'
].sort();

const UNIVERSITIES = [
    'Savitribai Phule Pune University',
    'University of Mumbai',
    'Rashtrasant Tukadoji Maharaj Nagpur University',
    'Shivaji University',
    'Dr. Babasaheb Ambedkar Marathwada University'
];

const STATUSES = ['Government', 'Un-Aided', 'Aided', 'Autonomous'];

export function CollegeFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [district, setDistrict] = useState(searchParams.get('district') || 'All');
    const [university, setUniversity] = useState(searchParams.get('university') || 'All');
    const [status, setStatus] = useState(searchParams.get('status') || 'All');

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters({ search });
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [search]);

    // Apply Filters Helper
    const applyFilters = (newValues: any) => {
        const params = new URLSearchParams(searchParams.toString());

        // Merge state with new values (using current state for others if not provided in newValues)
        // Note: For search, we passed it explicitly in useEffect

        const qSearch = newValues.search !== undefined ? newValues.search : search;
        const qDistrict = newValues.district !== undefined ? newValues.district : district;
        const qUni = newValues.university !== undefined ? newValues.university : university;
        const qStatus = newValues.status !== undefined ? newValues.status : status;

        if (qSearch) params.set('search', qSearch); else params.delete('search');
        if (qDistrict && qDistrict !== 'All') params.set('district', qDistrict); else params.delete('district');
        if (qUni && qUni !== 'All') params.set('university', qUni); else params.delete('university');
        if (qStatus && qStatus !== 'All') params.set('status', qStatus); else params.delete('status');

        // Reset page on filter change
        params.delete('page');

        router.push(`/student/colleges?${params.toString()}`);
    };

    // Handlers
    const handleDistrictChange = (val: string) => {
        setDistrict(val);
        applyFilters({ district: val });
    };

    const handleUniChange = (val: string) => {
        setUniversity(val);
        applyFilters({ university: val });
    };

    const handleStatusChange = (val: string) => {
        setStatus(val);
        applyFilters({ status: val });
    };

    const handleClear = () => {
        setSearch('');
        setDistrict('All');
        setUniversity('All');
        setStatus('All');
        router.push('/student/colleges');
    };

    // Render Helpers
    const districtOptions = [
        { label: 'All Districts', value: 'All' },
        ...DISTRICTS.map(d => ({ label: d, value: d }))
    ];

    const uniOptions = [
        { label: 'All Universities', value: 'All' },
        ...UNIVERSITIES.map(u => ({ label: u, value: u }))
    ];

    const statusOptions = [
        { label: 'All Statuses', value: 'All' },
        ...STATUSES.map(s => ({ label: s, value: s }))
    ];

    return (
        <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
                <SearchInput
                    onSearch={setSearch}
                    placeholder="Search College Name or Code..."
                    initialValue={search}
                    className="w-full md:w-80"
                />

                <div className="w-[1px] h-8 bg-gray-200 hidden md:block"></div>

                <FilterSelect
                    value={district}
                    onChange={handleDistrictChange}
                    options={districtOptions}
                    defaultLabel="District"
                />

                <FilterSelect
                    value={university}
                    onChange={handleUniChange}
                    options={uniOptions}
                    defaultLabel="University"
                />

                <FilterSelect
                    value={status}
                    onChange={handleStatusChange}
                    options={statusOptions}
                    defaultLabel="Status"
                />

                <div className="flex-1"></div>

                <Button
                    onClick={handleClear}
                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest px-3"
                >
                    Clear All
                </Button>
            </div>
        </div>
    );
}
