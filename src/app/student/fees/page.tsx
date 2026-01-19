import React, { Suspense } from 'react';
import { getCollegeFees } from '@/actions/fees';
import FeeCard from '@/components/fees/FeeCard';
import { Button } from '@/components/ui/Button'; // Assuming generic UI components exist
import { Input } from '@/components/ui/Input';   // Assuming generic UI components exist
import Link from 'next/link';

// Search and Filter Component
function SearchBar({ searchParams }: { searchParams: { query?: string } }) {
    return (
        <form action="" method="GET" className="flex gap-2 mb-6">
            <Input
                name="query"
                placeholder="Search by college name or code..."
                defaultValue={searchParams.query || ''}
                className="flex-grow"
            />
            <Button type="submit">Search</Button>
            {searchParams.query && (
                <Link href="/student/fees">
                    <Button variant="outline" type="button">Clear</Button>
                </Link>
            )}
        </form>
    );
}

// Main Page Component
export default async function FeesPage(props: {
    searchParams?: Promise<{ query?: string; page?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const { data: fees, totalPages } = await getCollegeFees(currentPage, query);

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <h1 className="text-2xl font-bold mb-6 text-[#020617]">College Fees Structure</h1>

            <SearchBar searchParams={{ query }} />

            {fees.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No fee structures found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {fees.map((fee) => (
                        <FeeCard key={fee.id} fee={fee} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {currentPage > 1 && (
                        <Link href={`/student/fees?query=${query}&page=${currentPage - 1}`}>
                            <Button variant="outline" size="sm">Previous</Button>
                        </Link>
                    )}
                    <span className="flex items-center px-4 text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    {currentPage < totalPages && (
                        <Link href={`/student/fees?query=${query}&page=${currentPage + 1}`}>
                            <Button variant="outline" size="sm">Next</Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
