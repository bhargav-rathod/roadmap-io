// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const prisma = new PrismaClient();

async function main() {
  // Load YAML data
  const data = yaml.load(fs.readFileSync('prisma/seed.yml', 'utf8')) as any;
  const companiesData = yaml.load(fs.readFileSync('prisma/companies.yml', 'utf8')) as any;
  
  // Seed companies
  await prisma.company.createMany({
    data: companiesData.companies.map((company: { name: string; type: 'IT' | 'Non-IT' | 'Both' | undefined | null; })=> ({
      name: company.name,
      type: company.type || 'Both', // Default to 'Both' if type not specified
    })),
    skipDuplicates: true,
  });

  // Seed roles
  await prisma.role.createMany({
    data: data.companies.map((role: { name: string; type: 'IT' | 'Non-IT' | 'Both' | undefined | null; })=> ({
      name: role.name,
      type: role.type || 'Both', // Default to 'Both' if type not specified
    })),
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
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });