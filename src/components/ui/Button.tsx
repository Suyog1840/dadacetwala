import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className = '', variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-wider rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-[#1e40af] text-white hover:bg-[#1e3a8a] shadow-lg shadow-blue-900/20 focus:ring-[#1e40af]',
            secondary: 'bg-white text-[#1e40af] hover:bg-gray-50 border-2 border-[#1e40af] focus:ring-[#1e40af]',
            outline: 'border border-gray-200 bg-white text-[#020617] hover:bg-gray-50 focus:ring-gray-200',
            ghost: 'text-gray-500 hover:text-[#1e40af] hover:bg-blue-50 focus:ring-transparent shadow-none',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-[10px]',
            md: 'px-4 py-2.5 text-[10px] md:text-xs',
            lg: 'px-6 py-3.5 text-xs md:text-sm',
        };

        const width = fullWidth ? 'w-full' : '';

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
