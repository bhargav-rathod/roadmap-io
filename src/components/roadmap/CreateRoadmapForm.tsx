import { useSession } from 'next-auth/react';
import { FiSearch, FiInfo } from 'react-icons/fi';
import CreatingRoadmapLoader from './CreatingRoadmapLoader';
import { useEffect, useRef, useState } from 'react';
import CustomDropdown from '../ui/CustomDropDown';

export default function CreateRoadmapForm({ onSuccess, onCancel }: {
  onSuccess: (roadmap: any) => void;
  onCancel: () => void
}) {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    roleType: '',
    company: '',
    companyOther: '',
    role: '',
    roleOther: '',
    yearsOfExperience: '',
    monthsOfExperience: '',
    programmingLanguage: '',
    targetDuration: 'Any',
    country: '',
    includeSimilarCompanies: false,
    includeCompensationData: false,
  });
  const [companies, setCompanies] = useState<{ name: string, type: string }[]>([]);
  const [roles, setRoles] = useState<{ name: string, type: string }[]>([]);
  const [languages, setLanguages] = useState<{ name: string, type: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState({
    company: '',
    role: '',
    country: '',
    language: ''
  });
  const [showTooltip, setShowTooltip] = useState({
    company: false,
    role: false
  });

  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data only once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, rolesRes, languagesRes, countriesRes] = await Promise.all([
          fetch('/api/companies').then(res => res.json()),
          fetch('/api/roles').then(res => res.json()),
          fetch('/api/programmingLanguages').then(res => res.json()),
          fetch('/api/countries').then(res => res.json()),
        ]);

        setCompanies(companiesRes);
        setRoles(rolesRes);
        setLanguages(languagesRes);
        setCountries(countriesRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchTerm(prev => ({
      ...prev,
      [name]: value.toLowerCase()
    }));
  };

  const handleTooltip = (field: 'company' | 'role', show: boolean) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    if (show) {
      setShowTooltip(prev => ({
        ...prev,
        [field]: true
      }));
    } else {
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(prev => ({
          ...prev,
          [field]: false
        }));
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      if (session.user.credits <= 0) {
        throw new Error('Insufficient credits to create roadmap');
      }

      // Get explicit delay from environment variable or default to 2000ms
      const explicitDelay = process.env.CREATE_ROADMAP_EXPLICIT_DELAY
        ? parseInt(process.env.CREATE_ROADMAP_EXPLICIT_DELAY, 10)
        : 2000;

      // Add explicit delay for testing
      await new Promise(resolve => setTimeout(resolve, explicitDelay));

      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
          title: `${formData.role === 'Other' ? formData.roleOther : formData.role} at ${formData.company === 'Other' ? formData.companyOther : formData.company}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create roadmap');
      }

      const { newRoadmap, updatedCredits } = await response.json();

      await update({
        user: {
          ...session.user,
          credits: updatedCredits
        }
      });
      onSuccess(newRoadmap);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const isFormValid = formData.roleType &&
    formData.company &&
    (formData.company !== 'Other' || formData.companyOther) &&
    formData.role &&
    (formData.role !== 'Other' || formData.roleOther);

  const filteredRoles = roles.filter(role =>
    (!formData.roleType || role.type === formData.roleType || role.type === 'Both') &&
    (!searchTerm.role || role.name.toLowerCase().includes(searchTerm.role))
  );

  const filteredCompanies = companies.filter(company =>
    (!formData.roleType || company.type === formData.roleType || company.type === 'Both') &&
    (!searchTerm.company || company.name.toLowerCase().includes(searchTerm.company))
  );

  const filteredLanguages = languages.filter(language =>
    (!formData.roleType || language.type === formData.roleType || language.type === 'Both') &&
    (!searchTerm.language || language.name.toLowerCase().includes(searchTerm.language))
  );

  const filteredCountries = countries.filter(country =>
    !searchTerm.country || country.name.toLowerCase().includes(searchTerm.country)
  );

  const targetDurations = [
    { value: 'Any', label: 'Any' },
    { value: '1 Month', label: '1 Month' },
    { value: '2 Months', label: '2 Months' },
    { value: '3 Months', label: '3 Months' },
    { value: '6 Months', label: '6 Months' },
    { value: '1 Year', label: '1 Year' },
    { value: '2 Years', label: '2 Years' },
    { value: '3 Years', label: '3 Years' },
    { value: 'Not decided yet', label: 'Not decided yet' },
  ];

  // Convert your data to dropdown options
  const companyOptions = companies.map(company => ({
    value: company.name,
    label: company.name,
  }));

  const roleOptions = roles
    .filter(role =>
      (!formData.roleType || role.type === formData.roleType || role.type === 'Both')
    )
    .map(role => ({
      value: role.name,
      label: role.name,
    }));

  const countryOptions = countries.map(country => ({
    value: country.name,
    label: country.name,
  }));


  return (
    <>
      {loading && <CreatingRoadmapLoader />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Role Type */}
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

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Company <span className="text-red-500">*</span>
            <span className="ml-2 relative">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onMouseEnter={() => handleTooltip('company', true)}
                onMouseLeave={() => handleTooltip('company', false)}
                onClick={(e) => {
                  e.preventDefault();
                  handleTooltip('company', !showTooltip.company);
                }}
              >
                <FiInfo size={18} />
              </button>
              {showTooltip.company && (
                <div className="absolute z-10 left-0 mt-2 w-64 p-3 bg-black text-white text-sm rounded shadow-lg">
                  If you don't find your designated company name then don't worry,
                  we have got you covered, choose "Other" and add exact company name in the field.
                </div>
              )}
            </span>
          </label>
          <CustomDropdown
            options={companyOptions}
            value={formData.company}
            onChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
            placeholder="Select Company"
            searchPlaceholder="Search companies..."
          />
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


        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Role <span className="text-red-500">*</span>
            <span className="ml-2 relative">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onMouseEnter={() => handleTooltip('role', true)}
                onMouseLeave={() => handleTooltip('role', false)}
                onClick={(e) => {
                  e.preventDefault();
                  handleTooltip('role', !showTooltip.role);
                }}
              >
                <FiInfo size={18} />
              </button>
              {showTooltip.role && (
                <div className="absolute z-10 left-0 mt-2 w-64 p-3 bg-black text-white text-sm rounded shadow-lg">
                  If you don't find your designated role name then don't worry,
                  we have got you covered, choose "Other" and add exact role name in the field.
                </div>
              )}
            </span>
          </label>
          <CustomDropdown
            options={roleOptions}
            value={formData.role}
            onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            placeholder="Select Role"
            searchPlaceholder="Search roles..."
          />
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

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <CustomDropdown
            options={countryOptions}
            value={formData.country}
            onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
            placeholder="Select Country"
            searchPlaceholder="Search countries..."
          />
        </div>

        {/* Experience */}
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
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Duration
          </label>
          <select
            name="targetDuration"
            value={formData.targetDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {targetDurations.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </div>

        {/* Programming Language (only for IT roles) */}
        {formData.roleType === 'IT' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Language
            </label>
            <select
              name="programmingLanguage"
              value={formData.programmingLanguage}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Language</option>
              <option value="" disabled className="p-2 bg-gray-100">
                <div className="flex items-center">
                  <FiSearch className="mr-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search languages..."
                    className="border-none bg-transparent outline-none w-full text-sm"
                    value={searchTerm.language}
                    onChange={(e) => handleSearchChange(e)}
                    name="language"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </option>
              {filteredLanguages.map((language) => (
                <option key={language.name} value={language.name}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Options */}
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

        {/* Buttons */}
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
            className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${!isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            Create Roadmap
          </button>
        </div>
      </form>
    </>
  );
}