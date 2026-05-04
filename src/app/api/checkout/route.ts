import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().int(),
    })
  ).min(1),
  shipping: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().default('NL'),
  }),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { items, shipping } = parsed.data;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: { id: true, name: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  const order = await prisma.order.create({
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
          price: i.price,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['ideal', 'card'],
    locale: 'nl',
    customer_email: shipping.email,
    line_items: items.map((i) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: productMap[i.productId] ?? 'ikzienix product' },
        unit_amount: i.price,
      },
      quantity: i.quantity,
    })),
    metadata: { orderId: order.id },
    success_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
    cancel_url: `${baseUrl}/checkout`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
