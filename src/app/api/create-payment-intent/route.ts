import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ShippingData } from '@/components/ShippingForm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, shippingData } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (!shippingData) {
      return NextResponse.json({ error: 'Shipping information required' }, { status: 400 });
    }

    // Calculate total amount
    const amount = items.reduce(
      (total: number, item: any) => total + (item.product.price * item.quantity * 100),
      0
    );

    // Add shipping cost
    const shippingCost = shippingData.shippingMethod === 'standard' ? 599 : 1499;
    const totalAmount = amount + shippingCost;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount), // Stripe expects amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        shippingMethod: shippingData.shippingMethod,
        items: JSON.stringify(items.map((item: any) => ({
          id: item.product.id,
          quantity: item.quantity,
        }))),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 