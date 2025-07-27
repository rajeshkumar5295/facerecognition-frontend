import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import apiService, { AttendanceRecord } from '../../services/api.ts';
import LoadingSpinner from '../../components/common/LoadingSpinner.tsx';
import toast from 'react-hot-toast';

interface DashboardStats {
  todayAttendance: AttendanceRecord[];
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  workingHours: number;
  thisWeekHours: number;
  thisMonthHours: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todayAttendance: [],
    hasCheckedIn: false,
    hasCheckedOut: false,
    workingHours: 0,
    thisWeekHours: 0,
    thisMonthHours: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load today's attendance
      const { attendance } = await apiService.getTodayAttendance();
      
      // Calculate stats
      const hasCheckedIn = attendance.some(record => record.type === 'check-in');
      const hasCheckedOut = attendance.some(record => record.type === 'check-out');
      
      let workingHours = 0;
      if (hasCheckedIn && hasCheckedOut) {
        const checkIn = attendance.find(record => record.type === 'check-in');
        const checkOut = attendance.find(record => record.type === 'check-out');
        if (checkIn && checkOut && checkOut.checkOutTime) {
          const diff = new Date(checkOut.checkOutTime).getTime() - new Date(checkIn.checkInTime).getTime();
          workingHours = diff / (1000 * 60 * 60); // Convert to hours
        }
      }

      // Get attendance summary for this week and month
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const [weekSummary, monthSummary] = await Promise.all([
        apiService.getAttendanceSummary(
          startOfWeek.toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ),
        apiService.getAttendanceSummary(
          startOfMonth.toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        )
      ]);

      setStats({
        todayAttendance: attendance,
        hasCheckedIn,
        hasCheckedOut,
        workingHours,
        thisWeekHours: weekSummary.metrics.totalWorkingHours / 60, 
        thisMonthHours: monthSummary.metrics.totalWorkingHours / 60
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTodayStatus = () => {
    if (!stats.hasCheckedIn) {
      return { text: 'Not checked in', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    } else if (stats.hasCheckedIn && !stats.hasCheckedOut) {
      return { text: 'Currently working', color: 'text-success-600', bgColor: 'bg-success-100' };
    } else {
      return { text: 'Day completed', color: 'text-primary-600', bgColor: 'bg-primary-100' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const todayStatus = getTodayStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-soft text-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {getGreeting()}, {user?.firstName}!
            </h1>
            <p className="text-primary-100 mt-1 text-sm sm:text-base">
              Welcome to your attendance dashboard
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-primary-100">Today's Date</p>
            <p className="text-base sm:text-lg font-semibold">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Today's Status */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6">
          <div className="flex items-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${todayStatus.bgColor} flex items-center justify-center`}>
              <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${todayStatus.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Today's Status</p>
              <p className={`text-base sm:text-lg font-semibold ${todayStatus.color}`}>
                {todayStatus.text}
              </p>
            </div>
          </div>
        </div>

        {/* Today's Hours */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-success-100 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Today's Hours</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {formatHours(stats.workingHours)}
              </p>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-warning-100 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">This Week</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {formatHours(stats.thisWeekHours)}
              </p>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">This Month</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {formatHours(stats.thisMonthHours)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Attendance Actions */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/attendance"
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Mark Attendance</p>
                  <p className="text-sm text-gray-500">Use face recognition to check in/out</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/profile"
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">View Profile</p>
                  <p className="text-sm text-gray-500">Update your information and settings</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {!user?.aadhaarVerified && (
              <Link
                to="/aadhaar-verification"
                className="w-full flex items-center justify-between p-4 border border-warning-200 bg-warning-50 rounded-lg hover:border-warning-300 hover:bg-warning-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-warning-800">Verify Aadhaar</p>
                    <p className="text-sm text-warning-600">Complete your identity verification</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Today's Activity */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Today's Activity</h2>
          {stats.todayAttendance.length > 0 ? (
            <div className="space-y-3">
              {stats.todayAttendance.map((record, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      record.type === 'check-in' ? 'bg-success-500' :
                      record.type === 'check-out' ? 'bg-danger-500' :
                      'bg-warning-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {record.type.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(record.checkInTime)}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.status === 'auto-approved' ? 'bg-success-100 text-success-800' :
                    record.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No activity today</h3>
              <p className="mt-1 text-sm text-gray-500">Start by marking your attendance</p>
              <div className="mt-6">
                <Link
                  to="/attendance"
                  className="btn btn-primary btn-sm"
                >
                  Mark Attendance
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Status */}
      {(!user?.isApproved || !user?.faceEnrolled || !user?.aadhaarVerified) && (
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Account Setup</h2>
          <div className="space-y-4">
            {/* Approval Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user?.isApproved ? 'bg-success-100' : 'bg-warning-100'
                }`}>
                  <svg className={`w-4 h-4 ${
                    user?.isApproved ? 'text-success-600' : 'text-warning-600'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm sm:text-base font-medium text-gray-900">Account Approval</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {user?.isApproved ? 'Account approved' : 'Pending admin approval'}
                  </p>
                </div>
              </div>
              <span className={`badge ${user?.isApproved ? 'badge-success' : 'badge-warning'}`}>
                {user?.isApproved ? 'Approved' : 'Pending'}
              </span>
            </div>

            {/* Face Enrollment Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user?.faceEnrolled ? 'bg-success-100' : 'bg-warning-100'
                }`}>
                  <svg className={`w-4 h-4 ${
                    user?.faceEnrolled ? 'text-success-600' : 'text-warning-600'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Face Recognition</p>
                  <p className="text-sm text-gray-500">
                    {user?.faceEnrolled ? 'Face enrolled successfully' : 'Face enrollment required'}
                  </p>
                </div>
              </div>
              <span className={`badge ${user?.faceEnrolled ? 'badge-success' : 'badge-warning'}`}>
                {user?.faceEnrolled ? 'Enrolled' : 'Required'}
              </span>
            </div>

            {/* Aadhaar Verification Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user?.aadhaarVerified ? 'bg-success-100' : 'bg-gray-100'
                }`}>
                  <svg className={`w-4 h-4 ${
                    user?.aadhaarVerified ? 'text-success-600' : 'text-gray-400'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Aadhaar Verification</p>
                  <p className="text-sm text-gray-500">
                    {user?.aadhaarVerified ? 'Aadhaar verified' : 'Optional identity verification'}
                  </p>
                </div>
              </div>
              <span className={`badge ${user?.aadhaarVerified ? 'badge-success' : 'badge-secondary'}`}>
                {user?.aadhaarVerified ? 'Verified' : 'Optional'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 