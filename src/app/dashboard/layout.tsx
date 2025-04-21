'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import UserMenu from "@/components/ui/UserMenu";
import RoadmapSidebar from "@/components/roadmap/RoadmapSidebar";
import { useState } from 'react';
import { FiZap } from 'react-icons/fi';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();

  const credits = session?.user?.credits ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:hidden`}>
        <RoadmapSidebar 
          onClose={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Sidebar - Desktop */}
      <div className={`hidden lg:flex lg:flex-shrink-0 ${sidebarOpen ? 'lg:w-[576px]' : 'lg:w-0'} bg-white border-r border-gray-200 transition-all duration-200 ease-in-out`}>
        <div className="w-full h-full px-4 py-6">
          {sidebarOpen && (
            <RoadmapSidebar 
              onClose={() => setSidebarOpen(false)}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                {sidebarOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium text-yellow-800">
                  <FiZap className="mr-1" />
                  Credits: <span className="font-bold ml-1">{credits}</span>
                </div>
                <UserMenu />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}
