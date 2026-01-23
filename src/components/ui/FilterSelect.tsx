import React from 'react';

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    defaultLabel?: string;
    className?: string;
}

export const FilterSelect = ({ value, onChange, options, defaultLabel = "All", className = "" }: FilterSelectProps) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`h-8 px-2 text-[9px] font-bold bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer text-gray-600 ${className}`}
        >
            <option value="All">{defaultLabel}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};
