// lib/session.ts
import prisma from './prisma';
import bcrypt from 'bcryptjs';

export async function directSignIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}