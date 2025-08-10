import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import apiService from '../../services/api.ts';
import toast from 'react-hot-toast';

interface AttendanceRecord {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    employeeId: string;
    department: string;
  };
  type: 'check-in' | 'check-out' | 'break-start' | 'break-end';
  checkInTime: string;
  checkOutTime?: string;
  totalHours?: number;
  status: 'present' | 'absent' | 'partial' | 'auto-approved' | 'pending';
  isOffline: boolean;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

const AttendanceManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedDate, searchTerm]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAttendanceByDate(selectedDate, searchTerm);
      setAttendanceRecords(response.data.attendance);
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch attendance records');
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotalHours = (checkIn: string, checkOut: string): number => {
    const checkInTime = new Date(`2000-01-01 ${checkIn}`);
    const checkOutTime = new Date(`2000-01-01 ${checkOut}`);
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    return Number((diffMs / (1000 * 60 * 60)).toFixed(1));
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Employee ID', 'Department', 'Type', 'Check In', 'Check Out', 'Total Hours', 'Status'],
      ...filteredRecords.map(record => [
        record.user.fullName,
        record.user.employeeId,
        record.user.department,
        record.type,
        new Date(record.checkInTime).toLocaleTimeString(),
        record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A',
        record.totalHours?.toString() || 'N/A',
        record.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-600 mt-2">View and manage attendance records</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-green-600 mr-4">✅</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredRecords.filter(r => r.type === 'check-in').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-red-600 mr-4">❌</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Check-outs</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredRecords.filter(r => r.type === 'check-out').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-yellow-600 mr-4">⏰</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Breaks</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredRecords.filter(r => r.type.includes('break')).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl text-blue-600 mr-4">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Info
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.user.fullName}</div>
                    <div className="text-sm text-gray-500">ID: {record.user.employeeId}</div>
                    <div className="text-sm text-gray-500">{record.user.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.type === 'check-in' ? 'bg-green-100 text-green-800' :
                      record.type === 'check-out' ? 'bg-red-100 text-red-800' :
                      record.type === 'break-start' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {record.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-green-600 font-medium">
                      {new Date(record.checkInTime).toLocaleTimeString()}
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(record.checkInTime).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkOutTime ? (
                      <>
                        <span className="text-red-600 font-medium">
                          {new Date(record.checkOutTime).toLocaleTimeString()}
                        </span>
                        <div className="text-xs text-gray-500">
                          {new Date(record.checkOutTime).toLocaleDateString()}
                        </div>
                      </>
                    ) : record.type === 'check-in' ? (
                      <span className="text-yellow-600">Still working</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'auto-approved' ? 'bg-green-100 text-green-800' :
                      record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {record.isOffline && (
                        <div className="flex items-center text-orange-600">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Offline
                        </div>
                      )}
                      <div className="text-xs">
                        Confidence: {Math.round(record.confidence * 100)}%
                      </div>
                      {record.location && (
                        <div className="text-xs text-blue-600">
                          📍 Location tracked
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No attendance records found for the selected date.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagementPage; 