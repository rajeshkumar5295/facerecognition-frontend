import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import apiService from '../../services/api.ts';
import toast from 'react-hot-toast';

interface GlobalStats {
  totalOrganizations: number;
  organizationsByType: Array<{ _id: string; count: number }>;
  totalUsers: number;
  totalAttendance: number;
  todayAttendance: number;
}

interface Organization {
  _id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalAttendanceRecords: number;
  };
  subscription: {
    plan: string;
    maxUsers: number;
    isActive: boolean;
  };
  createdAt: string;
}

interface OrganizationsData {
  organizations: Organization[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [recentOrgs, setRecentOrgs] = useState<OrganizationsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch global stats and recent organizations in parallel
      const [statsResponse, orgsResponse] = await Promise.all([
        apiService.getGlobalStats(),
        apiService.getOrganizations({ page: 1, limit: 10 })
      ]);

      setGlobalStats(statsResponse);
      setRecentOrgs(orgsResponse);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard data');
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

  const getOrganizationTypeDisplay = (type: string) => {
    const types: { [key: string]: string } = {
      school: 'School',
      office: 'Office',
      hotel: 'Hotel',
      hospital: 'Hospital',
      factory: 'Factory',
      retail: 'Retail',
      other: 'Other'
    };
    return types[type] || type;
  };

  const getPlanBadgeColor = (plan: string) => {
    const colors: { [key: string]: string } = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-green-100 text-green-800'
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Global overview of all organizations and their attendance systems
        </p>
      </div>

      {/* Global Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-blue-600 mr-4">🏢</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Organizations</p>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats?.totalOrganizations || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-green-600 mr-4">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats?.totalUsers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-purple-600 mr-4">📊</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attendance Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats?.totalAttendance?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-orange-600 mr-4">✅</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats?.todayAttendance || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-red-600 mr-4">📈</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Daily Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats?.totalUsers ? 
                  Math.round((globalStats.todayAttendance / globalStats.totalUsers) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Types Breakdown */}
      {globalStats?.organizationsByType && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Organizations by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {globalStats.organizationsByType.map((orgType) => (
              <div key={orgType._id} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-2">{getOrganizationTypeIcon(orgType._id)}</div>
                <div className="text-sm text-gray-600">{getOrganizationTypeDisplay(orgType._id)}</div>
                <div className="text-xl font-bold text-gray-900">{orgType.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/super-admin/organizations"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mr-3">🏢</div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Organizations</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove organizations</p>
            </div>
          </Link>

          <Link
            to="/super-admin/users"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mr-3">👥</div>
            <div>
              <h3 className="font-medium text-gray-900">Global User Management</h3>
              <p className="text-sm text-gray-600">Manage users across all organizations</p>
            </div>
          </Link>

          <Link
            to="/super-admin/analytics"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mr-3">📊</div>
            <div>
              <h3 className="font-medium text-gray-900">Analytics & Reports</h3>
              <p className="text-sm text-gray-600">Global insights and reporting</p>
            </div>
          </Link>

          <Link
            to="/super-admin/settings"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mr-3">⚙️</div>
            <div>
              <h3 className="font-medium text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600">Configure global system settings</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Organizations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Organizations</h2>
          <Link
            to="/super-admin/organizations"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrgs?.organizations.map((org) => (
                <tr key={org._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{getOrganizationTypeIcon(org.type)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{org.name}</div>
                        {org.description && (
                          <div className="text-sm text-gray-500">{org.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getOrganizationTypeDisplay(org.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{org.stats.totalUsers} Total</div>
                      <div className="text-gray-500">{org.stats.activeUsers} Active</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanBadgeColor(org.subscription.plan)}`}>
                      {org.subscription.plan.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      org.isActive && org.subscription.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {org.isActive && org.subscription.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/super-admin/organizations/${org._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/super-admin/organizations/${org._id}/users`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Users
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!recentOrgs?.organizations?.length) && (
          <div className="text-center py-12">
            <div className="text-gray-500">No organizations found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 