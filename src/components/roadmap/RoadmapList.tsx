// components/roadmap/RoadmapList.tsx
'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Roadmap } from '../../../types/roadmaps';

export default function RoadmapList({ onClose }: { onClose?: () => void }) {
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

  if (loading) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="animate-pulse text-sm text-gray-500">Loading roadmaps...</div>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm text-gray-500 mb-4">No roadmaps available</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 px-2">
      {roadmaps.map((roadmap) => (
        <Link
          key={roadmap.id}
          href={`/dashboard/${roadmap.id}`}
          onClick={onClose}
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <div className="font-medium truncate">{roadmap.title}</div>
          <div className="text-xs text-gray-500 truncate">
            {roadmap.company} • {roadmap.role}
          </div>
        </Link>
      ))}
    </div>
  );
}