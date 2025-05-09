// components/MaintenanceBanner.tsx
import { useEffect, useState } from 'react';
import { getConfig } from '../../../../lib/config';

interface MaintenanceBannerConfig {
  isActive: boolean;
  content: string;
}

export default function MaintenanceBanner() {
  const [maintenanceBannerConfig, setMaintenanceBannerConfig] = useState<MaintenanceBannerConfig>({
    isActive: false,
    content: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        // Fetch both configs in parallel
        const [isActiveConfig, textConfig] = await Promise.all([
          getConfig('maintenanceBannerIsActive'),
          getConfig('maintenanceBannerText'),
        ]);

        setMaintenanceBannerConfig({
          isActive: isActiveConfig.maintenanceBannerIsActive === 'true',
          content: textConfig.maintenanceBannerText,
        });
      } catch (error) {
        console.error('Error fetching maintenance banner config:', error);
        // Fallback to inactive if there's an error
        setMaintenanceBannerConfig({
          isActive: false,
          content: '',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  if (!maintenanceBannerConfig.isActive) {
    return null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {maintenanceBannerConfig.content}
          </p>
        </div>
      </div>
    </div>
  );
}