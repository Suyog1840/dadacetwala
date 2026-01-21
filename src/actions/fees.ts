'use server'

import { createClient } from '@/lib/server/supabase'

export interface FeeStructure {
    id: string;
    collegeCode: string;
    collegeName: string;
    pdfUrl: string; // In real app, this comes from Supabase Storage
}

export interface GetFeesResponse {
    data: FeeStructure[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
}

export async function getCollegeFees(
    page: number = 1,
    query: string = ''
): Promise<GetFeesResponse> {
    const supabase = await createClient();
    const ITEMS_PER_PAGE = 12;

    try {
        let queryBuilder = supabase
            .from('CollegeDetails')
            .select('collegeCode, collegeName, feesPdfUrl', { count: 'exact' })
            .not('feesPdfUrl', 'is', null);

        if (query) {
            queryBuilder = queryBuilder.or(`collegeName.ilike.%${query}%,collegeCode.ilike.%${query}%`);
        }

        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error, count } = await queryBuilder
            .range(from, to)
            .order('collegeCode', { ascending: true });

        if (error) {
            console.error('Supabase Error (Fees):', error);
            return { data: [], totalPages: 0, totalItems: 0, currentPage: 1 };
        }

        const formattedData: FeeStructure[] = (data || []).map(item => ({
            id: item.collegeCode, // Use collegeCode as ID since table has no ID
            collegeCode: item.collegeCode,
            collegeName: item.collegeName,
            pdfUrl: item.feesPdfUrl || '#'
        }));

        const totalItems = count || 0;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        return {
            data: formattedData,
            totalPages,
            totalItems,
            currentPage: page
        };

    } catch (error) {
        console.error('Server Error:', error);
        return {
            data: [],
            totalPages: 0,
            totalItems: 0,
            currentPage: 1
        };
    }
}
