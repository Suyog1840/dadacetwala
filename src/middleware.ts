import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Free public resources — no login required
    const freeRoutes = ['/student/fees', '/student/colleges', '/student/documents']
    const isFreeRoute = freeRoutes.some(route => request.nextUrl.pathname.startsWith(route))

    // 1. Redirect if not logged in
    if (!user && !isFreeRoute && (request.nextUrl.pathname.startsWith('/student') || request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/mentor'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Role-based protection
    if (user) {
        // Fetch user metadata/role from DB (since it's not always in JWT)
        const { data: dbUser } = await supabase
            .from('User')
            .select('role, isEnrolled')
            .eq('id', user.id)
            .single()

        const role = dbUser?.role?.toLowerCase() || user.user_metadata?.role?.toLowerCase();
        const isEnrolled = dbUser?.isEnrolled;
        const path = request.nextUrl.pathname;

        // Admin Route Protection
        if (path.startsWith('/admin')) {
            if (role !== 'admin' && role !== 'super_admin') {
                return NextResponse.redirect(new URL('/', request.url)) // Unauthorized -> Home
            }
        }

        // Mentor Route Protection
        if (path.startsWith('/mentor')) {
            if (role !== 'mentor') {
                return NextResponse.redirect(new URL('/', request.url)) // Unauthorized -> Home
            }
        }

        // Student Dashboard Protection
        if (path.startsWith('/student/dashboard')) {
            if (!isEnrolled) {
                return NextResponse.redirect(new URL('/', request.url)) // Unenrolled -> Home
            }
        }

        // Allow free routes even for unenrolled users
        if (isFreeRoute) {
            return response
        }
    }

    return response
}

export const config = {
    matcher: ['/student/:path*', '/admin/:path*', '/mentor/:path*'],
}
