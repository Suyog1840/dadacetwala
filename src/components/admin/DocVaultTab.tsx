import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Subheading } from '../ui/Subheading';
import { updateCollegeFeesUrl } from '@/actions/admin';
import { uploadFile } from '@/actions/storage';

export const DocVaultTab = () => {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage('');

        try {
            // 1. Extract college code from filename (e.g., "06006.pdf" -> "06006")
            const fileName = file.name;
            const collegeCode = fileName.split('.')[0];

            if (!collegeCode || isNaN(Number(collegeCode))) {
                throw new Error('Invalid filename. Please use the format "CollegeCode.pdf" (e.g., 6006.pdf)');
            }

            // 2. Upload to 'fees_structures' bucket using server action
            const fileData = new FormData();
            fileData.append('file', file);

            const result = await uploadFile(fileData, 'fees_structures', 'fees');

            if (!result.success || !result.publicUrl) {
                throw new Error(result.error || 'File upload failed');
            }

            // 3. Update Database
            const dbResult = await updateCollegeFeesUrl(collegeCode, result.publicUrl);

            if (!dbResult.success) {
                throw new Error(dbResult.error || 'Failed to update database');
            }

            setMessage(`Success! Uploaded for college code: ${collegeCode}`);

        } catch (error: any) {
            console.error(error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setUploading(false);
            event.target.value = ''; // Reset input
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* 1. Preference List Dispatch (Restored) */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[250px]">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-sm filter drop-shadow-sm">
                    📂
                </div>
                <Heading as="h3" className="mb-2">Preference List Dispatch</Heading>
                <Subheading className="max-w-xs mx-auto leading-relaxed mb-6 text-gray-500">
                    Instantly push custom preference lists.
                </Subheading>
                <Button className="w-full max-w-xs bg-[#1e40af] hover:bg-[#1e3a8a] py-3 rounded-xl text-[10px] font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest">
                    Select PDF Document
                </Button>
            </div>

            {/* 2. Fees Upload Card (New Feature) */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[250px]">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-sm filter drop-shadow-sm">
                    💰
                </div>
                <Heading as="h3" className="mb-2">Upload Fees Structure</Heading>
                <Subheading className="max-w-xs mx-auto leading-relaxed mb-6 text-gray-500">
                    Upload PDF named as "CollegeCode.pdf" (e.g., 06006.pdf).
                </Subheading>

                <div className="relative w-full max-w-xs">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button
                        disabled={uploading}
                        className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3 rounded-xl text-[10px] font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest pointer-events-none"
                    >
                        {uploading ? 'Uploading...' : 'Select PDF Definition'}
                    </Button>
                </div>

                {message && (
                    <p className={`mt-4 text-xs font-bold ${message.startsWith('Success') ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </div>

            {/* 3. Bulk Mentor Allocation (Restored) */}
            <div className="bg-white rounded-[1.5rem] p-8 shadow-xl border border-gray-100 min-h-[250px] flex flex-col justify-center text-center items-center">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-sm filter drop-shadow-sm">
                    👥
                </div>
                <Heading as="h3" className="mb-6">Bulk Mentor Allocation</Heading>

                <div className="space-y-4 w-full max-w-xs">
                    <div className="relative">
                        <select className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-5 text-xs font-black text-[#020617] appearance-none focus:outline-none focus:bg-white transition-all cursor-pointer shadow-sm">
                            <option>Batch 2024 - Round 1</option>
                            <option>Batch 2024 - Round 2</option>
                            <option>Direct Second Year</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-[#020617]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3 rounded-xl text-[10px] font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest">
                        Run Allocation Logic
                    </Button>
                </div>
            </div>

        </div>
    );
};
