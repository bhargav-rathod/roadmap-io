import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
  }
  interface Session {
    user: User & {
      id: string;
      credits: number;
      user_role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits: number;
    user_role: string;
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

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            credits: user.credits,
            user_role: user.user_role
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: { 
      token: JWT; 
      user?: User; 
      trigger?: "signIn" | "signUp" | "update"; 
      session?: any 
    }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.credits = user.credits;
        token.user_role = user.user_role;
      }

      // Handle session updates from client-side updates
      if (trigger === "update" && session?.user) {
        token.credits = session.user.credits;
        // Add any other fields you want to update
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.credits = token.credits;
        session.user.user_role = token.user_role;
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
    updateAge: 15, // 5 minutes - how often the session is updated
    maxAge: 60 * 60 * 24 * 7, // 7 days - session max age
  },
};

export default NextAuth(authOptions);