import React from 'react';

interface SubheadingProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export const Subheading: React.FC<SubheadingProps> = ({ children, className = '', ...props }) => {
    return (
        <p className={`text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest ${className}`} {...props}>
            {children}
        </p>
    );
};
