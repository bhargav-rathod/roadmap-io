// components/roadmap/CreateRoadmapList.tsx

'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Roadmap } from '../../../types/roadmaps';
import { Card, CardContent } from '../ui/card';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './ScrollableItem';

export default function RoadmapList({ onClose }: { onClose?: () => void }) {
  const { data: session } = useSession();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  function handleDragEnd(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setRoadmaps((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Optional: Send new order to API if you want to persist it
        // fetch('/api/roadmaps/order', {
        //   method: 'POST',
        //   body: JSON.stringify({ order: newItems.map(item => item.id) })
        // });
        
        return newItems;
      });
    }
  }

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
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={roadmaps}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4 p-4">
          {roadmaps.map((roadmap) => (
            <SortableItem key={roadmap.id} id={roadmap.id} onClose={onClose}>
              <div className="text-xl font-bold">{roadmap.title}</div>
              <div className="text-sm text-gray-600 mt-2">
                {roadmap.company && <span>Company: {roadmap.company}</span>}
                {roadmap.role && <span className="ml-4">Role: {roadmap.role}</span>}
                {roadmap.yearsOfExperience && <span className="ml-4">Experience: {roadmap.yearsOfExperience} years</span>}
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}