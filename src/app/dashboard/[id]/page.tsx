import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../lib/prisma';
import RoadmapPage from '@/app/roadmap-page/RoadmapPage';
import { cookies } from 'next/headers';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  // Check for emulation cookie
  let userId = session.user.id;
  const emuCookie = cookies().get('emulation');
  if (emuCookie && session.user.user_role === 'ADMIN') {
    try {
      const emu = JSON.parse(decodeURIComponent(emuCookie.value));
      if (emu.id) userId = emu.id;
    } catch {}
  }

  const roadmap = await prisma.roadmap.findUnique({
    where: {
      id: params.id,
      userId,
      expiresAt: { gt: new Date() },
    },
  }) as any;

  if (!roadmap) return notFound();

  return <RoadmapPage roadmap={roadmap} />;
}