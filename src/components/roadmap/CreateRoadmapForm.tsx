import { useSession } from 'next-auth/react';
import { FiSearch, FiInfo } from 'react-icons/fi';
import CreatingRoadmapLoader from './CreatingRoadmapLoader';
import { useEffect, useState } from 'react';
import CustomDropdown from '../ui/CustomDropDown';
import { CREATE_ROADMAP_COMPANY_TOOLTIP, CREATE_ROADMAP_EXTRA_DETAILS_LABEL, CREATE_ROADMAP_EXTRA_DETAILS_LABEL_TOOLTIP, CREATE_ROADMAP_EXTRA_DETAILS_TOOLTIP, CREATE_ROADMAP_FRESHER_LABEL, CREATE_ROADMAP_INCLUDE_COMP_LABEL, CREATE_ROADMAP_INCLUDE_SIMILAR_ROLE_LABEL, CREATE_ROADMAP_ROLE_TOOLTIP, CREATE_ROADMAP_TARGET_DURATION_TOOLTIP, CREATE_ROADMAP_TOP_NOTE_LABEL } from '@/app/data/config';
import Tooltip from '../ui/Tooltip';
import ConfirmationModal from '../ui/ConfirmationModal';

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
    isFresher: false,
    yearsOfExperience: '',
    monthsOfExperience: '',
    programmingLanguage: '',
    targetDuration: 'Any',
    country: '',
    includeSimilarCompanies: false,
    includeCompensationData: false,
    includeOtherDetails: false,
    otherDetails: '',
  });
  const [companies, setCompanies] = useState<{ name: string, type: string }[]>([]);
  const [roles, setRoles] = useState<{ name: string, type: string }[]>([]);
  const [languages, setLanguages] = useState<{ name: string, type: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    company: '',
    role: '',
    country: '',
    language: ''
  });

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
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    //setLoading(true);
    if (!isFormValid) return;
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setShowConfirmation(false);
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
          // Clear experience fields if fresher is checked
          yearsOfExperience: formData.isFresher ? null : formData.yearsOfExperience,
          monthsOfExperience: formData.isFresher ? null : formData.monthsOfExperience,
          // Clear otherDetails if checkbox is not checked
          otherDetails: formData.includeOtherDetails ? formData.otherDetails : null,
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

  const roleTypeOptions = [
    { value: 'IT', label: 'IT' },
    { value: 'Non-IT', label: 'Non-IT' },
  ];

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

  const yearsOfExperienceOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i.toString(),
    label: i.toString(),
  }));

  const monthsOfExperienceOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: i.toString(),
  }));

  const targetDurationOptions = targetDurations.map(duration => ({
    value: duration.value,
    label: duration.label,
  }));

  const programmingLanguageOptions = languages.map(language => ({
    value: language.name,
    label: language.name,
  }));

  // Consistent checkbox component
  const Checkbox = ({ name, label, checked, onChange, tooltipContent }: {
    name: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    tooltipContent?: string;
  }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
      {tooltipContent && (
        <Tooltip content={tooltipContent} position='left'>
          <FiInfo className="ml-2 text-gray-400 hover:text-gray-600" size={16} />
        </Tooltip>
      )}
    </div>
  );

  // Add this function to render the details for confirmation
  const renderConfirmationDetails = () => {
    return (
      <div className="space-y-2">
        <div className="flex">
          <span className="w-1/3 text-gray-600">Company:</span>
          <span className="w-2/3 font-medium">
            {formData.company === 'Other' ? formData.companyOther : formData.company}
          </span>
        </div>
        <div className="flex">
          <span className="w-1/3 text-gray-600">Designation:</span>
          <span className="w-2/3 font-medium">
            {formData.role === 'Other' ? formData.roleOther : formData.role}
          </span>
        </div>
        {formData.country && (
          <div className="flex">
            <span className="w-1/3 text-gray-600">Country:</span>
            <span className="w-2/3 font-medium">{formData.country}</span>
          </div>
        )}
        {(formData.isFresher || parseInt(formData.yearsOfExperience, 10) > 0 || parseInt(formData.monthsOfExperience, 10) > 0) && (
          <div className="flex">
            <span className="w-1/3 text-gray-600">Work Experience:</span>
            <span className="w-2/3 font-medium">
              {formData.isFresher
                ? 'Fresher'
                : `${formData.yearsOfExperience || 0} years ${formData.monthsOfExperience || 0} months`}
            </span>
          </div>
        )}
        {formData.roleType === 'IT' && formData.programmingLanguage && (
          <div className="flex">
            <span className="w-1/3 text-gray-600">Language:</span>
            <span className="w-2/3 font-medium">{formData.programmingLanguage}</span>
          </div>
        )}
        {(formData.includeCompensationData || formData.includeSimilarCompanies || (formData.includeOtherDetails && formData.otherDetails)) && (
          <div className="flex items-center">
            <span className="w-1/3 text-gray-600">Includes:</span>
          </div>
        )}
        {formData.includeCompensationData && (
          <div className="flex items-center">
            <span className="w-1/3 text-gray-600"></span>
            <span className="w-2/3 font-medium flex items-center">
              <span className="text-green-500 mr-1">✓</span>&nbsp; Compensation Data
            </span>
          </div>
        )}
        {formData.includeSimilarCompanies && (
          <div className="flex items-center">
            <span className="w-1/3 text-gray-600"></span>
            <span className="w-2/3 font-medium flex items-center">
              <span className="text-green-500 mr-1">✓</span>&nbsp; Similar Roles
            </span>
          </div>
        )}
        {formData.includeOtherDetails && formData.otherDetails && (
          <div className="flex items-center">
            <span className="w-1/3 text-gray-600"></span>
            <span className="w-2/3 font-medium flex items-center">
              <span className="text-green-500 mr-1">✓</span>&nbsp; Additional Details
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {loading && <CreatingRoadmapLoader />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informational Note */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              {/* <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg> */}
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {CREATE_ROADMAP_TOP_NOTE_LABEL}
              </p>
            </div>
          </div>
        </div>

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
          <CustomDropdown
            options={roleTypeOptions}
            value={formData.roleType}
            onChange={(value) => setFormData(prev => ({ ...prev, roleType: value }))}
            placeholder="Select Role Type"
            searchPlaceholder="Search type..."
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Company <span className="text-red-500">*</span>
            <Tooltip content={CREATE_ROADMAP_COMPANY_TOOLTIP} position='right'>
              <FiInfo className="ml-2 inline text-gray-400 hover:text-gray-600" size={16} />
            </Tooltip>
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
            <Tooltip content={CREATE_ROADMAP_ROLE_TOOLTIP} position='right'>
              <FiInfo className="ml-2 inline text-gray-400 hover:text-gray-600" size={16} />
            </Tooltip>
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
            <Tooltip content="Country at which you are applying for the position" position='right'>
              <FiInfo className="ml-2 inline text-gray-400 hover:text-gray-600" size={16} />
            </Tooltip>
          </label>

          <CustomDropdown
            options={countryOptions}
            value={formData.country}
            onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
            placeholder="Select Country"
            searchPlaceholder="Search countries..."
          />
        </div>

        {/* Fresher Checkbox */}
        <Checkbox
          name="isFresher"
          label={CREATE_ROADMAP_FRESHER_LABEL}
          checked={formData.isFresher}
          onChange={handleChange}
        />

        {/* Experience - Hidden when fresher is checked */}
        {!formData.isFresher && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <CustomDropdown
                options={yearsOfExperienceOptions}
                value={formData.yearsOfExperience}
                onChange={(value) => setFormData(prev => ({ ...prev, yearsOfExperience: value }))}
                placeholder="Select Years of Experience"
                searchPlaceholder="Search years..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Months of Experience
              </label>
              <CustomDropdown
                options={monthsOfExperienceOptions}
                value={formData.monthsOfExperience}
                onChange={(value) => setFormData(prev => ({ ...prev, monthsOfExperience: value }))}
                placeholder="Select Months of Experience"
                searchPlaceholder="Search months..."
              />
            </div>
          </div>
        )}

        {/* Target Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Duration
            <Tooltip content={CREATE_ROADMAP_TARGET_DURATION_TOOLTIP} position='right'>
              <FiInfo className="ml-2 inline text-gray-400 hover:text-gray-600" size={16} />
            </Tooltip>
          </label>
          <CustomDropdown
            options={targetDurationOptions.map(duration => ({
              value: duration.value,
              label: duration.label,
            }))}
            value={formData.targetDuration}
            onChange={(value) => setFormData(prev => ({ ...prev, targetDuration: value }))}
            placeholder="Select Trget Duration"
            searchPlaceholder="Search durations..."
          />
        </div>

        {/* Programming Language (only for IT roles) */}
        {formData.roleType === 'IT' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Language
            </label>
            <CustomDropdown
              options={programmingLanguageOptions.map(duration => ({
                value: duration.value,
                label: duration.label,
              }))}
              value={formData.programmingLanguage}
              onChange={(value) => setFormData(prev => ({ ...prev, programmingLanguage: value }))}
              placeholder="Select Programming Language"
              searchPlaceholder="Search languages..."
            />
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          <Checkbox
            name="includeCompensationData"
            label={CREATE_ROADMAP_INCLUDE_COMP_LABEL}
            checked={formData.includeCompensationData}
            onChange={handleChange}
          />
          <Checkbox
            name="includeSimilarCompanies"
            label={CREATE_ROADMAP_INCLUDE_SIMILAR_ROLE_LABEL}
            checked={formData.includeSimilarCompanies}
            onChange={handleChange}
          />
          <Checkbox
            name="includeOtherDetails"
            label={CREATE_ROADMAP_EXTRA_DETAILS_LABEL}
            checked={formData.includeOtherDetails}
            onChange={handleChange}
            tooltipContent={CREATE_ROADMAP_EXTRA_DETAILS_LABEL_TOOLTIP}
          />
        </div>

        {/* Additional Details Text Area */}
        {formData.includeOtherDetails && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
              <Tooltip content={CREATE_ROADMAP_EXTRA_DETAILS_TOOLTIP}>
                <FiInfo className="ml-2 text-gray-400 hover:text-gray-600" size={16} />
              </Tooltip>
            </label>
            <textarea
              name="otherDetails"
              value={formData.otherDetails}
              onChange={handleChange}
              placeholder="Any additional things that might help us create a better roadmap for you..."
              className="w-full p-2 border rounded h-32 resize-y"
              rows={4}
            />
          </div>
        )}

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

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmSubmission}
        title="Hooray! Your new roadmap is about to generate"
        message="Do not mistake anything in excietment, Please review the provided information:"
        details={renderConfirmationDetails()}
        isWarningAdded={true}
        warningText="This will deduct 1 credit from your account"
        confirmText="Create Roadmap"
        cancelText="Go Back"
      />
    </>
  );
}