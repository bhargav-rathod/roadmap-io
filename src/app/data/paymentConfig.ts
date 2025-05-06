import prisma from '../../lib/prisma';

export const paymentPlans = [
  {
    id: 'credit_1',
    name: '1 Credit',
    price: 350,
    credits: 1,
    description: 'Basic credit package'
  },
  {
    id: 'credit_5',
    name: '5 Credits',
    price: 1000,
    credits: 5,
    description: 'Small credit package (20% discount)'
  },
  {
    id: 'credit_50',
    name: '50 Credits',
    price: 7000,
    credits: 50,
    description: 'Large credit package (30% discount)'
  }
];

export async function initializePaymentPlans() {
  try {
    for (const plan of paymentPlans) {
      await prisma.paymentPlan.upsert({
        where: { id: plan.id },
        update: plan,
        create: plan
      });
    }
    console.log('Payment plans initialized successfully');
  } catch (error) {
    console.error('Error initializing payment plans:', error);
    throw error;
  }
}