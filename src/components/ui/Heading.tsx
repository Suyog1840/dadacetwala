import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ as: Component = 'h1', children, className = '', ...props }) => {
    const baseStyles = 'font-black text-[#020617] tracking-tight';
    const variants = {
        h1: 'text-2xl md:text-3xl lg:text-4xl',
        h2: 'text-xl md:text-2xl',
        h3: 'text-lg md:text-xl',
        h4: 'text-base md:text-lg',
        h5: 'text-sm md:text-base',
        h6: 'text-xs md:text-sm',
    };

    return (
        <Component className={`${baseStyles} ${variants[Component]} ${className}`} {...props}>
            {children}
        </Component>
    );
};
