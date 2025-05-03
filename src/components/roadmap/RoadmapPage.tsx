'use client'

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FiChevronLeft, FiChevronRight, FiEye, FiMaximize, FiMinimize, FiMoon, FiSun, FiType, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import Tooltip from '../ui/Tooltip';
import Link from 'next/link';

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
        <div className={`min-h-screen py-4 md:py-10 px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
            {/* Main container with fixed height */}
            <div
                ref={containerRef}
                className={`w-full max-w-full mx-auto rounded-3xl shadow-2xl p-4 md:p-6 flex flex-col transition-colors duration-300 ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
                style={{
                    height: isFullscreen ? '100vh' : 'calc(100vh - 2rem)',
                    minHeight: isFullscreen ? '100vh' : '80vh',
                    maxHeight: isFullscreen ? '100vh' : '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header section - fixed height */}
                <div className={`flex flex-col space-y-4 md:space-y-6 pb-4 md:pb-6 border-b transition-colors duration-300 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <h1 className="text-2xl md:text-4xl font-extrabold break-words">{roadmap.title}</h1>

                        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                            {/* Reading controls */}
                            <div className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-full transition-colors duration-300 ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                                <Tooltip content="Decrease font size" position="bottom">
                                    <button
                                        onClick={decreaseFontSize}
                                        disabled={fontSize <= 12}
                                        className={`p-1 rounded-md ${fontSize <= 12 ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        <FiZoomOut size={16} />
                                    </button>
                                </Tooltip>

                                <Tooltip content="Increase font size" position="bottom">
                                    <button
                                        onClick={increaseFontSize}
                                        disabled={fontSize >= 24}
                                        className={`p-1 rounded-md ${fontSize >= 24 ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        <FiZoomIn size={16} />
                                    </button>
                                </Tooltip>

                                {/* Font family */}
                                <Tooltip content="Change font" position="bottom">
                                    <button
                                        onClick={toggleFontFamily}
                                        className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600`}
                                    >
                                        <FiType size={16} />
                                    </button>
                                </Tooltip>

                                {/* Dark mode */}
                                <Tooltip content={darkMode ? "Switch to light mode" : "Switch to dark mode"} position="bottom">
                                    <button
                                        onClick={toggleDarkMode}
                                        className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600`}
                                    >
                                        {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
                                    </button>
                                </Tooltip>

                                {/* Fullscreen */}
                                <Tooltip content={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} position="bottom">
                                    <button
                                        onClick={toggleFullscreen}
                                        className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600`}
                                    >
                                        {isFullscreen ? <FiMinimize size={16} /> : <FiMaximize size={16} />}
                                    </button>
                                </Tooltip>
                            </div>

                            {pages.length > 1 && (
                                <div className={`flex items-center space-x-2 md:space-x-4 px-2 md:px-4 py-1 md:py-2 rounded-full transition-colors duration-300 ${
                                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`p-1 rounded-md ${currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        <FiChevronLeft size={16} />
                                    </button>
                                    <span className="text-xs md:text-sm font-medium">
                                        {currentPage}/{pages.length}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
                                        disabled={currentPage === pages.length}
                                        className={`p-1 rounded-md ${currentPage === pages.length ? 'opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        <FiChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                        {roadmap.company && (
                            <div className={`px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold ${
                                darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                                Company: {roadmap.company}
                            </div>
                        )}
                        {roadmap.role && (
                            <div className={`px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold ${
                                darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                            }`}>
                                Role: {roadmap.role}
                            </div>
                        )}
                        {roadmap.yearsOfExperience && (
                            <div className={`px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold ${
                                darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                Exp: {roadmap.yearsOfExperience}Y
                                {roadmap.monthsOfExperience && parseInt(roadmap.monthsOfExperience, 10) > 0 && (
                                    <span> {roadmap.monthsOfExperience}M</span>
                                )}
                            </div>
                        )}
                        {roadmap.programmingLanguage && (
                            <div className={`px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold ${
                                darkMode ? 'bg-pink-900 text-pink-200' : 'bg-pink-100 text-pink-800'
                            }`}>
                                Lang: {roadmap.programmingLanguage}
                            </div>
                        )}
                        {roadmap.targetDuration && roadmap.targetDuration.toLowerCase() !== "any" &&
                            roadmap.targetDuration.toLowerCase() !== "not decided yet" && (
                                <div className={`px-2 md:px-4 py-1 md:py-2 rounded-full font-semibold ${
                                    darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    Target: {roadmap.targetDuration}
                                </div>
                            )}
                    </div>
                </div>

                {/* Scrollable content area - takes remaining space */}
                <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto py-4 md:py-6"
                    style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: fontFamily
                    }}
                >
                    <div className={`prose max-w-none transition-colors duration-300 ${
                        darkMode ? 'prose-invert' : ''
                    } ${
                        fontFamily === 'serif' ? 'prose-serif' :
                        fontFamily === 'monospace' ? 'prose-monospace' : ''
                    }`}>
                        {roadmap.content ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h1: ({ node, ...props }) => (
                                        <h1 className={`text-2xl md:text-4xl font-bold mt-4 md:mt-6 mb-4 md:mb-6 ${
                                            darkMode ? 'text-indigo-300' : 'text-indigo-800'
                                        }`} {...props} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2 className={`text-xl md:text-3xl font-semibold mt-6 md:mt-8 mb-3 md:mb-4 ${
                                            darkMode ? 'text-indigo-300' : 'text-indigo-700'
                                        }`} {...props} />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3 className={`text-lg md:text-2xl font-semibold mt-4 md:mt-6 mb-2 md:mb-3 ${
                                            darkMode ? 'text-indigo-200' : 'text-indigo-600'
                                        }`} {...props} />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p className={`leading-relaxed mb-3 md:mb-4 ${
                                            darkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`} {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li className={`mb-1 md:mb-2 ml-4 list-disc ${
                                            darkMode ? 'marker:text-indigo-400' : 'marker:text-indigo-500'
                                        }`} {...props} />
                                    ),
                                    code: ({ node, inline, className, children, ...props }) => {
                                        return !inline ? (
                                            <pre className={`p-2 md:p-4 rounded-lg md:rounded-xl overflow-x-auto my-3 md:my-4 ${
                                                darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                <code className="language-js">{children}</code>
                                            </pre>
                                        ) : (
                                            <code className={`px-1 md:px-2 py-0.5 md:py-1 rounded-md ${
                                                darkMode ? 'bg-gray-700 text-pink-300' : 'bg-gray-100 text-pink-600'
                                            }`}>{children}</code>
                                        );
                                    },
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote className={`border-l-4 pl-3 md:pl-4 italic my-3 md:my-4 ${
                                            darkMode ? 'border-indigo-500 text-gray-400' : 'border-indigo-300 text-gray-600'
                                        }`} {...props} />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul className="list-disc ml-4 md:ml-6 mb-3 md:mb-4 space-y-1" {...props} />
                                    ),
                                    a: ({ node, ...props }) => (
                                        <a className={`${
                                            darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
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
                    <div className={`pt-2 md:pt-4 border-t transition-colors duration-300 ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-6">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Page {currentPage} of {pages.length}
                            </div>
                            <div className="flex items-center gap-2 md:gap-6">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-3 py-1 md:px-4 md:py-2 rounded-md transition-colors duration-300 ${
                                        currentPage === 1
                                            ? 'opacity-50 cursor-not-allowed'
                                            : darkMode
                                                ? 'text-indigo-400 hover:bg-gray-700'
                                                : 'text-indigo-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    <FiChevronLeft className="mr-1 md:mr-2" />
                                    <span className="text-xs md:text-base">Previous</span>
                                </button>
                                <div className="flex space-x-1 md:space-x-2">
                                    {Array.from({ length: Math.min(3, pages.length) }, (_, i) => {
                                        let pageNum;
                                        if (pages.length <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 2) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= pages.length - 1) {
                                            pageNum = pages.length - 2 + i;
                                        } else {
                                            pageNum = currentPage - 1 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-300 text-xs md:text-base ${
                                                    currentPage === pageNum
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
                                    {pages.length > 3 && currentPage < pages.length - 1 && (
                                        <span className={`flex items-end px-1 ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>...</span>
                                    )}
                                    {pages.length > 3 && currentPage < pages.length - 1 && (
                                        <button
                                            onClick={() => setCurrentPage(pages.length)}
                                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-300 text-xs md:text-base ${
                                                currentPage === pages.length
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
                                    className={`flex items-center px-3 py-1 md:px-4 md:py-2 rounded-md transition-colors duration-300 ${
                                        currentPage === pages.length
                                            ? 'opacity-50 cursor-not-allowed'
                                            : darkMode
                                                ? 'text-indigo-400 hover:bg-gray-700'
                                                : 'text-indigo-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    <span className="text-xs md:text-base">Next</span>
                                    <FiChevronRight className="ml-1 md:ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}