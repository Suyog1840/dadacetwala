import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, error, options, placeholder, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {label} {props.required && '*'}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={`
              w-full px-3 py-2 rounded-lg border bg-white appearance-none
              text-[#020617] font-bold text-xs
              focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              transition-all duration-200
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-100'}
              ${className}
            `}
                        ref={ref}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled selected>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Select };
