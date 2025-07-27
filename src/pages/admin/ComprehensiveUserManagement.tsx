import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import toast from 'react-hot-toast';
import apiService, { User, Organization } from '../../services/api.ts';

interface UserManagementData {
  users: User[];
  organization: Organization;
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

const ComprehensiveUserManagement: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UserManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    role: 'all',
    status: 'all',
    page: 1,
    limit: 50
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // For super admin, we might need organization selection
      // For now, assuming we're showing current user's organization
      const orgId = user?.organization || 'current';
      
      const response = await apiService.getOrganizationUsers(orgId, {
        ...filters,
        search: filters.search || undefined,
        department: filters.department === 'all' ? undefined : filters.department,
        role: filters.role === 'all' ? undefined : filters.role,
        isActive: filters.status === 'all' ? undefined : filters.status === 'active'
      });
      
      setData(response);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch users');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? Number(value) : 1 // Reset page when other filters change
    }));
  };

  const exportToCSV = () => {
    if (!data?.users.length) {
      toast.error('No data to export');
      return;
    }

    const csvData = [
      // Headers
      [
        'Employee ID',
        'Name',
        'Email',
        'Phone Number',
        'Department',
        'Designation',
        'Role',
        'Status',
        'Today Check-In',
        'Today Check-Out',
        'Total Hours Today',
        'Attendance Status',
        'Face Enrolled',
        'Last Login',
        'Created Date'
      ].join(','),
      // Data rows
      ...data.users.map(user => [
        user.employeeId,
        `"${user.fullName}"`,
        user.email,
        user.phoneNumber,
        `"${user.department}"`,
        `"${user.designation}"`,
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        user.todayAttendance?.checkInFormatted || '-',
        user.todayAttendance?.checkOutFormatted || '-',
        user.todayAttendance?.totalHours || 0,
        user.todayAttendance?.status || 'absent',
        user.faceEnrolled ? 'Yes' : 'No',
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
        new Date(user.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.organization.name}-employees-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Failed to load user data</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {data.organization.name} - Employee Management
        </h1>
        <p className="text-gray-600 mt-2">
          {getOrganizationTypeDisplay(data.organization.type)} • 
          Comprehensive view of all {data.pagination.total} employees/students/workers
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Name, email, phone, ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Departments</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Roles</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          
          <div>
            <button
              onClick={exportToCSV}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600 mr-3">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total People</p>
              <p className="text-xl font-bold text-gray-900">{data.pagination.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="text-2xl text-green-600 mr-3">✅</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-xl font-bold text-gray-900">
                {data.users.filter(u => u.todayAttendance?.status === 'present').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="text-2xl text-red-600 mr-3">❌</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-xl font-bold text-gray-900">
                {data.users.filter(u => u.todayAttendance?.status === 'absent').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="text-2xl text-yellow-600 mr-3">⚠️</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Partial/Late</p>
              <p className="text-xl font-bold text-gray-900">
                {data.users.filter(u => u.todayAttendance?.status === 'partial').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today's Attendance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System Info
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  {/* Employee Details */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">ID: {user.employeeId}</div>
                      <div className="text-sm text-gray-500">{user.department} • {user.designation}</div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                    </div>
                  </td>

                  {/* Today's Attendance */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ${getStatusBadge(user.todayAttendance?.status || 'absent')}`}>
                        {(user.todayAttendance?.status || 'absent').toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        <div>In: {user.todayAttendance?.checkInFormatted || '-'}</div>
                        <div>Out: {user.todayAttendance?.checkOutFormatted || '-'}</div>
                        {(user.todayAttendance?.totalHours || 0) > 0 && (
                          <div className="font-medium">Hours: {user.todayAttendance?.totalHours}h</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status & Role */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role.toUpperCase()}
                      </span>
                      {!user.isApproved && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          PENDING
                        </span>
                      )}
                    </div>
                  </td>

                  {/* System Info */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className={`text-xs ${user.faceEnrolled ? 'text-green-600' : 'text-red-600'}`}>
                        Face: {user.faceEnrolled ? 'Enrolled' : 'Not Enrolled'}
                      </div>
                      <div className="text-xs">
                        Last Login: {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString() 
                          : 'Never'}
                      </div>
                      <div className="text-xs">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', Math.min(data.pagination.pages, filters.page + 1))}
                disabled={filters.page === data.pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{((filters.page - 1) * filters.limit) + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(filters.page * filters.limit, data.pagination.total)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{data.pagination.total}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handleFilterChange('page', pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          filters.page === pageNumber
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handleFilterChange('page', Math.min(data.pagination.pages, filters.page + 1))}
                    disabled={filters.page === data.pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {data.users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No employees found matching your criteria.</div>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveUserManagement; 