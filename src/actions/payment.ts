'use server'

import { createClient } from '@/lib/server/supabase'
import { razorpay } from '@/lib/razorpay';
import crypto from 'crypto';

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

export async function createRazorpayOrder(amount: number) {
    try {
        const options = {
            amount: Math.round(amount * 100), // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        return { success: true, orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID };
    } catch (error: any) {
        console.error("Razorpay Order Error:", error);
        return { success: false, error: error.message };
    }
}

export async function verifyRazorpayPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    userId: string;
    amount: number;
}) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = data;

    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature !== razorpay_signature) {
        return { success: false, error: "Payment verification failed. Invalid signature." };
    }

    // Payment is valid, record it
    const supabase = await createClient();

    const { error: paymentError } = await supabase.from('Payment').insert({
        id: crypto.randomUUID(),
        userId: userId,
        amount: amount,
        currency: 'INR',
        paymentStatus: 'SUCCESS',
        transactionId: razorpay_payment_id,
        paidAt: new Date()
    });

    if (paymentError) {
        return { success: false, error: `Payment recorded failed: ${paymentError.message}` };
    }

    // Update User Enrollment Status
    const { error: userUpdateError } = await supabase
        .from('User')
        .update({
            isEnrolled: true,
            enrolledAt: new Date(),
            updatedAt: new Date()
        })
        .eq('id', userId);

    if (userUpdateError) {
        // Critical: User paid but status not updated. Log this!
        console.error("CRITICAL: User paid but enrollment status update failed", userId, userUpdateError);
        return { success: false, error: "Payment successful but enrollment update failed. Please contact support." };
    }

    return { success: true };
}
