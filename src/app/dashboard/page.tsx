// app/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Roadmaps</h1>
      {/* <RoadmapList /> */}
    </div>
  );
}