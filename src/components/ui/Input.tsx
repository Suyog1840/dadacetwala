'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', type = 'text', label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {label} {props.required && '*'}
                    </label>
                )}
                <input
                    type={type}
                    className={`
            w-full px-3 py-2 rounded-lg border bg-white
            text-[#020617] font-bold text-xs placeholder:font-medium placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-100'}
            ${className}
          `}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
