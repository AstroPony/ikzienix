import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { payment_intent, payment_intent_client_secret } = await req.json();
    console.log('Verifying payment:', { payment_intent, payment_intent_client_secret });

    if (!payment_intent || !payment_intent_client_secret) {
      console.error('Missing payment information');
      return NextResponse.json(
        { error: 'Missing payment information' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
    console.log('Retrieved payment intent:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata
    });

    if (paymentIntent.client_secret !== payment_intent_client_secret) {
      console.error('Invalid payment information - client secret mismatch');
      return NextResponse.json(
        { error: 'Invalid payment information' },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: paymentIntent.status });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 