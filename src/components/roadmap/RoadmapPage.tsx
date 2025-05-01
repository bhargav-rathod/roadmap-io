'use client'

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FiChevronLeft, FiChevronRight, FiEye, FiMaximize, FiMinimize, FiMoon, FiSun, FiType, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import Tooltip from '../ui/Tooltip';

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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('sans-serif');
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
        if (roadmap?.content) {
            const contentSections = roadmap.content.split(/(?=^##\s)/gm);
            setPages(contentSections);
        }

        // Check for saved preferences
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        const savedFontSize = parseInt(localStorage.getItem('fontSize') || '16');
        const savedFontFamily = localStorage.getItem('fontFamily') || 'sans-serif';

        setDarkMode(savedDarkMode);
        setFontSize(savedFontSize);
        setFontFamily(savedFontFamily);
    }, [roadmap]);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            containerRef.current?.requestFullscreen?.().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
    };

    const increaseFontSize = () => {
        const newSize = Math.min(24, fontSize + 1);
        setFontSize(newSize);
        localStorage.setItem('fontSize', newSize.toString());
    };

    const decreaseFontSize = () => {
        const newSize = Math.max(12, fontSize - 1);
        setFontSize(newSize);
        localStorage.setItem('fontSize', newSize.toString());
    };

    const toggleFontFamily = () => {
        const families = ['sans-serif', 'serif', 'monospace'];
        const currentIndex = families.indexOf(fontFamily);
        const nextIndex = (currentIndex + 1) % families.length;
        setFontFamily(families[nextIndex]);
        localStorage.setItem('fontFamily', families[nextIndex]);
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode.toString());
    };

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
        <div className={`min-h-screen py-10 px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
            {/* Main container with consistent height */}
            <div
                ref={containerRef}
                className={`w-full max-w-full xl:max-w-[1800px] 2xl:max-w-[1920px] mx-auto rounded-3xl shadow-2xl p-6 flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } `}
                style={{
                    minHeight: '80vh',
                    maxHeight: isFullscreen ? '100vh' : '90vh',
                    height: isFullscreen ? '100vh' : 'auto'
                }}
            >
                {/* Header section - fixed height */}
                <div className={`flex flex-col space-y-6 pb-6 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <h1 className="text-4xl font-extrabold">{roadmap.title}</h1>

                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Reading controls */}
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                <Tooltip content="Decrease font size" position="bottom">
                                    <button
                                        onClick={decreaseFontSize}
                                        disabled={fontSize <= 12}
                                        className={`p-1 rounded-md ${fontSize <= 12 ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        <FiZoomOut size={18} />
                                    </button>
                                </Tooltip>

                                <Tooltip content="Increase font size" position="bottom">
                                    <button
                                        onClick={increaseFontSize}
                                        disabled={fontSize >= 24}
                                        className={`p-1 rounded-md ${fontSize >= 24 ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        <FiZoomIn size={18} />
                                    </button>
                                </Tooltip>

                                {/* Font family */}
                                <Tooltip content="Change font" position="bottom">
                                    <button
                                        onClick={toggleFontFamily}
                                        className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600`}
                                    >
                                        <FiType size={18} />
                                    </button>
                                </Tooltip>

                                {/* Dark mode */}
                                <Tooltip content={darkMode ? "Switch to light mode" : "Switch to dark mode"} position="bottom">
                                    <button
                                        onClick={toggleDarkMode}
                                        className={`p-1 rounded-md 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                                    </button>
                                </Tooltip>

                                {/* Fullscreen */}
                                <Tooltip content={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} position="bottom">
                                    <button
                                        onClick={toggleFullscreen}
                                        className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600`}
                                    >
                                        {isFullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
                                    </button>
                                </Tooltip>
                            </div>

                            {pages.length > 1 && (
                                <div className={`flex items-center space-x-4 px-4 py-2 rounded-full transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`p-1 rounded-md ${currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <span className="text-sm font-medium">
                                        Page {currentPage} of {pages.length}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
                                        disabled={currentPage === pages.length}
                                        className={`p-1 rounded-md ${currentPage === pages.length ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                        {roadmap.company && (
                            <div className={`px-4 py-2 rounded-full font-semibold ${darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                                }`}>
                                Company: {roadmap.company}
                            </div>
                        )}
                        {roadmap.role && (
                            <div className={`px-4 py-2 rounded-full font-semibold ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                }`}>
                                Role: {roadmap.role}
                            </div>
                        )}
                        {roadmap.yearsOfExperience && (
                            <div className={`px-4 py-2 rounded-full font-semibold ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                Experience: {roadmap.yearsOfExperience} Years
                                {roadmap.monthsOfExperience && parseInt(roadmap.monthsOfExperience, 10) > 0 && (
                                    <span> {roadmap.monthsOfExperience} Months</span>
                                )}
                            </div>
                        )}
                        {roadmap.programmingLanguage && (
                            <div className={`px-4 py-2 rounded-full font-semibold ${darkMode ? 'bg-pink-900 text-pink-200' : 'bg-pink-100 text-pink-800'
                                }`}>
                                Language: {roadmap.programmingLanguage}
                            </div>
                        )}
                        {roadmap.targetDuration && roadmap.targetDuration.toLowerCase() !== "any" &&
                            roadmap.targetDuration.toLowerCase() !== "not decided yet" && (
                                <div className={`px-4 py-2 rounded-full font-semibold ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    Target: {roadmap.targetDuration}
                                </div>
                            )}
                    </div>
                </div>

                {/* Scrollable content area - takes remaining space */}
                <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto py-6"
                    style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: fontFamily
                    }}
                >
                    <div className={`prose max-w-none transition-colors duration-300 ${darkMode ? 'prose-invert' : ''
                        } ${fontFamily === 'serif' ? 'prose-serif' :
                            fontFamily === 'monospace' ? 'prose-monospace' : ''
                        }`}>
                        {roadmap.content ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h1: ({ node, ...props }) => (
                                        <h1 className={`text-4xl font-bold mt-6 mb-6 ${darkMode ? 'text-indigo-300' : 'text-indigo-800'
                                            }`} {...props} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2 className={`text-3xl font-semibold mt-8 mb-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'
                                            }`} {...props} />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3 className={`text-2xl font-semibold mt-6 mb-3 ${darkMode ? 'text-indigo-200' : 'text-indigo-600'
                                            }`} {...props} />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p className={`leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`} {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li className={`mb-2 ml-4 list-disc ${darkMode ? 'marker:text-indigo-400' : 'marker:text-indigo-500'
                                            }`} {...props} />
                                    ),
                                    code: ({ node, inline, className, children, ...props }) => {
                                        return !inline ? (
                                            <pre className={`p-4 rounded-xl overflow-x-auto my-4 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                <code className="language-js">{children}</code>
                                            </pre>
                                        ) : (
                                            <code className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-pink-300' : 'bg-gray-100 text-pink-600'
                                                }`}>{children}</code>
                                        );
                                    },
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote className={`border-l-4 pl-4 italic my-4 ${darkMode ? 'border-indigo-500 text-gray-400' : 'border-indigo-300 text-gray-600'
                                            }`} {...props} />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />
                                    ),
                                    a: ({ node, ...props }) => (
                                        <a className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
                                            } underline`} {...props} />
                                    ),
                                }}
                            >
                                {pages[currentPage - 1] || roadmap.content}
                            </ReactMarkdown>
                        ) : (
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No content available for this roadmap yet.</p>
                        )}
                    </div>
                </div>

                {/* Fixed footer with pagination */}
                {pages.length > 1 && (
                    <div className={`pt-4 border-t transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div className="flex justify-center items-center space-x-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-300 ${currentPage === 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : darkMode
                                        ? 'text-indigo-400 hover:bg-gray-700'
                                        : 'text-indigo-600 hover:bg-indigo-50'
                                    }`}
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
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${currentPage === pageNum
                                                ? darkMode
                                                    ? 'bg-indigo-700 text-white'
                                                    : 'bg-indigo-600 text-white'
                                                : darkMode
                                                    ? 'text-gray-300 hover:bg-gray-700'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {pages.length > 5 && currentPage < pages.length - 2 && (
                                    <span className={`flex items-end px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>...</span>
                                )}
                                {pages.length > 5 && currentPage < pages.length - 2 && (
                                    <button
                                        onClick={() => setCurrentPage(pages.length)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${currentPage === pages.length
                                            ? darkMode
                                                ? 'bg-indigo-700 text-white'
                                                : 'bg-indigo-600 text-white'
                                            : darkMode
                                                ? 'text-gray-300 hover:bg-gray-700'
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
                                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-300 ${currentPage === pages.length
                                    ? 'opacity-50 cursor-not-allowed'
                                    : darkMode
                                        ? 'text-indigo-400 hover:bg-gray-700'
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