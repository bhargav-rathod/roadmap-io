// api/webhook/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text();
  console.log(`body:` + JSON.stringify(body));
  const signature = req.headers.get('x-razorpay-signature') || '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const payload = JSON.parse(body);
    const payment = payload.payload?.payment?.entity;

    // Extract metadata from payment.notes (not receipt)
    const metadata = {
      txnId: payment.notes?.txnId,
      userId: payment.notes?.userId,
      credits: parseInt(payment.notes?.credits || '0', 10),
    };

    if (!metadata.txnId || !metadata.userId || isNaN(metadata.credits)) {
      console.error('Invalid or missing metadata in notes:', payment.notes);
      throw new Error('Invalid metadata in payment notes');
    }

    console.log('Processing payment with metadata:', metadata);

    switch (payload.event) {
      case 'payment.captured': {
        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: metadata.txnId },
            data: {
              status: 'completed',
              transactionId: payment.id,
              paymentMethod: payment.method,
              metadata: payment,
            },
          }),
          prisma.user.update({
            where: { id: metadata.userId },
            data: {
              credits: {
                increment: metadata.credits,
              },
            },
          }),
        ]);
        break;
      }

      case 'payment.failed': {
        await prisma.transaction.update({
          where: { id: metadata.txnId },
          data: {
            status: 'failed',
            metadata: payment,
          },
        });
        break;
      }

      default:
        console.log('Unhandled event:', payload.event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Processing failed' },
      { status: 500 }
    );
  }
}
