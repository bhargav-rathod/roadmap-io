import NextAuth from 'next-auth';
import { authOptions } from '@/auth';

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async jwt(params) {
      try {
        return await authOptions.callbacks!.jwt!(params);
      } catch (error) {
        console.error('JWT callback error:', error);
        throw error; // This will trigger the signOut process
      }
    }
  }
});

export { handler as GET, handler as POST };