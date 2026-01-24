'use server'

import { createClient } from '@/lib/server/supabase'

export async function getEnrolledStudents() {
    const supabase = await createClient()

    // 1. Verify Admin Access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Parallel Fetch: DB Data + Storage List
    const [dbResponse, storageResponse] = await Promise.all([
        supabase
            .from('User')
            .select(`
                *,
                StudentProfile(*, mentor:MentorProfile(name))
            `)
            .eq('isEnrolled', true)
            .order('enrolledAt', { ascending: false }),

        supabase.storage.from('preference_list').list('', { limit: 1000 })
    ]);

    const { data, error } = dbResponse;
    const { data: fileList } = storageResponse;

    if (error) {
        console.error('Error fetching enrollments:', error)
        return []
    }

    const existingFiles = new Set(fileList?.map(f => f.name));

    // Map data to include preference list URL if file exists
    return data.map((student: any) => {
        const userName = student.userName || student.StudentProfile?.userId || student.studentProfile?.userId;

        const fileName = `${student.userName}.pdf`;
        let preferenceListUrl = null;
        if (existingFiles.has(fileName)) {
            const { data: urlData } = supabase.storage.from('preference_list').getPublicUrl(fileName);
            preferenceListUrl = urlData.publicUrl;
        }

        return {
            ...student,
            preferenceListUrl
        };
    });
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
