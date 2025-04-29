// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const prisma = new PrismaClient();

async function main() {
  // Load YAML data
  const data = yaml.load(fs.readFileSync('prisma/seed.yml', 'utf8')) as any;

  // Seed companies
  await prisma.company.createMany({
    data: data.companies,
    skipDuplicates: true,
  });

  // Seed roles
  await prisma.role.createMany({
    data: data.roles,
    skipDuplicates: true,
  });

  // Seed programming languages
  await prisma.programmingLanguage.createMany({
    data: data.programmingLanguages,
    skipDuplicates: true,
  });

  await prisma.country.createMany({
    data: data.countries.map((name: string) => ({ name })),
    skipDuplicates: true,
  });
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });