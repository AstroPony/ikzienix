import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Path to your service account key JSON file
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();
const auth = admin.auth();

async function syncUsers() {
  let nextPageToken: string | undefined;
  let createdCount = 0;
  let skippedCount = 0;

  do {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    for (const userRecord of listUsersResult.users) {
      const userId = userRecord.uid;
      const userDocRef = db.collection('users').doc(userId);
      const userDoc = await userDocRef.get();
      if (!userDoc.exists) {
        await userDocRef.set({
          id: userId,
          email: userRecord.email || '',
          name: userRecord.displayName || '',
          image: userRecord.photoURL || '',
          role: 'user',
          createdAt: new Date(),
          profileCompleted: false,
        });
        console.log(`Created Firestore doc for user: ${userId}`);
        createdCount++;
      } else {
        skippedCount++;
      }
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  console.log(`Sync complete. Created: ${createdCount}, Skipped (already existed): ${skippedCount}`);
}

syncUsers().catch((err) => {
  console.error('Error syncing users:', err);
  process.exit(1);
}); 