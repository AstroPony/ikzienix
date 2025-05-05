import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/lib/firebase-admin';

interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function POST(req: NextRequest) {
  try {
    const { 
      name, 
      email, 
      password,
      phone,
      shippingAddress,
      billingAddress,
    } = await req.json();

    if (!name || !email || !password || !phone || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone.startsWith('+') ? phone : `+${phone}`,
    });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      phone,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'customer',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error creating user:', error);
    let message = error.message || 'Signup failed';
    if (error.code === 'auth/email-already-exists') {
      message = 'Email is already in use';
    } else if (error.code === 'auth/invalid-phone-number') {
      message = 'Invalid phone number format';
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 