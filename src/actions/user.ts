'use server'

import { createClient } from '@/lib/server/supabase'

export async function getCurrentUser() {
    const supabase = await createClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
        console.log('getCurrentUser: No auth user found');
        return null
    }

    console.log('getCurrentUser: Found auth user', authUser.id);

    // Fetch expanded profile from User table
    const { data: dbUser, error } = await supabase
        .from('User')
        .select('*, StudentProfile(*, mentor:MentorProfile(*))')
        .eq('id', authUser.id)
        .single()

    if (error) {
        console.error('getCurrentUser: Error fetching DB user', error);
    } else {
        console.log('getCurrentUser: Found DB user role:', dbUser?.role);
    }

    if (!dbUser) {
        return {
            ...authUser,
            role: authUser.user_metadata?.role || null // Fallback to metadata
        };
    }

    return {
        ...authUser,
        ...dbUser, // Merge DB fields like userName, role, etc.
        role: dbUser.role || authUser.user_metadata?.role // Prefer DB but fallback to metadata
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
        const sanitizedUsername = username.toLowerCase().trim().replace(/\s+/g, '');

        if (sanitizedUsername.length < 3) {
            return { success: false, error: 'Username must be at least 3 characters long.' }
        }

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;

        if (userId) {
            // Check uniqueness
            const { data: existingUser } = await supabase
                .from('User')
                .select('id')
                .eq('userName', sanitizedUsername)
                .neq('id', userId) // Exclude self
                .single();

            if (existingUser) {
                return { success: false, error: 'Username is already taken.' }
            }

            const { error: userError } = await supabase
                .from('User')
                .update({
                    userName: sanitizedUsername,
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
