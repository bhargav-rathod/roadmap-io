// app/dashboard/layout.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import UserMenu from "@/components/ui/UserMenu";
import RoadmapSidebar from "@/components/roadmap/RoadmapSidebar";
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - takes 1/3 of the screen when open */}
        <div className={`fixed inset-y-0 left-0 z-30 w-full max-w-xs transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-1/3`}>
          <RoadmapSidebar 
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content - takes 2/3 of the screen when sidebar is open */}
        <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'lg:ml-1/3' : ''}`}>
          <nav className="bg-white shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="flex items-center">
                  <UserMenu />
                </div>
              </div>
            </div>
          </nav>
          
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}