'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreateRoadmapModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roleType: '',
    yearsOfExperience: '',
    company: '',
    role: '',
    duration: '',
    includeSimilarCompanies: false,
    includeCompensationData: false,
  });
  const [companies, setCompanies] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [companiesRes, rolesRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/roles'),
        ]);
        const [companiesData, rolesData] = await Promise.all([
          companiesRes.json(),
          rolesRes.json(),
        ]);
        setCompanies(companiesData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setIsValid(
      !!formData.roleType &&
      !!formData.yearsOfExperience &&
      !!formData.company &&
      !!formData.role
    );
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
          title: `${formData.role} at ${formData.company}`,
        }),
      });

      if (response.ok) {
        const { id } = await response.json();
        onClose();
        router.push(`/dashboard/${id}`);
      }
    } catch (error) {
      console.error('Failed to create roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Create New Roadmap</h2>
        <p className="text-gray-600 mb-6">
          Great! Please provide details for the roadmap to create accurate, in-depth guidance.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Form fields as previously defined */}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${
                !isValid || loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Roadmap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}