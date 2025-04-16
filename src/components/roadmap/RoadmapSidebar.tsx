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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {showForm ? 'Create New Roadmap' : 'My Roadmaps'}
        </h2>
        <button 
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <span className="font-medium">Available Credits:</span> 10
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Each roadmap creation uses 1 credit
        </p>
      </div>
    </div>
  );
}