// components/ui/ClassicLoader.tsx
import { FC } from 'react';

const ClassicLoader: FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      <span className="mt-4 text-white font-medium">Loading...</span>
    </div>
  );
};

export default ClassicLoader;