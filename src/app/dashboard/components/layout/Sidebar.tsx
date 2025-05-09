'use client'

import RoadmapSidebar from '@/components/roadmap/RoadmapSidebar'
import { FiX } from 'react-icons/fi'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-md">
            <div className="relative flex h-full flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                {/* <h2 className="text-lg font-medium">Menu</h2>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiX className="h-6 w-6" />
                </button> */}
              </div>
              <RoadmapSidebar
                onClose={() => setSidebarOpen(false)}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${sidebarOpen ? 'lg:w-[576px]' : 'lg:w-0'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out`}>
        <div className="h-full overflow-y-auto no-scrollbar">
          <RoadmapSidebar
            onClose={() => setSidebarOpen(false)}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
    </>
  )
}