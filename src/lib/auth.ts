import { NextAuthOptions } from 'next-auth'
import { auth as adminAuth } from '@/lib/firebase-admin'
import { auth as clientAuth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { db } from '@/lib/firebase-admin'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
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
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const userRef = db.collection('users').doc(user.id)
          const userDoc = await userRef.get()

          if (!userDoc.exists) {
            // Create new user document
            await userRef.set({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: 'user',
              createdAt: new Date(),
              profileCompleted: false
            })
          }
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
} 