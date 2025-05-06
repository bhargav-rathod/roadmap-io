// auth.ts (root level)

import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LinkedInProvider from "next-auth/providers/linkedin";
import prisma from "./src/lib/prisma";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

// Extend the User type to include your custom fields
declare module "next-auth" {
  interface User {
    id: string;
    credits: number;
    user_role: string;
    sessionToken: string | null;
    verified?: boolean;
  }
  interface Session {
    user: User & {
      id: string;
      credits: number;
      user_role: string;
      sessionToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits: number;
    user_role: string;
    sessionToken: string;
    lastActive: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          // Check if email is verified
          if (!user.verified) {
            throw new Error("Email not verified");
          }

          // Generate new session token
          const sessionToken = require('crypto').randomBytes(32).toString('hex');
          const lastActive = Math.floor(Date.now() / 1000);

          // Update user with new session token
          await prisma.user.update({
            where: { id: user.id },
            data: {
              sessionToken,
              lastActive: new Date(lastActive * 1000)
            }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            credits: user.credits,
            user_role: user.user_role,
            sessionToken
          };
        } catch (error) {
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // }),
    // LinkedInProvider({
    //   clientId: process.env.LINKEDIN_CLIENT_ID!,
    //   clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    //   authorization: {
    //     params: { scope: 'openid profile email' },
    //   },
    //   issuer: 'https://www.linkedin.com',
    //   jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.picture,
    //     };
    //   },
    // })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle social sign in
      if (account?.provider !== 'credentials') {
        // Check if user exists in your database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email?.toLowerCase() },
        });

        if (existingUser) {
          // If user exists but signed up with credentials, don't allow social login
          if (existingUser.password) {
            throw new Error('This email is already registered with email/password. Please sign in that way.');
          }
          
          // Update user with new session token
          const sessionToken = require('crypto').randomBytes(32).toString('hex');
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              sessionToken,
              lastActive: new Date()
            }
          });
          
          user.id = existingUser.id;
          user.credits = existingUser.credits;
          user.user_role = existingUser.user_role;
          user.sessionToken = sessionToken;
        } else {
          // Create new user for social login
          const newUser = await prisma.user.create({
            data: {
              email: user.email!.toLowerCase(),
              name: user.name || profile?.name || '',
              verified: true, // Social logins are automatically verified
              credits: 0, // Default credits
              user_role: 'user', // Default role
              sessionToken: require('crypto').randomBytes(32).toString('hex'),
              lastActive: new Date()
            }
          });
          
          user.id = newUser.id;
          user.credits = newUser.credits;
          user.user_role = newUser.user_role;
          user.sessionToken = newUser.sessionToken;
        }
      }
      
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.credits = user.credits;
        token.user_role = user.user_role;
        token.sessionToken = user.sessionToken!;
        token.lastActive = Math.floor(Date.now() / 1000);
      }

      // Handle session updates from client-side updates
      if (trigger === "update" && session?.user) {
        token.credits = session.user.credits;
        // Update last active time on any update
        token.lastActive = Math.floor(Date.now() / 1000);
      }

      // Check session validity
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            sessionToken: true,
            lastActive: true
          }
        });

        // If session token doesn't match or user not found, invalidate session
        if (!dbUser || dbUser.sessionToken !== token.sessionToken) {
          throw new Error("Session invalid");
        }

        // Check inactivity (10 minutes)
        const currentTime = Math.floor(Date.now() / 1000);
        const lastActive = dbUser.lastActive ? Math.floor(dbUser.lastActive.getTime() / 1000) : 0;
        
        if (currentTime - lastActive > 600) { // 10 minutes in seconds
          // Invalidate session in database
          await prisma.user.update({
            where: { id: token.id },
            data: {
              sessionToken: null,
              lastActive: null
            }
          });
          throw new Error("Session expired due to inactivity");
        }

        // Update last active time in database if more than 1 minute has passed
        if (currentTime - lastActive > 60) {
          await prisma.user.update({
            where: { id: token.id },
            data: {
              lastActive: new Date()
            }
          });
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.credits = token.credits;
        session.user.user_role = token.user_role;
        session.user.sessionToken = token.sessionToken;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    updateAge: 60, // 1 minute - how often the session is updated
    maxAge: 60 * 60 * 24 * 7, // 7 days - session max age
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await prisma.user.update({
          where: { id: token.id as string },
          data: {
            sessionToken: null,
            lastActive: null
          }
        });
      }
    }
  }
};

export default NextAuth(authOptions);