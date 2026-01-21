'use server'

import { createClient } from '@/lib/server/supabase'

export async function enrollStudentFirstStep(formData: any) {
    const supabase = await createClient()

    // 1. Check if user is already logged in
    const { data: { user: authUser } } = await supabase.auth.getUser();

    // SCENARIO: EXISTING LOGGED IN USER
    if (authUser) {
        const userId = authUser.id;

        // Check availability/status in User table
        const { data: existingUser } = await supabase
            .from('User')
            .select('isEnrolled')
            .eq('id', userId)
            .single();

        if (existingUser?.isEnrolled) {
            return { success: false, error: 'You are already enrolled.' };
        }

        // Update User table (e.g. update contact if changed, but keep identifying info)
        const { error: updateError } = await supabase
            .from('User')
            .update({
                contact: formData.contactNumber,
                updatedAt: new Date()
            })
            .eq('id', userId);

        if (updateError) {
            console.error("Failed to update user:", updateError);
            // Verify if we should block or continue? Proceeding for now.
        }

        // Check if StudentProfile exists
        const { data: existingProfile } = await supabase
            .from('StudentProfile')
            .select('id')
            .eq('userId', userId)
            .single();

        let profileError;

        if (existingProfile) {
            // Update existing profile
            const { error } = await supabase.from('StudentProfile').update({
                name: formData.fullName,
                examType: formData.academicStream,
                category: formData.category,
                homeUniversity: formData.homeUniversity,
                domicileState: 'Maharashtra',
                cetPercentile: parseFloat(formData.mhtcet) || null,
                jeePercentile: parseFloat(formData.jee) || null,
                plan: formData.plan || 'expert'
            }).eq('userId', userId);
            profileError = error;
        } else {
            // Insert new profile
            const { error } = await supabase.from('StudentProfile').insert({
                id: crypto.randomUUID(),
                userId: userId,
                name: formData.fullName,
                examType: formData.academicStream,
                category: formData.category,
                homeUniversity: formData.homeUniversity,
                domicileState: 'Maharashtra',
                cetPercentile: parseFloat(formData.mhtcet) || null,
                jeePercentile: parseFloat(formData.jee) || null,
                plan: formData.plan || 'expert'
            });
            profileError = error;
        }

        if (profileError) {
            return { success: false, error: `Profile update error: ${profileError.message}` };
        }

        return { success: true, userId, isExistingUser: true };
    }

    // SCENARIO: NEW USER OR EXISTING BUT NOT LOGGED IN
    // 2. Try to create auth user with TEMP password
    const tempPassword = `Temp@${Math.random().toString(36).slice(-8)}${Math.floor(Math.random() * 10)}`;

    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
    });

    if (error) {
        // If user already exists but not logged in
        if (error.message.includes("already registered") || error.code === "user_already_exists") {
            return { success: false, error: 'Account already exists. Please log in to complete enrollment.' };
        }
        return { success: false, error: error?.message || 'Unknown error' };
    }

    if (!data.user) {
        return { success: false, error: 'Failed to create account.' };
    }

    const userId = data.user.id;

    const generatedUsername = (formData.fullName || formData.email.split('@')[0])
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_');

    // 3. Insert into User table (New User)
    const { error: userError } = await supabase.from('User').insert({
        id: userId,
        authProviderId: userId,
        userName: generatedUsername,
        email: formData.email,
        contact: formData.contactNumber,
        role: 'student',
        isRegistered: true,
        isEnrolled: false,
        status: 'active',
        updatedAt: new Date()
    });

    if (userError) {
        // Cleanup auth user if possible or just report error
        return { success: false, error: `User table error: ${userError.message}` };
    }

    // 4. Insert StudentProfile
    const { error: profileError } = await supabase.from('StudentProfile').insert({
        id: crypto.randomUUID(),
        userId: userId,
        name: formData.fullName,
        examType: formData.academicStream,
        category: formData.category,
        homeUniversity: formData.homeUniversity,
        domicileState: 'Maharashtra',
        cetPercentile: parseFloat(formData.mhtcet) || null,
        jeePercentile: parseFloat(formData.jee) || null,
        plan: formData.plan || 'expert'
    });

    if (profileError) {
        return { success: false, error: `Profile error: ${profileError.message}` };
    }

    return { success: true, userId, tempPassword, isExistingUser: false };
}
