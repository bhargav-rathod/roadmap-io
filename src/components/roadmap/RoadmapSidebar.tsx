//components/roadmap/RoadmapSidebar.tsx

'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import CreateRoadmapForm from './CreateRoadmapForm';
import RoadmapList from './RoadmapList';
import { FiX, FiPlus } from 'react-icons/fi';

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
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-sm rounded-r-xl border-r border-gray-200/50 shadow-2xl">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50">
        <h2 className="text-xl font-bold text-gray-800">Your Roadmaps</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 transition-all"
          aria-label="Close sidebar"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
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
            <div className="p-6 border-b border-gray-200/50">
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:opacity-90 transition-all text-lg font-medium shadow-md"
              >
                <FiPlus className="h-5 w-5" />
                <span>Create New Roadmap</span>
              </button>
            </div>
            <div className="p-6">
              <RoadmapList onClose={onClose} />
            </div>
          </>
        )}
      </div>

      <div className="p-5 border-t border-gray-200/50 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Available Credits: <span className="font-bold">{session?.user?.credits || 0}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Each roadmap creation uses 1 credit
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
