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
