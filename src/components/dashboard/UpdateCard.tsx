import React from 'react';

interface UpdateItem {
    id: number;
    date: string;
    title: string;
    description: string;
    type: 'alert' | 'info';
    attachmentUrl?: string; // Optional attachment
}

const UpdateCard: React.FC<{ updates: UpdateItem[] }> = ({ updates }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
            <h3 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">
                Institutional Updates
            </h3>

            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {updates.map((update) => (
                    <div key={update.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 shrink-0">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">
                                ALERT • {update.date}
                            </span>
                        </div>
                        <h4 className="text-[11px] font-black text-[#020617] mb-0.5">
                            {update.title}
                        </h4>
                        <p className="text-[9px] text-gray-500 leading-relaxed font-medium">
                            {update.description}
                        </p>
                        {update.attachmentUrl && (
                            <a
                                href={update.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-[9px] font-black text-[#1e40af] hover:underline"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                DOWNLOAD ATTACHMENT
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdateCard;
