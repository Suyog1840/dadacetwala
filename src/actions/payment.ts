'use server'

import { createClient } from '@/lib/server/supabase'

export async function recordPayment(paymentData: { userId: string, amount: number }) {
    const supabase = await createClient()

    // 1. Insert Payment Record
    const { error: paymentError } = await supabase.from('Payment').insert({
        id: crypto.randomUUID(),
        userId: paymentData.userId,
        amount: paymentData.amount,
        currency: 'INR',
        paymentStatus: 'SUCCESS',
        transactionId: `TXN_${Date.now()}`,
        paidAt: new Date()
    });

    if (paymentError) {
        return { success: false, error: paymentError.message }
    }

    // 2. Update User Enrollment Status
    const { error: userUpdateError } = await supabase
        .from('User')
        .update({
            isEnrolled: true,
            enrolledAt: new Date(),
            updatedAt: new Date()
        })
        .eq('id', paymentData.userId);

    if (userUpdateError) {
        return { success: false, error: userUpdateError.message }
    }

    return { success: true }
}
