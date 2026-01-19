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
    const ITEMS_PER_PAGE = 12; // Lowering slightly for better grid layout (4x3)

    try {
        // Step 1: Fetch ALL matching college codes (lightweight)
        let queryBuilder = supabase
            .from('CollegeAdmission')
            .select('collegeCode, collegeName');

        if (query) {
            queryBuilder = queryBuilder.or(`collegeName.ilike.%${query}%,collegeCode.ilike.%${query}%`);
        }

        const { data: allRows, error: fetchError } = await queryBuilder;

        if (fetchError) {
            console.error('Supabase Error (Fetch All):', fetchError);
            return { data: [], totalPages: 0, totalItems: 0, currentPage: 1 };
        }

        // Step 2: Client-side deduplication of ALL codes
        // We use a Map to keep the first occurrence's name if needed, or just Set for codes
        const uniqueCollgeMap = new Map();
        allRows?.forEach((row: any) => {
            if (!uniqueCollgeMap.has(row.collegeCode)) {
                uniqueCollgeMap.set(row.collegeCode, row);
            }
        });

        const allUniqueCodes = Array.from(uniqueCollgeMap.keys());
        const totalItems = allUniqueCodes.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        // Step 3: Slice for current page
        // Ensure page is valid
        const validPage = Math.max(1, Math.min(page, totalPages || 1));
        const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageCodes = allUniqueCodes.slice(startIndex, endIndex);

        if (pageCodes.length === 0) {
            return { data: [], totalPages, totalItems, currentPage: validPage };
        }

        // Step 4: Fetch details for these specific codes
        // We need to fetch enough rows to fill the data, then keys match again
        const { data: pageData, error: detailsError } = await supabase
            .from('CollegeAdmission')
            .select('id, collegeCode, collegeName, feePdfUrl')
            .in('collegeCode', pageCodes);

        if (detailsError) {
            console.error('Supabase Error (Details):', detailsError);
            return { data: [], totalPages, totalItems, currentPage: validPage };
        }

        // Step 5: Map back to ensure unique list (database might return multiple rows per code again)
        const finalDataMap = new Map();
        // Initialize with keys to preserve order of sliced pageCodes
        pageCodes.forEach(code => finalDataMap.set(code, null));

        pageData?.forEach((item: any) => {
            // Only set if not already set (or overwrite if we prefer)
            // We want one entry per code
            if (finalDataMap.has(item.collegeCode) && finalDataMap.get(item.collegeCode) === null) {
                finalDataMap.set(item.collegeCode, {
                    id: item.id,
                    collegeCode: item.collegeCode,
                    collegeName: item.collegeName,
                    pdfUrl: item.feePdfUrl || '#'
                });
            }
        });

        const formattedData = Array.from(finalDataMap.values()).filter(item => item !== null) as FeeStructure[];

        return {
            data: formattedData,
            totalPages,
            totalItems,
            currentPage: validPage
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
