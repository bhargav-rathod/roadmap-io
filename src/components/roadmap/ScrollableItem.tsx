'use client'

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

export function SortableItem({ id, children, onClose }: { id: string; children: React.ReactNode; onClose?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
    cursor: 'grab', // Changed from cursor-move to grab
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Link 
        href={`/dashboard/${id}`} 
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
          } else if (onClose) {
            onClose();
          }
        }}
        className="block"
      >
        {/* <Card className="hover:bg-gray-50 transition-colors"> */}
          <div {...listeners} className="p-4">
            {children}
          </div>
        {/* </Card> */}
      </Link>
    </div>
  );
}