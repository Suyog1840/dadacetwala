import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
    initialValue?: string;
}

export const SearchInput = ({ onSearch, placeholder = "Search...", className = "", initialValue = "" }: SearchInputProps) => {
    const [value, setValue] = useState(initialValue);
    const debouncedValue = useDebounce(value, 300);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="h-8 pl-8 pr-3 text-[9px] font-bold bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 w-full transition-all placeholder:text-gray-400"
            />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
        </div>
    );
};
