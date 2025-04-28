import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../lib/prisma';
import { marked } from 'marked';

export default async function RoadmapPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  const roadmap = await prisma.roadmap.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
      expiresAt: { gt: new Date() },
    },
    include: {
      companyRef: true,
      roleRef: true,
      programmingLanguageRef: true,
    },
  });

  if (!roadmap) return notFound();

  const formattedContent = roadmap.content ? marked.parse(roadmap.content) : '';

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">

        {roadmap.status === 'processing' ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
            <h2 className="text-xl font-semibold mt-6 text-indigo-700">
              Generating your personalized roadmap...
            </h2>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              Gathering the latest insights and strategies tailored just for you. Thanks for your patience!
            </p>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{roadmap.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {roadmap.companyRef && (
                  <div className="bg-indigo-50 px-3 py-1 rounded-full">
                    Company: <span className="font-semibold">{roadmap.companyRef.name}</span>
                  </div>
                )}
                {roadmap.roleRef && (
                  <div className="bg-green-50 px-3 py-1 rounded-full">
                    Role: <span className="font-semibold">{roadmap.roleRef.name}</span>
                  </div>
                )}
                {roadmap.yearsOfExperience && (
                  <div className="bg-yellow-50 px-3 py-1 rounded-full">
                    Experience: <span className="font-semibold">{roadmap.yearsOfExperience} years</span>
                  </div>
                )}
                {roadmap.programmingLanguageRef && (
                  <div className="bg-pink-50 px-3 py-1 rounded-full">
                    Language: <span className="font-semibold">{roadmap.programmingLanguageRef.name}</span>
                  </div>
                )}
                <div className="bg-blue-50 px-3 py-1 rounded-full">
                  Target: <span className="font-semibold">{roadmap.targetDuration} months</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-t-2 border-gray-200" />

            {/* Content Section */}
            <div className="prose prose-indigo max-w-none">
              {formattedContent ? (
                <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
              ) : (
                <p>No content available for this roadmap yet.</p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
