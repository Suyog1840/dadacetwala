'use server'

import { createClient } from '@/lib/server/supabase'
import { revalidatePath } from 'next/cache'

export async function createNotice(formData: FormData) {
    const supabase = await createClient()

    // 1. Get Current User (Admin Check)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    // Verify Admin Role
    const { data: dbUser } = await supabase
        .from('User')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = dbUser?.role?.toLowerCase();
    if (role !== 'admin' && role !== 'super_admin') {
        return { success: false, error: 'Forbidden: Admins only' }
    }

    // 2. Extract Data
    const title = formData.get('title') as string
    const description = formData.get('message') as string // Input name is 'message' in UI usually, we'll map to description
    const priority = formData.get('type') as string // 'General Update', 'Important', 'Urgent'
    const date = new Date().toISOString().split('T')[0] // current YYYY-MM-DD

    if (!title || !description || !priority) {
        return { success: false, error: 'Missing required fields' }
    }

    // 3. Insert into DB
    const { error } = await supabase
        .from('Notice')
        .insert({
            id: crypto.randomUUID(), // Generate ID manually since DB might not have DEFAULT
            title,
            description,
            priority, // Storing as 'General Update' etc directly or mapping? Schema calls for String.
            date,
            createdBy: user.id
            // seen: false default
        })

    if (error) {
        console.error('Create Notice Error:', error)
        return { success: false, error: 'Failed to create notice' }
    }

    revalidatePath('/admin')
    revalidatePath('/student/dashboard')

    return { success: true }
}

export async function getNotices(limit = 5) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('Notice')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Fetch Notices Error:', error)
        return []
    }

    return data
}
