import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '../../../lib/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
      countryRef: true,
      programmingLanguageRef: true,
    },
  });

  if (!roadmap) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 space-y-16">

        {roadmap.status === 'processing' ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-8">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-500"></div>
            <h2 className="text-2xl font-bold text-indigo-700">Generating your personalized roadmap...</h2>
            <p className="text-gray-500 text-center max-w-lg leading-relaxed">
              Gathering the latest insights and strategies tailored just for you. Thank you for your patience!
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold text-gray-900">{roadmap.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm">
                {roadmap.companyRef && (
                  <div className="bg-indigo-100 text-indigo-800 font-semibold px-4 py-2 rounded-full">
                    Company: {roadmap.companyRef.name}
                  </div>
                )}
                {roadmap.roleRef && (
                  <div className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full">
                    Role: {roadmap.roleRef.name}
                  </div>
                )}
                {roadmap.yearsOfExperience && (
                  <div className="bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-full">
                    Experience: {roadmap.yearsOfExperience} years
                  </div>
                )}
                {roadmap.programmingLanguageRef && (
                  <div className="bg-pink-100 text-pink-800 font-semibold px-4 py-2 rounded-full">
                    Language: {roadmap.programmingLanguageRef.name}
                  </div>
                )}
                <div className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full">
                  Target: {roadmap.targetDuration} months
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-t-2 border-gray-300" />

            {/* Content Section */}
            <div className="prose prose-indigo prose-lg max-w-none">
              {roadmap.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-4xl font-bold text-indigo-800 mt-12 mb-6" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-3xl font-semibold text-indigo-700 mt-10 mb-5" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-2xl font-semibold text-indigo-600 mt-8 mb-4" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-gray-700 leading-relaxed mb-6" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-2 marker:text-indigo-500 ml-4 list-disc" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      return !inline ? (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-6">
                          <code className="language-js">{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-gray-100 text-pink-600 px-2 py-1 rounded-md">{children}</code>
                      );
                    },
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-indigo-300 pl-6 text-gray-600 italic my-8" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc ml-8 mb-6 space-y-2" {...props} />
                    ),
                  }}
                >
                  {roadmap.content}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">No content available for this roadmap yet.</p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
