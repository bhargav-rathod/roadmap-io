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