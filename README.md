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