import { NextRequest, NextResponse } from 'next/server'
import { db, auth } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userDoc = await db.collection('users').doc(params.id).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = userDoc.data()
    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }

    const user = {
      id: userDoc.id,
      ...userData
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, email, role } = await req.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUserQuery = await db.collection('users')
        .where('email', '==', email)
        .get()

      const existingUser = existingUserQuery.docs.find(doc => doc.id !== params.id)
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already taken' },
          { status: 400 }
        )
      }
    }

    // Update user in Firebase Auth
    await auth.updateUser(params.id, {
      email,
      displayName: name
    })

    // Update user document in Firestore
    await db.collection('users').doc(params.id).update({
      name,
      email,
      role: role || 'user',
      updatedAt: new Date()
    })

    const updatedUserDoc = await db.collection('users').doc(params.id).get()
    const userData = updatedUserDoc.data()
    if (!userData) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    const user = {
      id: updatedUserDoc.id,
      ...userData
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user exists
    const userDoc = await db.collection('users').doc(params.id).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if this is the last admin
    const userData = userDoc.data()
    if (userData?.role === 'admin') {
      const adminCount = await db.collection('users')
        .where('role', '==', 'admin')
        .count()
        .get()

      if (adminCount.data().count <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin user' },
          { status: 400 }
        )
      }
    }

    // Delete user from Firebase Auth
    await auth.deleteUser(params.id)

    // Delete user document from Firestore
    await db.collection('users').doc(params.id).delete()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
} 