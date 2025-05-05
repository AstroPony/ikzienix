import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderRef = db.collection('orders')
          .where('paymentIntentId', '==', paymentIntent.id)
          .limit(1);

        const orderSnapshot = await orderRef.get();
        if (!orderSnapshot.empty) {
          const orderDoc = orderSnapshot.docs[0];
          await orderDoc.ref.update({
            status: 'paid',
            updatedAt: new Date()
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderRef = db.collection('orders')
          .where('paymentIntentId', '==', paymentIntent.id)
          .limit(1);

        const orderSnapshot = await orderRef.get();
        if (!orderSnapshot.empty) {
          const orderDoc = orderSnapshot.docs[0];
          await orderDoc.ref.update({
            status: 'failed',
            updatedAt: new Date()
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 