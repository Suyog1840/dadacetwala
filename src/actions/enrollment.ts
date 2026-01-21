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
                plan: formData.plan || 'expert',
                familyIncome: formData.familyIncome || null
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
                plan: formData.plan || 'expert',
                familyIncome: formData.familyIncome || null
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
        console.log("DEBUG: SignUp Error:", JSON.stringify(error, null, 2));
        console.log("DEBUG: SignUp Error Message:", error.message);
        console.log("DEBUG: SignUp Error Code:", error.code);

        // If user already exists but not logged in
        if (error.message.includes("already registered") || error.code === "user_already_exists") {
            // Check if this is an "orphan" user (exists in Auth but missing in DB due to reset)
            try {
                const { createAdminClient } = await import('@/lib/server/supabase-admin');
                const adminClient = createAdminClient();
                const { data: { users }, error: adminError } = await adminClient.auth.admin.listUsers();

                if (users && users.length > 0) {
                    const existingAuthUser = users.find((u: { email?: string }) => u.email === (formData.email as string));

                    if (existingAuthUser) {
                        // Check if they exist in our User table
                        const { data: dbUser } = await supabase
                            .from('User')
                            .select('id')
                            .eq('id', existingAuthUser.id)
                            .single();

                        // If they don't exist in DB, we must have reset the DB. Re-create them!
                        if (!dbUser) {
                            console.log('Found orphan auth user, recreating DB record:', existingAuthUser.id);
                            // Proceed to create the DB record using the EXISTING auth ID
                            const userId = existingAuthUser.id;
                            const generatedUsername = (formData.fullName || formData.email.split('@')[0])
                                .toLowerCase()
                                .trim()
                                .replace(/\s+/g, '_');

                            // Insert into User table
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
                                return { success: false, error: `Recovery failed: ${userError.message}` };
                            }

                            // Insert StudentProfile
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
                                plan: formData.plan || 'expert',
                                familyIncome: formData.familyIncome || null
                            });

                            if (profileError) {
                                return { success: false, error: `Profile creation failed: ${profileError.message}` };
                            }

                            // Success! Return success as if new user
                            return { success: true, userId, isExistingUser: false, recovered: true };
                        }
                    }
                }
            } catch (recoveryError) {
                console.error('Error attempting to recover orphan user:', recoveryError);
            }

            return { success: false, error: 'Account already exists. Please log in to complete enrollment.' };
        }
        return { success: false, error: error?.message || `Unknown error: ${JSON.stringify(error)}` };
    }

    if (!data.user) {
        return { success: false, error: 'Failed to create account.' };
    }

    const userId = data.user.id;

    // Generate base username
    let baseUsername = (formData.fullName || formData.email.split('@')[0])
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '') // Remove all spaces
        .replace(/[^a-z0-9_]/g, ''); // Keep only alphanumeric and underscore

    let generatedUsername = baseUsername;
    let isUnique = false;
    let attempts = 0;

    // Loop to ensure uniqueness
    while (!isUnique && attempts < 5) {
        const { data: existingUser } = await supabase
            .from('User')
            .select('id')
            .eq('userName', generatedUsername)
            .single();

        if (!existingUser) {
            isUnique = true;
        } else {
            // Append random 3 digit number
            generatedUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
            attempts++;
        }
    }

    if (!isUnique) {
        // Fallback to random string if all else fails
        generatedUsername = `${baseUsername}_${crypto.randomUUID().slice(0, 4)}`;
    }

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
        plan: formData.plan || 'expert',
        familyIncome: formData.familyIncome || null
    });

    if (profileError) {
        return { success: false, error: `Profile error: ${profileError.message}` };
    }

    return { success: true, userId, tempPassword, isExistingUser: false };
}
