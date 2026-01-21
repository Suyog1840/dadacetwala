import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Heading } from '../ui/Heading';
import { Subheading } from '../ui/Subheading';
import { createNotice, getNotices } from '@/actions/notice';
import { uploadFile } from '@/actions/storage';

interface Broadcast {
    id: string; // Changed to string (UUID)
    title: string; // mapped from 'subject' in old UI or directly title
    priority: 'General Update' | 'Important' | 'Urgent'; // mapped from 'type'
    description: string; // mapped from 'message'
    date: string;
    attachment?: string;
}

export const BroadcastsTab = () => {
    const [notices, setNotices] = useState<Broadcast[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        const data = await getNotices();
        // Map DB fields to UI fields if necessary, though they match mostly
        const mapped = data.map((n: any) => ({
            id: n.id,
            title: n.title,
            priority: n.priority as any,
            description: n.description,
            date: n.date
        }));
        setNotices(mapped);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            if (file) {
                setUploading(true);
                const fileData = new FormData();
                fileData.append('file', file);

                const result = await uploadFile(fileData, 'attachments', 'broadcasts');

                if (!result.success || !result.publicUrl) {
                    throw new Error(result.error || 'File upload failed');
                }

                formData.append('attachmentUrl', result.publicUrl);
                setUploading(false);
            }

            const result = await createNotice(formData);
            if (result.success) {
                // Refresh list
                await fetchNotices();
                (e.target as HTMLFormElement).reset();
                setFile(null);
                alert('Broadcast sent successfully!');
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error: any) {
            console.error(error);
            alert('Failed to post notice: ' + error.message);
        } finally {
            setIsLoading(false);
            setUploading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Create Broadcast Form */}
            <div className="lg:col-span-1 bg-white rounded-[1.5rem] p-6 shadow-xl border border-gray-100 h-fit">
                <Heading as="h3" className="mb-4">Create Broadcast</Heading>

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div>
                        <Input
                            name="title"
                            placeholder="Subject"
                            className="bg-gray-50 border-gray-100 focus:bg-white text-xs py-2.5 font-bold shadow-sm"
                            required
                        />
                    </div>

                    <div className="relative">
                        <select
                            name="type"
                            className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl px-4 text-[10px] font-black text-gray-600 appearance-none focus:outline-none focus:bg-white transition-all cursor-pointer uppercase tracking-wider shadow-sm"
                        >
                            <option value="General Update">General Update</option>
                            <option value="Important">Important</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <div>
                        <textarea
                            name="message"
                            placeholder="Notice message..."
                            className="w-full h-20 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold text-gray-600 focus:outline-none focus:bg-white resize-none shadow-sm placeholder:text-gray-400"
                            required
                        ></textarea>
                    </div>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-xs text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-xl file:border-0
                                file:text-xs file:font-semibold
                                file:bg-blue-50 file:text-[#1e40af]
                                hover:file:bg-blue-100
                            "
                        />
                    </div>

                    <Button
                        disabled={isLoading || uploading}
                        className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3 rounded-xl text-[10px] font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest mt-1"
                    >
                        {isLoading || uploading ? 'Posting...' : 'Post Notice'}
                    </Button>
                </form>
            </div>

            {/* Notice History */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <Subheading>Recent Broadcasts</Subheading>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {notices.map((notice) => (
                        <div key={notice.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xl transition-shadow">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-black text-[#020617]">{notice.title}</h4>
                                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${notice.priority === 'Urgent' ? 'bg-red-50 text-red-600' :
                                        notice.priority === 'Important' ? 'bg-orange-50 text-orange-600' :
                                            'bg-blue-50 text-blue-600'
                                        } uppercase tracking-widest`}>
                                        {notice.priority}
                                    </span>
                                </div>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{notice.date}</p>
                                <p className="text-xs text-gray-600 font-bold leading-relaxed max-w-xl">{notice.description}</p>
                            </div>
                        </div>
                    ))}

                    {notices.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-xs">No broadcasts yet.</div>
                    )}
                </div>
            </div>

        </div>
    );
};
