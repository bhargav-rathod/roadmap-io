'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Roadmap } from '../../../types/roadmaps';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './ScrollableItem';

const cardColors = [
  'bg-blue-50',
  'bg-pink-50',
  'bg-green-50',
  'bg-yellow-50',
  'bg-purple-50',
];

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
        } finally {
          setLoading(false);
        }
      }
    }
    fetchRoadmaps();
  }, [session]);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setRoadmaps((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
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
        <p className="text-sm text-gray-500 mb-4">Hey, you don't have any roadmaps created yet, start your journey by creating first roadmap and it will appear here!</p>
        <p className="text-sm text-gray-500 mb-4">We are also excited to see your first roadmap.</p>
        <p className="text-sm text-gray-500 mb-4">Don't worry! If you don't know how to create the roadmap, we have goat you covered. Just click on the Create New Roadmap button and add necessary details and hola, the miracle will heappen!</p>
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
          {roadmaps.map((roadmap, index) => (
            <div 
              key={roadmap.id}
              style={{ touchAction: 'none' }} // Prevent touch scrolling during drag
            >
              <SortableItem 
                id={roadmap.id} 
                onClose={onClose}
              >
                <div 
                  className={`rounded-xl p-5 shadow-md transition-all duration-300 border ${cardColors[index % cardColors.length]}`}
                  onDragStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <h3 className="text-xl font-semibold text-gray-800">{roadmap.title}</h3>
                  <div className="text-sm text-gray-700 mt-3 space-y-1">
                    {roadmap.company && <div>📌 Company: {roadmap.company}</div>}
                    {roadmap.role && <div>💼 Role: {roadmap.role}</div>}
                    {(roadmap.yearsOfExperience || roadmap.monthsOfExperience) && (
                      <div>🧭 Experience: {roadmap.yearsOfExperience} yr {roadmap.monthsOfExperience} mo</div>
                    )}
                  </div>
                </div>
              </SortableItem>
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}