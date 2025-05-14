import { NextRequest, NextResponse } from 'next/server'
import { db, auth } from '@/lib/firebase-admin'
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

    const usersRef = db.collection('users')
    const snapshot = await usersRef.get()
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(users)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    console.error('Error fetching users:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUserQuery = await db.collection('users')
      .where('email', '==', email)
      .get()

    if (!existingUserQuery.empty) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    })

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role: role || 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const user = {
      id: userRecord.uid,
      name,
      email,
      role: role || 'user'
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
} 