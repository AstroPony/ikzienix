import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const settingsRef = db.collection('settings').doc('global')
    const settingsDoc = await settingsRef.get()

    if (!settingsDoc.exists) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      )
    }

    const settings = {
      id: settingsDoc.id,
      ...settingsDoc.data()
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const settingsRef = db.collection('settings').doc('global')

    // Check if settings exist
    const settingsDoc = await settingsRef.get()
    if (!settingsDoc.exists) {
      // Create new settings
      await settingsRef.set({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } else {
      // Update existing settings
      await settingsRef.update({
        ...data,
        updatedAt: new Date()
      })
    }

    // Get updated settings
    const updatedDoc = await settingsRef.get()
    const settings = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    )
  }
} 