import { PrismaClient } from '@prisma/client'

declare module '@prisma/client' {
  interface PrismaClient {
    company: typeof PrismaClient.prototype.company
    role: typeof PrismaClient.prototype.role
    roadmap: typeof PrismaClient.prototype.roadmap
    country: typeof PrismaClient.prototype.country
    transaction: typeof PrismaClient.prototype.transaction
    paymentPlan: typeof PrismaClient.prototype.paymentPlan
  }
}