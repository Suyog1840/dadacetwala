import React from 'react';
import { Button } from './Button';

interface ExportButtonProps {
    onExport: () => void;
    label?: string;
    className?: string;
}

export const ExportButton = ({ onExport, label = "Export", className = "" }: ExportButtonProps) => {
    return (
        <Button
            variant="outline"
            onClick={onExport}
            className={`h-8 text-[9px] font-bold uppercase tracking-widest border-gray-200 px-3 bg-white hover:bg-gray-50 flex items-center gap-2 ${className}`}
        >
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            {label}
        </Button>
    );
};
