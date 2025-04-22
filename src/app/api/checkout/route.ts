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

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Error creating payment intent' },
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