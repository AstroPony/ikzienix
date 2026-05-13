import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1).max(10),
    })
  ).min(1).max(25),
  shipping: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email(),
    address: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    postalCode: z.string().min(4).max(10),
    country: z.string().length(2).default('NL'),
  }),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { items, shipping } = parsed.data;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  // Fetch authoritative prices and stock from DB — never trust client-supplied prices
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: 'One or more products not found' }, { status: 400 });
  }

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  // Validate stock for each item
  for (const item of items) {
    const product = productMap[item.productId];
    if (!product) {
      return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 409 });
    }
  }

  const total = items.reduce((sum, i) => sum + productMap[i.productId].price * i.quantity, 0);

  // Create order and Stripe session atomically — roll back order if Stripe fails
  let order;
  try {
    order = await prisma.order.create({
      data: {
        email: shipping.email,
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        address: shipping.address,
        city: shipping.city,
        postalCode: shipping.postalCode,
        country: shipping.country,
        total,
        status: 'PENDING',
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: productMap[i.productId].price, // DB price, not client price
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'nl',
      customer_email: shipping.email,
      line_items: items.map((i) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: productMap[i.productId].name },
          unit_amount: productMap[i.productId].price, // DB price
        },
        quantity: i.quantity,
      })),
      payment_intent_data: {
        // Overrides account name on customer's bank/card statement
        statement_descriptor: 'IKZIENIX',
      },
      metadata: { orderId: order.id },
      success_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (e) {
    if (order) {
      await prisma.order.delete({ where: { id: order.id } }).catch(() => null);
    }
    console.error('[checkout] Failed:', e);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
