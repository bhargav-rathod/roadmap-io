// components/roadmap/CreateRoadmapButton.tsx
'use client'

import { useState } from 'react';
import CreateRoadmapModal from './CreateRoadmapModal';

export default function CreateRoadmapButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        <span>+ Create New Roadmap</span>
      </button>

      <CreateRoadmapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}