'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [term, setTerm] = useState(searchParams.get('query')?.toString() || '');
    const debouncedTerm = useDebounce(term, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const currentQuery = params.get('query') || '';

        if (currentQuery === debouncedTerm) {
            return;
        }

        params.set('page', '1');

        if (debouncedTerm) {
            params.set('query', debouncedTerm);
        } else {
            params.delete('query');
        }

        replace(`${pathname}?${params.toString()}`);
    }, [debouncedTerm, pathname, replace]);

    const handleClear = () => {
        setTerm('');
    };

    return (
        <div className="flex gap-2 mb-6">
            <Input
                placeholder="Search by college name or code..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="flex-grow"
            />
            {term && (
                <Button variant="outline" onClick={handleClear} type="button">
                    Clear
                </Button>
            )}
        </div>
    );
}
