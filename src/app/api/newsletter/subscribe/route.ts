import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { withRateLimit } from '@/lib/rate-limit'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function handler(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if email is already subscribed
    const subscribersRef = collection(db, 'newsletter_subscribers')
    const existingSubscriber = await getDocs(
      query(subscribersRef, where('email', '==', email))
    )

    if (!existingSubscriber.empty) {
      return NextResponse.json(
        { error: 'Email is already subscribed' },
        { status: 400 }
      )
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID()

    // Add subscriber to database
    await addDoc(subscribersRef, {
      email,
      confirmationToken,
      isConfirmed: false,
      createdAt: new Date().toISOString(),
    })

    // Send confirmation email
    await resend.emails.send({
      from: 'Ikzienix <newsletter@ikzienix.com>',
      to: email,
      subject: 'Confirm your newsletter subscription',
      html: `
        <h1>Welcome to Ikzienix Newsletter!</h1>
        <p>Thank you for subscribing to our newsletter. Please click the button below to confirm your subscription:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/newsletter/confirm?token=${confirmationToken}" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Confirm Subscription
        </a>
        <p>If you didn't request this subscription, you can safely ignore this email.</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

// Rate limit: 3 subscription attempts per hour
export const POST = withRateLimit(handler, 3) 