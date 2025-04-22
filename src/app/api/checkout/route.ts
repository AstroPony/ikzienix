import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
// You'll need to replace this with your actual secret key from Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    const { items } = await request.json()

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}

function calculateOrderAmount(items: any[]) {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return items.reduce((total, item) => {
    return total + item.price * item.quantity * 100 // Convert to cents
  }, 0)
} 