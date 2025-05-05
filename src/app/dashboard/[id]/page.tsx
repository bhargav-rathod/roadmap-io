import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../lib/prisma';
import RoadmapPage from '@/app/roadmap-page/RoadmapPage';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  const roadmap = await prisma.roadmap.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
      expiresAt: { gt: new Date() },
    },
  }) as any;

  if (!roadmap) return notFound();

  return <RoadmapPage roadmap={roadmap} />;
}