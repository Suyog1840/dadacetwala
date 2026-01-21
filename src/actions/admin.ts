'use server'

import { createClient } from '@/lib/server/supabase'

export async function getEnrolledStudents() {
    const supabase = await createClient()

    // 1. Verify Admin Access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Fetch enrolled users with their profiles
    const { data, error } = await supabase
        .from('User')
        .select(`
            *,
            StudentProfile(*)
        `)
        .eq('isEnrolled', true)
        .order('enrolledAt', { ascending: false })

    if (error) {
        console.error('Error fetching enrollments:', error)
        return []
    }

    return data
}

export async function updateCollegeFeesUrl(collegeCode: string, pdfUrl: string) {
    const supabase = await createClient();
    const { revalidatePath } = await import('next/cache');

    const { error } = await supabase
        .from('CollegeDetails')
        .update({ feesPdfUrl: pdfUrl })
        .eq('collegeCode', collegeCode);

    if (error) {
        console.error('Update Fees URL Error:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/student/fees');
    return { success: true };
}
