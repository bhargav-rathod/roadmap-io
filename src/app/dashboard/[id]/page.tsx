import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../lib/prisma';

export default async function RoadmapPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  const roadmap = await prisma.roadmap.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!roadmap) return notFound();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {roadmap.status === 'processing' ? (
        <div className="text-center py-12">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Hang tight! We're creating your personalized roadmap.
            </h3>
            <p className="text-gray-500 max-w-md">
              We're as excited as you are in this journey. Collecting the most recent and accurate data for you.
            </p>
            <div className="w-full max-w-sm bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: '70%' }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">{roadmap.title}</h1>
          {/* Render roadmap content here */}
        </div>
      )}
    </div>
  );
}