// components/roadmap/CreateRoadmapForm.tsx
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function CreateRoadmapForm({ onSuccess, onCancel }: { 
  onSuccess: (roadmap: any) => void; 
  onCancel: () => void 
}) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    roleType: '',
    company: '',
    companyOther: '',
    role: '',
    roleOther: '',
    yearsOfExperience: '',
    monthsOfExperience: '',
    programmingLanguage: '',
    includeSimilarCompanies: false,
    includeCompensationData: false,
  });
  const [companies, setCompanies] = useState<{name: string, type: string}[]>([]);
  const [roles, setRoles] = useState<{name: string, type: string}[]>([]);
  const [languages, setLanguages] = useState<{name: string, type: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [companiesRes, rolesRes, languagesRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/roles'),
          fetch('/api/programmingLanguages'),
        ]);
        
        const [companiesData, rolesData, languagesData] = await Promise.all([
          companiesRes.json(),
          rolesRes.json(),
          languagesRes.json(),
        ]);
        
        setCompanies(companiesData);
        setRoles(rolesData);
        setLanguages(languagesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();
  }, []);

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
    setError('');
    setLoading(true);

    try {
      const company = formData.company === 'Other' ? formData.companyOther : formData.company;
      const role = formData.role === 'Other' ? formData.roleOther : formData.role;

      if (!formData.roleType || !company || !role) {
        throw new Error('Please fill all required fields');
      }

      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleType: formData.roleType,
          company,
          role,
          yearsOfExperience: formData.yearsOfExperience,
          monthsOfExperience: formData.monthsOfExperience,
          programmingLanguage: formData.programmingLanguage,
          includeSimilarCompanies: formData.includeSimilarCompanies,
          includeCompensationData: formData.includeCompensationData,
          title: `${role} at ${company}`,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create roadmap');
      }

      const newRoadmap = await response.json();
      onSuccess(newRoadmap);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.roleType && 
    formData.company && 
    (formData.company !== 'Other' || formData.companyOther) && 
    formData.role && 
    (formData.role !== 'Other' || formData.roleOther);

  const filteredRoles = roles.filter(role => 
    !formData.roleType || role.type === formData.roleType || role.type === 'Both'
  );

  const filteredCompanies = companies.filter(company => 
    !formData.roleType || company.type === formData.roleType || company.type === 'Both'
  );

  const filteredLanguages = languages.filter(language => 
    !formData.roleType || language.type === formData.roleType || language.type === 'Both'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role Type <span className="text-red-500">*</span>
        </label>
        <select
          name="roleType"
          value={formData.roleType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Role Type</option>
          <option value="IT">IT</option>
          <option value="Non-IT">Non-IT</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Company <span className="text-red-500">*</span>
        </label>
        <select
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Company</option>
          {filteredCompanies.map((company) => (
            <option key={company.name} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
        {formData.company === 'Other' && (
          <input
            type="text"
            name="companyOther"
            value={formData.companyOther}
            onChange={handleChange}
            placeholder="Enter company name"
            className="w-full p-2 border rounded mt-2"
            required
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Role <span className="text-red-500">*</span>
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Role</option>
          {filteredRoles.map((role) => (
            <option key={role.name} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
        {formData.role === 'Other' && (
          <input
            type="text"
            name="roleOther"
            value={formData.roleOther}
            onChange={handleChange}
            placeholder="Enter role name"
            className="w-full p-2 border rounded mt-2"
            required
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience
          </label>
          <select
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Years</option>
            {Array.from({ length: 21 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Months of Experience
          </label>
          <select
            name="monthsOfExperience"
            value={formData.monthsOfExperience}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {formData.roleType === 'IT' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Language</option>
            {filteredLanguages.map((language) => (
              <option key={language.name} value={language.name}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeCompensationData"
            name="includeCompensationData"
            checked={formData.includeCompensationData}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="includeCompensationData" className="ml-2 block text-sm text-gray-700">
            Include compensation related info
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeSimilarCompanies"
            name="includeSimilarCompanies"
            checked={formData.includeSimilarCompanies}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="includeSimilarCompanies" className="ml-2 block text-sm text-gray-700">
            Include similar roles at other top organizations
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${
            !isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Roadmap'}
        </button>
      </div>
    </form>
  );
}