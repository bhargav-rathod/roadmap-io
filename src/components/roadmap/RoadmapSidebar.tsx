'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Roadmap } from '../../../types/roadmaps';

export default function RoadmapSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmaps() {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/roadmaps?userId=${session.user.id}`);
          const data = await res.json();
          setRoadmaps(data);
        } catch (error) {
          console.error('Failed to fetch roadmaps:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchRoadmaps();
  }, [session]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        <span>My Roadmaps</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
          ) : roadmaps.length === 0 ? (
            <div className="px-4 py-3 text-center">
              <p className="text-sm text-gray-500 mb-2">No roadmaps available</p>
              <Link
                href="/dashboard/new"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Create your first roadmap
              </Link>
            </div>
          ) : (
            roadmaps.map((roadmap) => (
              <Link
                key={roadmap.id}
                href={`/dashboard/${roadmap.id}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                <div className="font-medium">{roadmap.title}</div>
                <div className="text-xs text-gray-500">
                  {roadmap.company} • {roadmap.role}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}