import { PrismaClient } from '@prisma/client'

declare global {
  // Allow global `prisma` variable
  var prisma: PrismaClient | undefined
}

// Initialize Prisma Client
const prisma = globalThis.prisma || new PrismaClient()

// Enable hot-reload in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma