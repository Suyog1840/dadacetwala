import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Heading } from '../ui/Heading';
import { Subheading } from '../ui/Subheading';

interface Broadcast {
    id: number;
    subject: string;
    type: 'General Update' | 'Important' | 'Urgent';
    message: string;
    date: string;
    attachment?: string;
}

export const BroadcastsTab = () => {
    const [notices, setNotices] = useState<Broadcast[]>([
        { id: 1, subject: 'Option Form Filling Started', type: 'General Update', message: 'The option form filling for CAP Round 1 has started.', date: '2024-08-20' },
        { id: 2, subject: 'Revised Document Verification Dates', type: 'Important', message: 'Please note the revised dates for document verification at FCs.', date: '2024-08-18', attachment: 'schedule.pdf' },
        { id: 3, subject: 'Scholarship Portal Open', type: 'General Update', message: 'MahaDBT portal is now open for scholarship applications.', date: '2024-08-15' },
    ]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Create Broadcast Form */}
            <div className="lg:col-span-1 bg-white rounded-[1.5rem] p-6 shadow-xl border border-gray-100 h-fit">
                <Heading as="h3" className="mb-4">Create Broadcast</Heading>

                <form className="space-y-3">
                    <div>
                        <Input
                            placeholder="Subject"
                            className="bg-gray-50 border-gray-100 focus:bg-white text-xs py-2.5 font-bold shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <select className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl px-4 text-[10px] font-black text-gray-600 appearance-none focus:outline-none focus:bg-white transition-all cursor-pointer uppercase tracking-wider shadow-sm">
                            <option>General Update</option>
                            <option>Important</option>
                            <option>Urgent</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <div>
                        <textarea
                            placeholder="Notice message..."
                            className="w-full h-20 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-bold text-gray-600 focus:outline-none focus:bg-white resize-none shadow-sm placeholder:text-gray-400"
                        ></textarea>
                    </div>

                    {/* File Upload Mock */}
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-3 text-center cursor-pointer hover:border-blue-200 transition-colors bg-gray-50/50">
                        <span className="text-xl block mb-1">📎</span>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Attach File</span>
                    </div>

                    <Button className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-3 rounded-xl text-[10px] font-black shadow-lg shadow-blue-900/20 uppercase tracking-widest mt-1">
                        Post Notice
                    </Button>
                </form>
            </div>

            {/* Notice History */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <Subheading>Recent Broadcasts</Subheading>
                </div>

                <div className="space-y-3">
                    {notices.map((notice) => (
                        <div key={notice.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xl transition-shadow">
                            <div>
                                <h4 className="text-sm font-black text-[#020617] mb-1">{notice.subject}</h4>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{notice.date}</p>
                                <p className="text-xs text-gray-600 font-bold leading-relaxed max-w-xl">{notice.message}</p>
                            </div>

                            {notice.attachment && (
                                <Button variant="outline" className="shrink-0 text-[9px] font-black uppercase tracking-widest border-blue-100 text-[#1e40af] hover:bg-blue-50 h-8 px-4 rounded-lg bg-blue-50/50">
                                    <span className="mr-2">⬇</span> Download
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};
