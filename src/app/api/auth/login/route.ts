import { createClient } from '@/lib/server/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const formData = await request.json()
    const { identifier, password } = formData

    const supabase = await createClient()

    let email = identifier

    // Check if identifier is likely a username (no @)
    if (identifier && !identifier.includes('@')) {
        // Try exact match first
        const { data: userExact, error: errorExact } = await supabase
            .from('User')
            .select('email')
            .eq('userName', identifier)
            .single();

        if (userExact) {
            email = userExact.email;
        } else {
            // Try lowercase match
            const { data: userLower, error: errorLower } = await supabase
                .from('User')
                .select('email')
                .eq('userName', identifier.toLowerCase())
                .single();

            if (userLower) {
                email = userLower.email;
            } else {
                return NextResponse.json({ error: 'Username not found' }, { status: 404 });
            }
        }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
}
