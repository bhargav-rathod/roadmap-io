'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import UserMenu from "@/components/ui/UserMenu";
import RoadmapSidebar from "@/components/roadmap/RoadmapSidebar";
import { useState } from 'react';
import { FiZap, FiMenu } from 'react-icons/fi';
import { maintenanceBannerConfig } from '../data/maintenanceBanner';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session } = useSession();

  const credits = session?.user?.credits ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Mobile (Full screen overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-md">
            <RoadmapSidebar
              onClose={() => setSidebarOpen(false)}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>
      )}

      {/* Sidebar - Desktop (4x wider - 320px) */}
      <div className={`hidden lg:block lg:flex-shrink-0 ${sidebarOpen ? 'lg:w-[576px]' : 'lg:w-0'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out`}>
        {sidebarOpen && (
          <div className="h-full overflow-y-auto no-scrollbar">
            <RoadmapSidebar
              onClose={() => setSidebarOpen(false)}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Hamburger menu button - only shown when sidebar is closed */}
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                  aria-label="Open sidebar"
                >
                  <FiMenu className="h-6 w-6" />
                </button>
              )}

              <div className="flex items-center space-x-4 ml-auto">
                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium text-yellow-800">
                  <FiZap className="mr-1" />
                  Credits: <span className="font-bold ml-1">{credits}</span>
                </div>
                <UserMenu />
              </div>
            </div>
          </div>
        </nav>

        {maintenanceBannerConfig.isEnabled && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {maintenanceBannerConfig.content}
                </p>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="w-full max-w-full xl:max-w-[1600px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
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