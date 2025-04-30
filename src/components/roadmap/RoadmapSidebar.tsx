'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import CreateRoadmapForm from './CreateRoadmapForm';
import RoadmapList from './RoadmapList';
import { FiX } from 'react-icons/fi';

export default function RoadmapSidebar({
  onClose,
  sidebarOpen,
  setSidebarOpen
}: {
  onClose?: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white shadow-xl">
      {/* Header with close button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Your Roadmaps</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>

      {/* Content area with independent scrolling */}
      <div className="flex-1 overflow-y-auto">
        {showForm ? (
          <div className="p-6">
            <CreateRoadmapForm
              onSuccess={() => {
                setShowForm(false);
                setSidebarOpen(true);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 transition-colors text-lg font-medium"
              >
                <span>+ Create New Roadmap</span>
              </button>
            </div>
            <div className="p-6">
              <RoadmapList onClose={onClose} />
            </div>
          </>
        )}
      </div>

      {/* Footer with credits */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-base text-gray-600">
          <span className="font-semibold">Available Credits:</span> {session?.user?.credits || 0}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Each roadmap creation uses 1 credit
        </p>
      </div>
    </div>
  );
}