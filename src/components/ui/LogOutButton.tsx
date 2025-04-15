'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'GET' });
      if (response.ok) {
        // Force full page reload to ensure auth state is cleared
        window.location.href = '/login?logout=success';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login?logout=error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}