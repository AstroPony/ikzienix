import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { payment_intent, payment_intent_client_secret } = await req.json();

    if (!payment_intent || !payment_intent_client_secret) {
      return NextResponse.json(
        { error: 'Missing payment information' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    if (paymentIntent.client_secret !== payment_intent_client_secret) {
      return NextResponse.json(
        { error: 'Invalid payment information' },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: paymentIntent.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 