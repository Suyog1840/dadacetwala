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
        <div className="flex flex-col items-end gap-1">
            <input
                type="file"
                accept=".pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border transition-all flex items-center gap-1 ${currentUrl
                    ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'
                    : 'text-[#1e40af] border-transparent hover:bg-blue-50 hover:border-blue-100'
                    }`}
            >
                {isUploading ? '...' : (currentUrl ? 'Update List' : 'Upload List')}
            </Button>
            {message && (
                <span className={`text-[8px] ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </span>
            )}
            {/* Optional: download link if exists */}
        </div>
    );
};
