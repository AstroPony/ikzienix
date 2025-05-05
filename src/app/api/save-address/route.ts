import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { address } = await req.json()

    // Save address to user document
    await db.collection('users').doc(session.user.id).update({
      shippingAddress: address,
      updatedAt: new Date()
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error saving address:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save address' },
      { status: 500 }
    )
  }
} 