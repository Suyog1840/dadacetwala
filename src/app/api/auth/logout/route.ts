import { createClient } from '@/lib/server/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
}
