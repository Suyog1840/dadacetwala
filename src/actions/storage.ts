'use server'

import { createClient } from '@/lib/server/supabase'

export async function uploadFile(formData: FormData, bucket: string, folder: string = '') {
    const supabase = await createClient()

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: 'No file provided' }
    }

    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const fileName = folder ? `${folder}/${timestamp}.${fileExt}` : `${timestamp}.${fileExt}`

    // Convert File to Buffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false
        })

    if (error) {
        console.error('Storage Upload Error:', error)
        return { success: false, error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

    return { success: true, publicUrl }
}

export async function getPreferenceListUrl(userName: string) {
    const supabase = await createClient();

    if (!userName) return null;

    const fileName = `${userName}.pdf`;

    // Generate Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('preference_list')
        .getPublicUrl(fileName);

    const downloadUrl = `${publicUrl}?download=`;

    console.log('[DEBUG] Checking URL availability:', publicUrl);

    try {
        // Check existence on the raw URL (without query params)
        const response = await fetch(publicUrl, { method: 'HEAD', cache: 'no-store' });

        if (response.ok) {
            console.log('[DEBUG] File found via HEAD check');
            return downloadUrl; // Return the version that forces download
        } else {
            console.log('[DEBUG] File not found (Status):', response.status);
            return null;
        }
    } catch (error) {
        console.error('[DEBUG] Access check failed:', error);
        return null;
    }
}
