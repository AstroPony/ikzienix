import GoogleProvider from 'next-auth/providers/google'
import { AuthOptions } from 'next-auth'
import { Session } from 'next-auth'

interface ExtendedSession extends Omit<Session, 'user'> {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }): Promise<ExtendedSession> {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.sub || ''
      }
      return session as ExtendedSession
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
} 