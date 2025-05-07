// api/payment/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();

    // Validate input
    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Plan ID and User ID are required' },
        { status: 400 }
      );
    }

    // Fetch user and plan data in parallel
    const [user, plan] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      }),
      prisma.paymentPlan.findUnique({ where: { id: planId } }),
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    if (!plan.active) {
      return NextResponse.json(
        { error: 'This plan is not currently available' },
        { status: 400 }
      );
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: plan.price,
        credits: plan.credits,
        status: 'pending',
        paymentPlanId: plan.id,
        currency: 'INR',
        paymentMethod: 'razorpay',
      },
    });

    console.log(`txn:` + JSON.stringify(transaction));

    // Create Razorpay Order with notes in RECEIPT field
    const options = {
      amount: plan.price * 100,
      currency: 'INR',
      receipt: `${transaction.id}`, // Keep this short (under 40 chars)
      notes: {
        txnId: transaction.id,
        userId: userId,
        credits: plan.credits.toString(),
      },
      
      payment_capture: 1,
    };
    console.log(`notes`+ JSON.stringify(options.notes));

    const order = await razorpay.orders.create(options);
    console.log(`order`+ JSON.stringify(order));


    // Update transaction with Razorpay order ID
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: "ROADMAP.IO",
      description: plan.description || `${plan.name} - ${plan.credits} credits`,
      prefill: {
        name: user.name || 'Customer',
        email: user.email,
      },
      theme: {
        color: '#2563eb', // blue-600
      },
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}