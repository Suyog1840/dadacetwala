'use client';

import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { uploadPreferenceList } from '@/actions/mentor';

interface PreferenceUploadProps {
    studentId: string; // Used for identifying the student in UI context if needed, but file name is specific
    studentUserName: string; // Used for file naming
    currentUrl?: string | null;
}

export const PreferenceUpload = ({ studentId, studentUserName, currentUrl }: PreferenceUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMessage('');

        // Validation
        if (file.type !== 'application/pdf') {
            setMessage('Error: Only PDF files are allowed.');
            return;
        }

        if (file.size > 256 * 1024) { // 256KB
            setMessage('Error: File size must be less than 256KB.');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            // Rename file to [username].pdf
            const renamedFile = new File([file], `${studentUserName}.pdf`, { type: 'application/pdf' });
            formData.append('file', renamedFile);

            const res = await uploadPreferenceList(formData);

            if (res.success) {
                setMessage('Success: Preference list uploaded!');
                // Optionally trigger a refresh or callback
            } else {
                setMessage(`Error: ${res.error || 'Upload failed'}`);
            }
        } catch (err) {
            console.error(err);
            setMessage('Error: An unexpected error occurred.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <input
                type="file"
                accept=".pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Download Button */}
            {currentUrl && (
                <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-6 flex items-center justify-center gap-1.5 px-3 bg-white border border-gray-200 rounded text-[9px] font-black text-gray-600 uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                    title="Download Preference List"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>View</span>
                </a>
            )}

            {/* Upload/Update Button */}
            <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`h-6 text-[9px] font-black uppercase tracking-widest px-3 rounded shadow-sm border transition-all flex items-center gap-1.5 ${currentUrl
                    ? 'bg-blue-600 text-white border-transparent hover:bg-blue-700' // Update State: Solid Blue
                    : 'bg-[#020617] text-white border-transparent hover:bg-gray-800' // Upload State: Dark Theme
                    }`}
                title={currentUrl ? "Replace existing list" : "Upload new list"}
            >
                {/* Icon changes based on state */}
                {currentUrl ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                )}
                <span>{isUploading ? '...' : (currentUrl ? 'Update' : 'Upload')}</span>
            </Button>

            {message && (
                <span className={`text-[8px] absolute -bottom-4 right-0 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </span>
            )}
        </div>
    );
};
