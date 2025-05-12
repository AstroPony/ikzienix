import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/lib/firebase-admin';
import { withRateLimit } from '@/lib/rate-limit';

async function handler(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth (Admin SDK)
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name,
    });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Return user data without sensitive information
    const userData = {
      id: userRecord.uid,
      name,
      email,
      role: 'user',
    };

    return NextResponse.json(userData);
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Limit to 3 signup attempts per minute
export const POST = withRateLimit(handler, 3); 