import { initializePaymentPlans } from '@/app/data/paymentConfig';
import prisma from '../lib/prisma';

async function main() {
  try {
    await initializePaymentPlans();
    console.log('Payment plans initialized successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();