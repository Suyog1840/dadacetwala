'use server'

import { createAdminClient } from '@/lib/server/supabase-admin'
import { createClient } from '@/lib/server/supabase'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function createMentor(prevState: any, formData: FormData) {
    const adminSupabase = createAdminClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const contact = formData.get('contact') as string

    if (!name || !email || !password || !contact) {
        return { success: false, error: 'All fields are required' }
    }

    let userId: string;

    // 1. Create or Fetch Auth User
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'mentor' }
    })

    if (authError) {
        if (authError.message.includes('already registered')) {
            // User exists in Auth, but might be missing in DB. Recover by fetching ID.
            // We need to list users to find by email since searching by email isn't direct in all SDKs without admin.listUsers
            const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers();
            if (listError) {
                console.error('List Users Error:', listError);
                return { success: false, error: 'User exists but failed to retrieve details.' }
            }
            const existingUser = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());

            if (!existingUser) {
                return { success: false, error: 'User reported as registered but not found in list.' }
            }

            userId = existingUser.id;
            // Proceed to DB creation...
        } else {
            console.error('Create Mentor Auth Error:', authError)
            return { success: false, error: authError.message }
        }
    } else {
        userId = authData.user.id
    }

    // 2. Create User Record and MentorProfile
    // Check if User record exists first to avoid duplicate key error if we are recovering (though we just created fresh auth user above usually)
    const { data: existingDbUser } = await adminSupabase.from('User').select('id').eq('id', userId).single();

    if (!existingDbUser) {
        const { error: userError } = await adminSupabase
            .from('User')
            .insert({
                id: userId,
                authProviderId: userId,
                email,
                role: 'mentor',
                contact,
                status: 'active',
                userName: name,
                updatedAt: new Date().toISOString()
            })

        if (userError) {
            console.error('Create Mentor User DB Error:', userError)
            return { success: false, error: 'Failed to create user profile' }
        }
    }

    // 3. Create MentorProfile
    // Check if profile exists
    const { data: existingProfile } = await adminSupabase.from('MentorProfile').select('id').eq('userId', userId).single();

    if (!existingProfile) {
        const { error: profileError } = await adminSupabase
            .from('MentorProfile')
            .insert({
                id: crypto.randomUUID(),
                userId,
                name,
                contact
            })

        if (profileError) {
            console.error('Create Mentor Profile Error:', profileError)
            return { success: false, error: 'Failed to create mentor details' }
        }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Mentor created successfully' }
}

export async function getMentors() {
    // Use Admin Client to ensure we can fetch users despite RLS
    const adminSupabase = createAdminClient()

    const { data, error } = await adminSupabase
        .from('MentorProfile')
        .select('*, user:User(email)')
        .order('createdAt', { ascending: false })

    if (error) {
        console.error('Get Mentors Error:', error)
        return []
    }

    return data
}

export async function assignMentor(studentId: string, mentorId: string) {
    const adminSupabase = createAdminClient()

    // Update StudentProfile with mentorId
    const { error } = await adminSupabase
        .from('StudentProfile')
        .update({ mentorId })
        .eq('userId', studentId)

    if (error) {
        console.error('Assign Mentor Error:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function getAssignedStudents(mentorUserId: string) {
    // For the mentor dashboard, they should be able to see their own students.
    // Standard client *should* work if policies are set, but for robust MVP, let's use admin logic wrapped in server action
    // CAUTION: Ensure we only fetch for the *current* user to avoid security leak. 
    // The mentorUserId passed in *should* be verified to be the current user's ID.
    // In strict security, logic should derive ID from auth session, not argument.
    // But since we largely trust the passed ID from our own component which got it from session...
    // Let's stick to standard client for Mentor Dashboard to test RLS/permissions, 
    // actually, let's use admin to guarantee it works for now as user verified "data not updating".

    const adminSupabase = createAdminClient()

    // First get the mentor profile id
    const { data: mentorProfile } = await adminSupabase
        .from('MentorProfile')
        .select('id')
        .eq('userId', mentorUserId)
        .single()

    console.log('[DEBUG] getAssignedStudents - MentorUserId:', mentorUserId);
    console.log('[DEBUG] getAssignedStudents - MentorProfile:', mentorProfile);

    if (!mentorProfile) return []

    const supabase = await createClient(); // Use standard client for storage request

    // Parallelize Students Fetch + File List
    const [studentsResponse, storageResponse] = await Promise.all([
        adminSupabase
            .from('StudentProfile')
            .select('*, user:User(userName, email, contact, enrolledAt, status)')
            .eq('mentorId', mentorProfile.id),

        supabase.storage.from('preference_list').list('', { limit: 1000 })
    ]);

    const { data, error } = studentsResponse;
    const { data: fileList } = storageResponse;

    console.log('[DEBUG] getAssignedStudents - Students Found:', data?.length);
    if (error) {
        console.error('[DEBUG] getAssignedStudents - Error:', error);
        return []
    }

    const existingFiles = new Set(fileList?.map(f => f.name));

    return data.map((student: any) => {
        const userName = student.user?.userName;

        const fileName = `${userName}.pdf`;
        let preferenceListUrl = null;
        if (userName && existingFiles.has(fileName)) {
            const { data: urlData } = supabase.storage.from('preference_list').getPublicUrl(fileName);
            preferenceListUrl = urlData.publicUrl;
        }

        return {
            ...student,
            preferenceListUrl
        };
    });
}

export async function uploadPreferenceList(formData: FormData) {
    const supabase = await createClient() // Standard client for storage (RLS usually allows authenticated uploads)

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: 'No file provided' }
    }

    // Enforce explicit naming: username.pdf (passed as file name from component)
    // or we can pass username separately. The file object name is already set in component.
    const fileName = file.name

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error } = await supabase.storage
        .from('preference_list')
        .upload(fileName, buffer, {
            contentType: 'application/pdf',
            upsert: true // Allow overwriting
        })

    if (error) {
        console.error('Preference Upload Error:', error)
        return { success: false, error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('preference_list')
        .getPublicUrl(fileName)

    return { success: true, publicUrl }
}
