'use client'

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Roadmap {
  id: string;
  title: string;
  content: string;
  status: string;
  company?: string | null;
  role?: string | null;
  yearsOfExperience?: string | null;
  monthsOfExperience?: string | null;
  programmingLanguage?: string | null;
  targetDuration?: string | null;
}

interface RoadmapPageProps {
  roadmap: Roadmap;
}

export default function RoadmapPage({ roadmap }: RoadmapPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (roadmap?.content) {
      const contentSections = roadmap.content.split(/(?=^##\s)/gm);
      setPages(contentSections);
    }
  }, [roadmap]);

  if (!isClient) return null;

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <h2 className="text-2xl font-bold text-red-700">Roadmap not found</h2>
        <p className="text-gray-500 text-center max-w-lg leading-relaxed">
          The requested roadmap could not be loaded.
        </p>
      </div>
    );
  }

  if (roadmap.status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-500"></div>
        <h2 className="text-2xl font-bold text-indigo-700">Generating your personalized roadmap...</h2>
        <p className="text-gray-500 text-center max-w-lg leading-relaxed">
          Gathering the latest insights and strategies tailored just for you. Thank you for your patience!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      {/* Fixed height container */}
      <div className="w-full max-w-full xl:max-w-[1800px] 2xl:max-w-[1920px] mx-auto bg-white rounded-3xl shadow-2xl p-10 flex flex-col" style={{ minHeight: '80vh' }}>
        
        {/* Header section - fixed height */}
        <div className="flex flex-col space-y-6 pb-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-extrabold text-gray-900">{roadmap.title}</h1>
            
            {pages.length > 1 && (
              <div className="flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-full">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  <FiChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {pages.length}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
                  disabled={currentPage === pages.length}
                  className={`p-1 rounded-md ${currentPage === pages.length ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {roadmap.company && (
              <div className="bg-indigo-100 text-indigo-800 font-semibold px-4 py-2 rounded-full">
                Company: {roadmap.company}
              </div>
            )}
            {roadmap.role && (
              <div className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full">
                Role: {roadmap.role}
              </div>
            )}
            {roadmap.yearsOfExperience && (
              <div className="bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-full">
                Experience: {roadmap.yearsOfExperience} Years
                {roadmap.monthsOfExperience && parseInt(roadmap.monthsOfExperience, 10) > 0 && (
                  <span> {roadmap.monthsOfExperience} Months</span>
                )}
              </div>
            )}
            {roadmap.programmingLanguage && (
              <div className="bg-pink-100 text-pink-800 font-semibold px-4 py-2 rounded-full">
                Language: {roadmap.programmingLanguage}
              </div>
            )}
            {roadmap.targetDuration && roadmap.targetDuration.toLowerCase() !== "any" && 
             roadmap.targetDuration.toLowerCase() !== "not decided yet" && (
              <div className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full">
                Target: {roadmap.targetDuration}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content area - takes remaining space */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="prose prose-indigo prose-lg max-w-none">
            {roadmap.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-4xl font-bold text-indigo-800 mt-6 mb-6" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-3xl font-semibold text-indigo-700 mt-8 mb-4" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-2xl font-semibold text-indigo-600 mt-6 mb-3" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-2 marker:text-indigo-500 ml-4 list-disc" {...props} />
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    return !inline ? (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-4">
                        <code className="language-js">{children}</code>
                      </pre>
                    ) : (
                      <code className="bg-gray-100 text-pink-600 px-2 py-1 rounded-md">{children}</code>
                    );
                  },
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-indigo-300 pl-4 text-gray-600 italic my-4" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />
                  ),
                }}
              >
                {pages[currentPage - 1] || roadmap.content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500">No content available for this roadmap yet.</p>
            )}
          </div>
        </div>

        {/* Fixed footer with pagination */}
        {pages.length > 1 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-center items-center space-x-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
              >
                <FiChevronLeft className="mr-2" />
                Previous
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: Math.min(5, pages.length) }, (_, i) => {
                  let pageNum;
                  if (pages.length <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pages.length - 2) {
                    pageNum = pages.length - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentPage === pageNum 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pages.length > 5 && currentPage < pages.length - 2 && (
                  <span className="flex items-end px-2">...</span>
                )}
                {pages.length > 5 && currentPage < pages.length - 2 && (
                  <button
                    onClick={() => setCurrentPage(pages.length)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentPage === pages.length 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pages.length}
                  </button>
                )}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
                disabled={currentPage === pages.length}
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentPage === pages.length 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Next
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}