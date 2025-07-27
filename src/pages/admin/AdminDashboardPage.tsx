import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import apiService from '../../services/api.ts';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalAttendance: number;
  presentToday: number;
  absentToday: number;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAttendance: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.organization) {
          // Fetch organization data including invite code
          const orgResponse = await apiService.getOrganization(user.organization);
          setOrganizationData(orgResponse.organization);
          
          // Fetch organization stats
          const statsResponse = await apiService.getOrganizationStats(user.organization);
          setStats({
            totalUsers: statsResponse.userStats.total,
            totalAttendance: 0, // This would come from attendance API
            presentToday: statsResponse.todayStats.present,
            absentToday: statsResponse.todayStats.absent
          });
        } else {
          // Mock data for non-organization users
          setStats({
            totalUsers: 150,
            totalAttendance: 1250,
            presentToday: 125,
            absentToday: 25
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Use mock data on error
        setStats({
          totalUsers: 150,
          totalAttendance: 1250,
          presentToday: 125,
          absentToday: 25
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users and monitor attendance</p>
      </div>

      {/* Organization Invite Code */}
      {organizationData?.inviteCode && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                🏢 {organizationData.name} - Employee Invite Code
              </h3>
              <p className="text-green-700 mb-4">
                Share this code with your employees to join your organization
              </p>
              <div className="bg-white border-2 border-green-300 rounded-lg p-4 inline-block">
                <span className="text-2xl font-mono font-bold text-green-800 tracking-wider">
                  {organizationData.inviteCode}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(organizationData.inviteCode);
                  toast.success('Invite code copied to clipboard!');
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                📋 Copy Code
              </button>
              <button
                onClick={() => {
                  const shareText = `Join ${organizationData.name}!\n\nUse invite code: ${organizationData.inviteCode}\n\nRegister at: ${window.location.origin}/employee-register?code=${organizationData.inviteCode}`;
                  navigator.clipboard.writeText(shareText);
                  toast.success('Share message copied to clipboard!');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                📤 Copy Share Message
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-700">
            <p><strong>Direct registration link:</strong></p>
            <p className="font-mono text-xs bg-green-200 p-2 rounded mt-1 break-all">
              {window.location.origin}/employee-register?code={organizationData.inviteCode}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-blue-600 mr-4">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-green-600 mr-4">📊</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttendance}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-green-600 mr-4">✅</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.presentToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-red-600 mr-4">❌</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.absentToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mr-3">👤</div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove users</p>
            </div>
          </Link>

          <Link
            to="/admin/attendance"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mr-3">📋</div>
            <div>
              <h3 className="font-medium text-gray-900">Attendance Records</h3>
              <p className="text-sm text-gray-600">View and manage attendance</p>
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mr-3">📈</div>
            <div>
              <h3 className="font-medium text-gray-900">Reports</h3>
              <p className="text-sm text-gray-600">Generate attendance reports</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-medium">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">John Doe checked in</p>
                <p className="text-sm text-gray-600">2 minutes ago</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-medium">+</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">New user registered: Jane Smith</p>
                <p className="text-sm text-gray-600">15 minutes ago</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 font-medium">✗</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Mike Johnson checked out</p>
                <p className="text-sm text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 