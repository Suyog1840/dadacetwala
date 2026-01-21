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
