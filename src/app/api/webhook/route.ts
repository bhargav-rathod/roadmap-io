// qwebhook/route.ts

import { NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';
import prisma from '../../../lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      debugger;
      // Update transaction status
      await prisma.transaction.update({
        where: { id: session.metadata?.transactionId },
        data: { 
          status: 'completed',
          transactionId: session.payment_intent as string,
          paymentMethod: session.payment_method_types[0],
          metadata: session as any
        }
      });

      // Add credits to user

      const updatedUser = await prisma.user.update({
        where: { id: session.metadata?.userId },
        data: { credits: { increment: parseInt(session.metadata?.credits ?? "", 10) || 0 } },
      });
      
      console.log("Updated User: ", updatedUser);

      // await prisma.user.update({
      //   where: { id: session.metadata?.userId },
      //   data: {
      //     credits: {
      //       increment: parseInt(session.metadata?.credits || '0')
      //     }
      //   }
      // });
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  }

  // Handle failed payment
  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      await prisma.transaction.update({
        where: { id: session.metadata?.transactionId },
        data: { status: 'failed' }
      });
    } catch (error) {
      console.error('Failed to update failed transaction:', error);
    }
  }

  return NextResponse.json({ received: true });
}