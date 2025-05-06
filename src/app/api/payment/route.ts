// payment/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { stripe } from '../../../lib/stripe';

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();

    // 1. Fetch user and plan data
    const [user, plan] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true, address: true }
      }),
      prisma.paymentPlan.findUnique({ where: { id: planId } }),
    ]);

    if (!user || !plan) {
      return NextResponse.json({ error: 'Invalid user or plan' }, { status: 400 });
    }

    // 2. Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: plan.price,
        credits: plan.credits,
        status: 'pending',
        paymentPlanId: plan.id,
      },
    });

    // 3. Create Stripe Customer with Address
    const customer = await stripe.customers.create({
      name: user.name || 'Anonymous',
      email: user.email,
      address: {
        line1: user.address?.line1 || 'Not Provided',
        line2: user.address?.line2 || '',
        city: user.address?.city || 'Not Provided',
        state: user.address?.state || 'Not Provided',
        postal_code: user.address?.postalCode || '000000',
        country: 'IN',
      },
      metadata: { userId },
    });

    // 4. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${plan.name} - ${plan.description}`,
          },
          unit_amount: plan.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      billing_address_collection: 'required',
      metadata: {
        userId,
        planId: plan.id,
        credits: plan.credits.toString(),
        transactionId: transaction.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=canceled&session_id={CHECKOUT_SESSION_ID}`,
    });

    // 5. Update transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}