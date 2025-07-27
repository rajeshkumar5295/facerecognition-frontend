import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import apiService, { Organization } from '../../services/api.ts';
import toast from 'react-hot-toast';

interface OrganizationSelectorProps {
  selectedOrganization?: string;
  onSelect: (organization: Organization) => void;
  className?: string;
  placeholder?: string;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  selectedOrganization,
  onSelect,
  className = '',
  placeholder = 'Select an organization...'
}) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'super-admin') {
      fetchOrganizations();
    }
  }, [user]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrganizations({ 
        limit: 100, 
        isActive: true 
      });
      setOrganizations(response.organizations);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const getOrganizationTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      school: '🏫',
      office: '🏢',
      hotel: '🏨',
      hospital: '🏥',
      factory: '🏭',
      retail: '🏪',
      other: '🏛️'
    };
    return icons[type] || '🏛️';
  };

  if (user?.role !== 'super-admin') {
    return null; // Only show for super admins
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Organization
      </label>
      <select
        value={selectedOrganization || ''}
        onChange={(e) => {
          const org = organizations.find(o => o._id === e.target.value);
          if (org) {
            onSelect(org);
          }
        }}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option value="">{loading ? 'Loading...' : placeholder}</option>
        {organizations.map((org) => (
          <option key={org._id} value={org._id}>
            {getOrganizationTypeIcon(org.type)} {org.name} ({org.type})
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrganizationSelector; 