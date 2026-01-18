import { createClient } from '@/lib/server/supabase'
import { NextResponse } from 'next/server'

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
