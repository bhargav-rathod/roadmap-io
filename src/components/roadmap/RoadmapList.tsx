'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Roadmap } from '../../../types/roadmaps';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './ScrollableItem';
import { useEmulation } from '../EmulationProvider';

const cardColors = [
  'bg-blue-50',
  'bg-pink-50',
  'bg-green-50',
  'bg-yellow-50',
  'bg-purple-50',
];

export default function RoadmapList({ onClose }: { onClose?: () => void }) {
  const { data: session } = useSession();
  const { emulatedUser } = useEmulation();
  const user = emulatedUser || session?.user;
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
      if (user?.id) {
        try {
          const res = await fetch(`/api/roadmaps?userId=${user.id}`);
          const data = await res.json();
          setRoadmaps(data);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    }
    fetchRoadmaps();
  }, [user]);

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
                    {roadmap.company && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 13h18v8H3v-8zm2 2v4h2v-4H5zm4 0v4h6v-4H9zm8 0v4h2v-4h-2zM3 3h18v8H3V3zm2 2v4h2V5H5zm4 0v4h6V5H9zm8 0v4h2V5h-2z" />
                        </svg>
                        <span>Company: {roadmap.company}</span>
                      </div>
                    )}
                    {roadmap.role && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span>Role: {roadmap.role}</span>
                      </div>
                    )}
                    {(roadmap.yearsOfExperience || roadmap.monthsOfExperience) && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8V4l8 8-8 8v-4H4V8z" />
                        </svg>
                        <span>
                          Experience: {roadmap.yearsOfExperience || 0} yr {roadmap.monthsOfExperience || 0} mo
                        </span>
                      </div>
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