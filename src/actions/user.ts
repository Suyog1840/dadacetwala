'use server'

import { createClient } from '@/lib/server/supabase'

export async function getCurrentUser() {
    const supabase = await createClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
        return null
    }

    // Fetch expanded profile from User table
    const { data: dbUser, error } = await supabase
        .from('User')
        .select('*, StudentProfile(*, mentor:MentorProfile(*))')
        .eq('id', authUser.id)
        .single()

    if (error) {
        console.error('getCurrentUser: Error fetching DB user', error);
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

export async function finalizeAccount(password: string, username?: string, tempEmail?: string, tempPassword?: string) {
    console.log('[DEBUG] finalizeAccount: Started', { hasPassword: !!password, username, hasTempCreds: !!(tempEmail && tempPassword) });
    const supabase = await createClient()

    // 1. Ensure we are authenticated
    let sessionUser = null;
    const { data: { user } } = await supabase.auth.getUser();
    sessionUser = user;

    if (!sessionUser) {
        console.log('[DEBUG] finalizeAccount: No active session found.');
        if (tempEmail && tempPassword) {
            console.log('[DEBUG] finalizeAccount: Attempting internal sign-in with temp creds...');
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: tempEmail,
                password: tempPassword
            });

            if (signInError) {
                return { success: false, error: `Internal Auth Failed: ${signInError.message}` };
            }
            console.log('[DEBUG] finalizeAccount: Internal sign-in successful.');

            // Refresh user after sign in
            const { data: { user: newUser } } = await supabase.auth.getUser();
            sessionUser = newUser;
        } else {
            return { success: false, error: 'Session expired. Please refresh and try logging in.' };
        }
    }

    if (!sessionUser) {
        return { success: false, error: 'Authentication failed.' };
    }

    const userId = sessionUser.id;

    // Update password
    console.log('[DEBUG] finalizeAccount: Updating password...');
    const { error: authError } = await supabase.auth.updateUser({
        password: password,
        data: { is_setup_complete: true }
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
                updatedAt: new Date(),
                isRegistered: true
            })
            .eq('id', userId);

        if (userError) {
            return { success: false, error: `Username update failed: ${userError.message}` }
        }
    }

    return { success: true }
}
