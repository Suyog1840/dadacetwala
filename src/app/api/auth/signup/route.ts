import { createClient } from '@/lib/server/supabase'
import { NextResponse } from 'next/server'
import { User } from '@supabase/supabase-js'

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const formData = await request.json()
    const email = formData.email
    const password = formData.password
    const fullName = formData.fullName // simplified for initial signup if needed, or just auth
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                contact: formData.contact
            }
        }
    })

    if (error) {
        // Handle "Orphan User" scenario caused by Database Reset
        if (error.message.includes("already registered") || error.code === "user_already_exists") {
            try {
                // Dynamically import to avoid edge runtime issues if any (though route.ts is nodejs usually)
                const { createAdminClient } = await import('@/lib/server/supabase-admin');
                const adminClient = createAdminClient();

                // 1. Find the auth user ID
                const { data, error: listError } = await adminClient.auth.admin.listUsers();
                if (listError || !data) throw listError;

                const users = data.users as User[];
                const existingAuthUser = users.find(u => u.email === email);

                if (existingAuthUser) {
                    // 2. Check if they exist in our local DB
                    const { data: dbUser } = await supabase
                        .from('User')
                        .select('id')
                        .eq('id', existingAuthUser.id)
                        .single();

                    // 3. If missing in DB, delete the stale Auth user
                    if (!dbUser) {
                        console.log('Found orphan auth user during register, deleting:', existingAuthUser.id);
                        const { error: deleteError } = await adminClient.auth.admin.deleteUser(existingAuthUser.id);

                        if (deleteError) {
                            console.error("Cleanup failed:", deleteError);
                            return NextResponse.json({ error: 'System sync error. Please try again.' }, { status: 500 });
                        }

                        // 4. Tell user to retry (clean state now)
                        return NextResponse.json({ error: 'Account synced with new database. Please click "Register" again.' }, { status: 400 });
                    }
                }
            } catch (err) {
                console.error("Orphan recovery error:", err);
            }
        }

        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create User record
    const generatedUsername = (formData.full_name || fullName || email.split('@')[0])
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_');

    const { error: userError } = await supabase.from('User').insert({
        id: data.user.id,
        authProviderId: data.user.id,
        email: email,
        userName: generatedUsername,
        contact: formData.contact,
        role: 'student', // Default role
        isRegistered: true,
        isEnrolled: false,
        status: 'active',
        updatedAt: new Date()
    });

    if (userError) {
        console.error("User creation failed:", userError);
        // Note: In production, you might want to rollback auth user here
        return NextResponse.json({ error: 'Account created but profile setup failed. Please contact support.' }, { status: 500 })
    }


    return NextResponse.json({ success: true, user: data.user }, { status: 200 })
}
