import { NextRequest, NextResponse } from 'next/server';
import { auth as clientAuth } from '@/lib/firebase';
import { db } from '@/lib/firebase-admin';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      clientAuth,
      email,
      password
    );

    // Create user document in Firestore
    await db.collection('users').doc(userCredential.user.uid).set({
      name,
      email,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Return user data without sensitive information
    const userData = {
      id: userCredential.user.uid,
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