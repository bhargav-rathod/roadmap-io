// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Load YAML data
  console.log('Data loading...');
  
  const companiesData = yaml.load(fs.readFileSync('prisma/seed/companies/seed.yml', 'utf8')) as any;
  console.log('Companies Data Loaded');
  
  const userData = yaml.load(fs.readFileSync('prisma/seed/users/seed.yml', 'utf8')) as any;
  console.log('Users Data Loaded');
  
  const rolesData = yaml.load(fs.readFileSync('prisma/seed/roles/seed.yml', 'utf8')) as any;
  console.log('Roles Data Loaded');
  
  const programmingLanguagesData = yaml.load(fs.readFileSync('prisma/seed/programmingLanguages/seed.yml', 'utf8')) as any;
  console.log('Programming Languages Data Loaded');
  
  const countriesData = yaml.load(fs.readFileSync('prisma/seed/countries/seed.yml', 'utf8')) as any;
  console.log('Countries Data Loaded');

  const configsData = yaml.load(fs.readFileSync('prisma/seed/configs/seed.yml', 'utf8')) as any;
  console.log('Configs Data Loaded');
  
  console.log('All data loaded. Seeding data...');

  // seed initial users
  console.log('Seeding users...');
  await prisma.user.createMany({
    data: userData.users.map((user: any) => ({
      email: user.email.trim().toLowerCase(),
      name: user.name.trim(),
      password: user.password.trim() ? bcrypt.hashSync(user.password.trim(), 12) : null,
      verified: user.verified || false,
      credits: user.credits || 0,
      user_role: user.user_role || 'USER',
      sessionToken: user.sessionToken || null,
      lastActive: new Date(user.lastActive || Date.now()),
    })),
    skipDuplicates: true,
  });
  console.log('Users seeded successfully.');

  // Seed companies
  console.log('Seeding companies...');
  await prisma.company.createMany({
    data: companiesData.companies.map((company: any)=> ({
      name: company.name.trim(),
      type: company.type.trim() || 'Both', // Default to 'Both' if type not specified
    })),
    skipDuplicates: true,
  });
  console.log('Companies seeded successfully.');

  // Seed roles
  console.log('Seeding roles...');
  await prisma.role.createMany({
    data: rolesData.roles.map((role: any)=> ({
      name: role.name.trim(),
      type: role.type.trim() || 'Both', // Default to 'Both' if type not specified
    })),
    skipDuplicates: true,
  });
  console.log('Roles seeded successfully.');

  // Seed programming languages
  console.log('Seeding programming languages...');
  await prisma.programmingLanguage.createMany({
    data: programmingLanguagesData.programmingLanguages.trim(),
    skipDuplicates: true,
  });
  console.log('Programming languages seeded successfully.');

  // Seed countries
  console.log('Seeding countries...');
  await prisma.country.createMany({
    data: countriesData.countries.map((name: string) => ({ name })),
    skipDuplicates: true,
  });
  console.log('Countries seeded successfully.');

  // Seed config data
  console.log('Seeding configs...');
  await prisma.config.createMany({
    data: configsData.configs.map((config: { 
      key: string;
      value: any;
      isActive: boolean;
      isProtected: boolean;
    }) => ({
      key: config.key.trim(),
      value: String(config.value.trim()), // Ensure value is always a string
      isActive: config.isActive,
      isProtected: config.isProtected
    })),
    skipDuplicates: true,
  });
  console.log('Countries seeded successfully.');

}

main()
  .catch(e => {
    console.error('Error occurred while seeding data ::', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('All data seeded successfully.');
  });