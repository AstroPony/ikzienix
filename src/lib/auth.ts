import { NextAuthOptions } from 'next-auth'
import { auth as adminAuth } from '@/lib/firebase-admin'
import { auth as clientAuth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { db } from '@/lib/firebase-admin'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'firebase',
      name: 'Firebase',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        try {
          // Get user from Firebase Auth
          const userCredential = await signInWithEmailAndPassword(
            clientAuth,
            credentials.email,
            credentials.password
          )

          // Get additional user data from Firestore
          const userDoc = await db.collection('users').doc(userCredential.user.uid).get()
          const userData = userDoc.data()

          if (!userData) {
            throw new Error('User data not found')
          }

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userData.name,
            role: userData.role,
          }
        } catch (error: any) {
          console.error('Auth error:', error)
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error('Invalid email or password')
          }
          throw new Error('An error occurred during authentication')
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
} 