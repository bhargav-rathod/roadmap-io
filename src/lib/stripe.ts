// lib/stripe.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe'; // Note: uppercase 'S' in Stripe

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil', // Use latest API version
});