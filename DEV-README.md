# 1. First, reset the database completely (this will DROP all tables)
npx prisma migrate reset --force

# 2. Create and apply fresh migrations
npx prisma migrate dev --name init

# 3. Seed your database with initial data
npx prisma db seed

# 4. Generate Prisma Client
npx prisma generate

# 5. Start your application
npm run dev

# 1. First, reset the database completely (this will DROP all tables)
npx prisma migrate reset --force

# 2. Create and apply fresh migrations
npx prisma migrate dev --name init

# 3. Seed your database with initial data
npx prisma db seed

# 4. Generate Prisma Client
npx prisma generate

# 5. Start your application
npm run dev

npx prisma migrate reset --force
npx prisma migrate dev --name init
npx prisma db seed
npx ts-node prisma/seed.ts

-- npx tsx src/scripts/initializePaymentPlans.ts
# cloud providers (Third party logins)

To set up the social providers, you'll need to create developer accounts with each platform and get the required client IDs and secrets. Each platform has slightly different setup processes:

Google: Go to Google Cloud Console (https://console.cloud.google.com/)

Facebook: Use Facebook Developers (https://developers.facebook.com/)

LinkedIn: Use LinkedIn Developers (https://developer.linkedin.com/)

Make sure to configure the redirect URIs in each provider's settings to include:

http://localhost:3000/api/auth/callback/google (development)

http://localhost:3000/api/auth/callback/facebook (development)

http://localhost:3000/api/auth/callback/linkedin (development)

And your production domain equivalents

# plsql cmd

Server [localhost]:
Database [postgres]:
Port [5432]:
Username [postgres]:
Password for user postgres:

psql (17.4)
WARNING: Console code page (437) differs from Windows code page (1252)
         8-bit characters might not work correctly. See psql reference
         page "Notes for Windows users" for details.
Type "help" for help.

postgres=# \l

postgres=# \c mydb2
You are now connected to database "mydb2" as user "postgres".

mydb2-# \dn
      List of schemas
  Name  |       Owner
--------+-------------------
 public | pg_database_owner
 rm     | postgres
(2 rows)

mydb2-# \dt "rm".*
                List of relations
 Schema |        Name         | Type  |  Owner
--------+---------------------+-------+----------
 rm     | Account             | table | postgres
 rm     | Company             | table | postgres
 rm     | Country             | table | postgres
 rm     | ProgrammingLanguage | table | postgres
 rm     | Roadmap             | table | postgres
 rm     | Role                | table | postgres
 rm     | Session             | table | postgres
 rm     | User                | table | postgres
 rm     | _prisma_migrations  | table | postgres
(9 rows)

mydb2=# SELECT * FROM "rm"."User";
            id             |      name      |           email           | emailVerified | password | image | user_role | credits | verified | verificationToken | verificationTokenExpires |        createdAt        |        updatedAt        |                           sessionToken                           |       lastActive

mydb2=# UPDATE "rm"."User" SET "credits" = 1;
UPDATE 1

Disconnect all connections:
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'mydb2' AND leader_pid IS NULL;

## Payment Integration - Stripe

npx ts-node scripts/initializePaymentPlans.ts


Use an Indian test card:

4000 0035 6000 0008 (Successful payment)

4000 0000 0000 0069 (Expired card)

Implementation Steps
Set up Stripe Account:

  - Create a Stripe account at https://stripe.com

  - Get your API keys from the Stripe Dashboard

Configure Environment Variables:

  - Add the Stripe keys to your .env.local file

Initialize Payment Plans:

  - Run the initialization script: npx ts-node scripts/initializePaymentPlans.ts

Set up Stripe Webhook:

  - In Stripe Dashboard, go to Developers → Webhooks

  - Add a new endpoint with your production URL (or use Stripe CLI for local testing)

  - Set the endpoint to https://yourdomain.com/api/webhook

  - Select these events: checkout.session.completed | checkout.session.async_payment_failed

Test the Integration:

Use Stripe test cards (like 4242 4242 4242 4242) for testing

Test successful and failed payment scenarios

Testing Instructions

  - Local Testing with Stripe CLI:

  - Install Stripe CLI: https://stripe.com/docs/stripe-cli

  - Run: stripe listen --forward-to localhost:3000/api/webhook

  - This will give you a webhook signing secret to use in your .env.local

  - Test Payment Flow:

  - Click on the credits button in the dashboard

  - Select a plan and click "Pay"

    - Use test card 4242 4242 4242 4242 with any future expiry and CVC

    - Verify the transaction appears in history after completion

    - Verify credits are added to your account

Test Webhooks:

  - Check the Stripe CLI logs for webhook events

  - Verify the database updates correctly for both success and failure cases

Troubleshooting

Payments not completing:

  -  Check browser console for errors

  - Verify Stripe keys are correct in environment variables

  - Ensure NEXT_PUBLIC_BASE_URL is set correctly

Webhooks not working:

  - Verify the webhook secret matches what Stripe provides

  - Check your server logs for errors

  - Test with Stripe CLI locally first

Credits not updating:

  - Verify the session update is working in the webhook

  - Check the user record in the database directly

  - Ensure you're calling update() after payment success

This complete implementation should give you a fully functional payment system with credit purchases, transaction history, and proper error handling.

## Payment Integration - Razor Pay

Set up Razorpay Account:

  - Create a Razorpay account at https://razorpay.com/

  - Get your API keys from the dashboard

  - Set up webhooks in the Razorpay dashboard (point to your /api/webhook endpoint)

Test in Development:

  - Use Razorpay test mode (test API keys)

  - Test cards:

      - Success: 4111 1111 1111 1111

      - Failure: 4111 1111 1111 1112

  - Test UPI ID: success@razorpay

 ### RazorPay Local Testing For Windows

 - Download ngrok for windows
 - Fire command http 3000 --log=stdout
 - Copy the response URI from above command and add that URI into Razorpay dashboard with appended '/api/webhook'
 - With Logs: ngrok http 3000 --log=stdout
