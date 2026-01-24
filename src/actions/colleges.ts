'use server'

import { createClient } from '@/lib/server/supabase'

export interface CollegeFilterParams {
    search?: string;
    region?: string;
    district?: string;
    status?: string;
    university?: string;
    minority?: string;
}

export interface College {
    collegeCode: string;
    collegeName: string;
    status: string | null;
    district: string | null;
    homeUniversity: string | null;
    minority: string | null;
    branches: string[];
}

export async function getColleges(
    page: number = 1,
    limit: number = 15,
    filters: CollegeFilterParams = {}
) {
    const supabase = await createClient();
    const { search, district, status, university, minority } = filters;

    // 1. Build Base Query for CollegeDetails
    let query = supabase
        .from('CollegeDetails')
        .select('*', { count: 'exact' });

    // 2. Apply Filters
    if (search) {
        // Search by name (case-insensitive) or exact code
        const isCode = /^\d+$/.test(search);
        if (isCode) {
            query = query.eq('collegeCode', search);
        } else {
            query = query.ilike('collegeName', `%${search}%`);
        }
    }

    if (district && district !== 'All') query = query.eq('district', district);
    if (status && status !== 'All') query = query.eq('status', status);
    if (university && university !== 'All') query = query.eq('homeUniversity', university);
    if (minority && minority !== 'All') query = query.eq('minority', minority);

    // 3. Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order('collegeCode', { ascending: true }).range(from, to);

    const { data: colleges, count, error } = await query;

    if (error) {
        console.error('Error fetching colleges:', error);
        return { data: [], total: 0, totalPages: 0, error: error.message };
    }

    if (!colleges || colleges.length === 0) {
        return { data: [], total: 0, totalPages: 0 };
    }

    // 4. Fetch Branches for these colleges
    // Use Promise.all to fetch branches for each college independently.
    // This avoids hitting the global row limit when fetching all at once, 
    // as one college might have hundreds of cutoff entries (categories x branches).
    const collegesWithBranches = await Promise.all(colleges.map(async (c: any) => {
        let allBranches: string[] = [];
        let fetchedCount = 0;
        const BATCH_SIZE = 1000;
        let hasMore = true;

        while (hasMore) {
            const { data: branchData, error } = await supabase
                .from('CollegeCutoffList')
                .select('branch')
                .eq('collegeCode', c.collegeCode)
                .range(fetchedCount, fetchedCount + BATCH_SIZE - 1);

            if (error || !branchData || branchData.length === 0) {
                hasMore = false;
            } else {
                allBranches = allBranches.concat(branchData.map((b: any) => b.branch));
                fetchedCount += branchData.length;

                // If we fetched fewer than requested, we've reached the end
                if (branchData.length < BATCH_SIZE) {
                    hasMore = false;
                }
            }
        }

        // Deduplicate branches
        const uniqueBranches = Array.from(new Set(allBranches)).sort();

        return {
            collegeCode: c.collegeCode,
            collegeName: c.collegeName,
            status: c.status,
            district: c.district,
            homeUniversity: c.homeUniversity,
            minority: c.minority,
            branches: uniqueBranches
        };
    }));

    return {
        data: collegesWithBranches,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
    };
}

export async function getFilterOptions() {
    // Helper to get distinct options for dropdowns. 
    // In a real optimized app, these might be hardcoded, cached, or fetched from stats table.
    // For now, we'll fetch unique values.
    const supabase = await createClient();

    // Parallel fetch for filters
    const [districts, universities, statuses] = await Promise.all([
        supabase.rpc('get_distinct_districts'),
        supabase.rpc('get_distinct_universities'), // Assuming RPCs exist or we fallback to raw Select
        // If RPCs don't exist, we might have to just hardcode common MH values or use a heavy select distinct.
        // Let's assume standard values for now or fetching all is too heavy.
        // I'll stick to common constants for the UI to save DB load unless user requested dynamic.
        Promise.resolve(null)
    ]);

    // We will just return null and let the UI use static lists or we can implement real fetch if needed.
    // For this step, I'll define standard MH lists in the component to avoid complex distinct queries on big tables.
    return {};
}
