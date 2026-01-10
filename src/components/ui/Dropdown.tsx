'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps {
    label?: string;
    name?: string;
    options: DropdownOption[];
    value?: string;
    onChange?: (e: { target: { name: string; value: string } }) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export function Dropdown({
    label,
    name = '',
    options,
    value = '',
    onChange,
    placeholder = 'Select an option',
    required = false,
    className = ''
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        if (onChange) {
            onChange({ target: { name, value: optionValue } });
        }
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#020617] hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all flex items-center justify-between"
            >
                <span className={selectedOption ? 'text-[#020617]' : 'text-gray-400'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${option.value === value
                                    ? 'bg-blue-50 text-[#1e40af]'
                                    : 'text-[#020617] hover:bg-gray-50'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
