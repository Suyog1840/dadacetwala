'use server'

import { createClient } from '@/lib/server/supabase'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function getTimelineEvents() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('TimelineEvent')
        .select('*')
        .order('order', { ascending: true })
        .order('startDate', { ascending: true })

    if (error) {
        console.error('Error fetching timeline events:', error)
        return []
    }
    return data || []
}

export async function createTimelineEvent(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const status = formData.get('status') as string || 'upcoming'

    const { error } = await supabase.from('TimelineEvent').insert({
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
        order: 0,
        updatedAt: new Date().toISOString()
    })

    if (error) {
        console.error('Error creating timeline event:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/timeline')
    revalidatePath('/student/dashboard')
    return { success: true }
}

export async function updateTimelineEvent(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const status = formData.get('status') as string

    const { error } = await supabase
        .from('TimelineEvent')
        .update({
            title,
            description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            status,
            updatedAt: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating timeline event:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/timeline')
    revalidatePath('/student/dashboard')
    return { success: true }
}

export async function deleteTimelineEvent(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('TimelineEvent').delete().eq('id', id)

    if (error) {
        console.error('Error deleting timeline event:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/timeline')
    revalidatePath('/student/dashboard')
    return { success: true }
}



export async function syncTimelineEvents(events: any[]) {
    const supabase = await createClient()

    // 1. Transform events for DB
    const dbEvents = events.map(e => {
        // Determine ID: Use existing valid UUID, or generate a new one
        let id = e.id;
        if (!id || typeof id === 'number' || (typeof id === 'string' && id.startsWith('temp'))) {
            id = crypto.randomUUID();
        }

        return {
            id,
            title: e.title,
            status: e.status,
            startDate: e.startDate, // Expecting ISO string or Date object
            endDate: e.endDate, // Expecting ISO string or Date object
            order: e.order,
            description: e.description || '',
            updatedAt: new Date().toISOString()
        };
    });

    // 2. Delete events not in the list
    // Get all current IDs from DB
    const { data: existingEvents } = await supabase.from('TimelineEvent').select('id');
    if (existingEvents) {
        const incomingIds = new Set(dbEvents.map(e => e.id));
        const idsToDelete = existingEvents
            .map(e => e.id)
            .filter(id => !incomingIds.has(id));

        if (idsToDelete.length > 0) {
            const { error: deleteError } = await supabase
                .from('TimelineEvent')
                .delete()
                .in('id', idsToDelete);

            if (deleteError) {
                console.error('Error deleting orphaned timeline events:', deleteError);
                return { success: false, error: deleteError.message };
            }
        }
    }

    // 3. Upsert (Insert/Update) the current list
    const { error } = await supabase
        .from('TimelineEvent')
        .upsert(dbEvents, { onConflict: 'id' })

    if (error) {
        console.error('Error syncing timeline:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/timeline')
    revalidatePath('/student/dashboard')
    return { success: true }
}
