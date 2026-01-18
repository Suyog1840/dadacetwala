'use server'

import { createClient } from '@/lib/server/supabase'

export async function getCurrentUser() {
    const supabase = await createClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
        return null
    }

    // Fetch expanded profile from User table
    const { data: dbUser } = await supabase
        .from('User')
        .select('*, StudentProfile(*)')
        .eq('id', authUser.id)
        .single()

    return {
        ...authUser,
        ...dbUser, // Merge DB fields like userName, role, etc.
    }
}

export async function finalizeAccount(password: string, username?: string) {
    const supabase = await createClient()

    // Update password
    const { error: authError } = await supabase.auth.updateUser({
        password: password,
    });

    if (authError) {
        return { success: false, error: authError.message }
    }

    // Update username if provided
    if (username) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;

        if (userId) {
            const { error: userError } = await supabase
                .from('User')
                .update({
                    userName: username,
                    updatedAt: new Date()
                })
                .eq('id', userId);

            if (userError) {
                return { success: false, error: `Username update failed: ${userError.message}` }
            }
        }
    }

    return { success: true }
}
