'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import CreateRoadmapForm from './CreateRoadmapForm';
import RoadmapList from './RoadmapList';

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

  const handleClose = () => {
    setShowForm(false);
    setSidebarOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Show close button only on mobile */}
      <div className="flex items-center justify-between px-4 py-2 lg:hidden">
        <h2 className="text-lg font-bold">Your Roadmaps</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showForm ? (
          <div className="p-4">
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
            <div className="p-4">
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <span>+ Create New Roadmap</span>
              </button>
            </div>
            <RoadmapList onClose={onClose} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Available Credits:</span> {session?.user?.credits}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Each roadmap creation uses 1 credit
        </p>
      </div>
    </div>
  );
}