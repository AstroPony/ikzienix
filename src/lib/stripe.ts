import { loadStripe } from '@stripe/stripe-js'

// This is a public key that can be safely exposed in the client
// You'll need to replace this with your actual publishable key from Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default stripePromise 