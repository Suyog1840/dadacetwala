import React from 'react';
import { Heading } from '@/components/ui/Heading';
import { Subheading } from '@/components/ui/Subheading';
import { CollegeFilters } from '@/components/student/CollegeFilters';
import { CollegeTable } from '@/components/student/CollegeTable';
import { getColleges } from '@/actions/colleges';

export const dynamic = 'force-dynamic';

export default async function CollegesPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const search = searchParams.search as string;
    const district = searchParams.district as string;
    const university = searchParams.university as string;
    const status = searchParams.status as string;

    const { data: colleges, total, totalPages } = await getColleges(page, 15, {
        search,
        district,
        university,
        status
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
                <Heading as="h1">College Directory</Heading>
                <Subheading>
                    Browse through our extensive database of engineering colleges in Maharashtra.
                    Use filters to refine your search.
                </Subheading>
            </div>

            <CollegeFilters />

            <CollegeTable
                colleges={colleges}
                currentPage={page}
                totalPages={totalPages}
            />
        </div>
    );
}
