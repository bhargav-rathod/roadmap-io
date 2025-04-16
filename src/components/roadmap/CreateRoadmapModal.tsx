'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreateRoadmapModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [credits, setCredits] = useState(10);
  const [formData, setFormData] = useState({
    roleType: '',
    yearsOfExperience: '',
    company: '',
    role: '',
    duration: '3',
    includeSimilarCompanies: false,
    includeCompensationData: false,
  });
  const [companies, setCompanies] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch initial credits from API
        const creditsRes = await fetch('/api/user/credits');
        const creditsData = await creditsRes.json();
        setCredits(creditsData.credits);

        // Fetch companies and roles
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
    if (isOpen) fetchData();
  }, [isOpen]);

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

    setShowConfirmation(true);
  };

  const confirmCreate = async () => {
    if (credits <= 0) {
      alert("You don't have enough credits to create a roadmap");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
          title: `${formData.role} at ${formData.company}`,
        }),
      });

      if (response.ok) {
        const { id } = await response.json();
        // Update credits locally and in backend
        setCredits(prev => prev - 1);
        await fetch('/api/user/credits', {
          method: 'POST',
          body: JSON.stringify({ credits: credits - 1 })
        });
        
        onClose();
        router.push(`/dashboard/${id}`);
      }
    } catch (error) {
      console.error('Failed to create roadmap:', error);
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        {showConfirmation ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirm Roadmap Creation</h2>
            <p className="text-gray-600 mb-2">
              Are you sure you want to create this roadmap for {formData.role} at {formData.company}?
            </p>
            <p className="text-gray-600 mb-4">
              This will use 1 of your {credits} remaining credits.
            </p>
            {credits <= 0 && (
              <p className="text-red-500 mb-4">
                You don't have enough credits to create this roadmap.
              </p>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCreate}
                disabled={loading || credits <= 0}
                className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                  credits <= 0 ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Create New Roadmap</h2>
            <p className="text-gray-600 mb-6">
              Provide details to create a personalized career roadmap
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Type
                  </label>
                  <select
                    name="roleType"
                    value={formData.roleType}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select role type</option>
                    <option value="Individual Contributor">Individual Contributor</option>
                    <option value="Manager">Manager</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Company
                  </label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (months)
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeSimilarCompanies"
                    name="includeSimilarCompanies"
                    checked={formData.includeSimilarCompanies}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="includeSimilarCompanies" className="text-sm text-gray-700">
                    Include similar companies
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeCompensationData"
                    name="includeCompensationData"
                    checked={formData.includeCompensationData}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="includeCompensationData" className="text-sm text-gray-700">
                    Include compensation data
                  </label>
                </div>
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
                  disabled={!isValid || loading || credits <= 0}
                  className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                    credits <= 0 ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  } ${!isValid || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Creating...' : 'Create Roadmap'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}