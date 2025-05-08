import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// Export all NextAuth.js routes
export { handler as GET, handler as POST }; 