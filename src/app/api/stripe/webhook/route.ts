import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Processing webhook event:', event.type);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment intent succeeded:', paymentIntent.id);

      // Extract metadata
      const { userId, items, shippingData, shippingCost } = paymentIntent.metadata;
      const parsedItems = JSON.parse(items);
      const parsedShippingData = JSON.parse(shippingData);

      if (!userId) {
        console.error('No user ID found in payment intent metadata');
        return NextResponse.json({ error: 'No user ID found' }, { status: 400 });
      }

      try {
        // Create order first
        const order = await prisma.order.create({
          data: {
            userId,
            status: 'completed',
            total: paymentIntent.amount / 100, // Convert from cents
            paymentIntentId: paymentIntent.id,
            shippingMethod: parsedShippingData.shippingMethod || null,
            shippingCost: parseFloat(shippingCost),
            items: {
              create: parsedItems.map((item: any) => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
        });

        // Create shipping address linked to the order
        await prisma.streetAddress.create({
          data: {
            name: parsedShippingData.name,
            line1: parsedShippingData.line1,
            line2: parsedShippingData.line2 || null,
            city: parsedShippingData.city,
            state: parsedShippingData.state,
            postalCode: parsedShippingData.postalCode,
            country: parsedShippingData.country,
            phone: parsedShippingData.phone,
            email: parsedShippingData.email,
            orderId: order.id,
          },
        });

        console.log('Order created successfully:', order.id);

        // Update product quantities and inStock status
        for (const item of parsedItems) {
          const product = await prisma.product.findUnique({
            where: { id: item.product.id },
          });

          if (product) {
            const newQuantity = Math.max(0, product.quantity - item.quantity);
            await prisma.product.update({
              where: { id: item.product.id },
              data: {
                quantity: newQuantity,
                inStock: newQuantity > 0,
              },
            });
          }
        }

        return NextResponse.json({ received: true, orderId: order.id });
      } catch (err: any) {
        console.error('Error creating order:', err);
        return NextResponse.json(
          { error: 'Failed to create order', details: err.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: err.message },
      { status: 500 }
    );
  }
} 