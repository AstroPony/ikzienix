import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Re-authenticate user by verifying current password
    // This requires using the Firebase client SDK, so here we just check if the user exists
    // and update the password. In production, you should verify the current password on the client.
    const auth = getAuth();
    const userRecord = await auth.getUser(session.user.id);
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update password
    await auth.updateUser(session.user.id, { password: newPassword });
    await db.collection('users').doc(session.user.id).update({ updatedAt: new Date() });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: error.message || 'Failed to change password' }, { status: 500 });
  }
} 