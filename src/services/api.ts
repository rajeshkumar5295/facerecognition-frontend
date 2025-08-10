import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Declare process for TypeScript
declare const process: {
  env: {
    REACT_APP_API_URL?: string;
  };
};

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  phoneNumber: string;
  role: 'employee' | 'admin' | 'hr' | 'super-admin';
  organization?: string;
  isActive: boolean;
  isApproved: boolean;
  faceEnrolled: boolean;
  faceEnrollmentAttempts: number;
  aadhaarNumber?: string;
  aadhaarVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  todayAttendance?: {
    checkInTime: string | null;
    checkOutTime: string | null;
    totalHours: number;
    status: 'present' | 'absent' | 'partial';
    checkInFormatted: string;
    checkOutFormatted: string;
  };
}

interface Organization {
  _id: string;
  name: string;
  type: 'school' | 'office' | 'hotel' | 'hospital' | 'factory' | 'retail' | 'other';
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  settings: {
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
    timezone: string;
    lateThreshold: number;
    requireFaceRecognition: boolean;
    allowOfflineMode: boolean;
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    maxUsers: number;
    expiresAt?: string;
    isActive: boolean;
  };
  isActive: boolean;
  createdBy?: string;
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalAttendanceRecords: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface LoginData {
  user: User;
  token: string;
}

interface AttendanceRecord {
  _id: string;
  user: User | string;
  type: 'check-in' | 'check-out' | 'break-start' | 'break-end';
  checkInTime: string;
  checkOutTime?: string;
  recognitionMethod: 'face-recognition' | 'manual' | 'aadhaar-assisted';
  faceConfidence?: number;
  status: 'pending' | 'approved' | 'rejected' | 'auto-approved';
  workingHours: number;
  breakTime: number;
  overtime: number;
  isOfflineEntry: boolean;
  notes?: string;
  createdAt: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        } else if (error.response?.status === 403) {
          toast.error('Access denied. Insufficient permissions.');
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleRequest<T>(
    request: Promise<AxiosResponse<ApiResponse<T>>>
  ): Promise<T> {
    try {
      const response = await request;
      return response.data.data as T;
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      throw new Error(message);
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<LoginData> {
    return this.handleRequest(
      this.api.post('/auth/login', { email, password })
    );
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    department: string;
    designation: string;
    phoneNumber: string;
    password: string;
    aadhaarNumber?: string;
  }): Promise<LoginData> {
    return this.handleRequest(
      this.api.post('/auth/register', userData)
    );
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.post('/auth/forgot-password', { email })
    );
  }

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<LoginData> {
    return this.handleRequest(
      this.api.patch(`/auth/reset-password/${token}`, { password, confirmPassword })
    );
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.patch('/auth/change-password', { currentPassword, newPassword, confirmPassword })
    );
  }

  async performAdminAction(userId: string, action: string, reason?: string): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.post(`/users/${userId}/admin-action`, { action, reason })
    );
  }

  async getAttendanceByDate(date: string, search?: string): Promise<{ attendance: AttendanceRecord[] }> {
    return this.handleRequest(
      this.api.get('/attendance/by-date', { 
        params: { 
          date,
          search: search || undefined
        }
      })
    );
  }

  async enrollFace(faceImage: File, faceDescriptors: number[]): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('faceImage', faceImage);
    formData.append('faceDescriptors', JSON.stringify(faceDescriptors));
    
    return this.handleRequest(
      this.api.post('/auth/enroll-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    );
  }

  async uploadFaceBase64(faceImage: string, faceDescriptors: number[]): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.post('/auth/upload-face-base64', {
        faceImage,
        faceDescriptors
      })
    );
  }

  async testCloudinary(): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.post('/auth/test-cloudinary')
    );
  }

  async registerWithOrganization(userData: {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    department: string;
    designation: string;
    phoneNumber: string;
    password: string;
    role?: string;
    organization: string;
    aadhaarNumber?: string;
  }): Promise<LoginData> {
    return this.handleRequest(
      this.api.post('/auth/register-with-org', userData)
    );
  }

  async getProfile(): Promise<{ user: User }> {
    return this.handleRequest(
      this.api.get('/auth/me')
    );
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    department?: string;
    designation?: string;
  }): Promise<{ user: User }> {
    return this.handleRequest(
      this.api.put('/auth/profile', data)
    );
  }

  async logout(): Promise<void> {
    return this.handleRequest(
      this.api.post('/auth/logout')
    );
  }

  async verifyToken(): Promise<{ user: User }> {
    return this.handleRequest(
      this.api.post('/auth/verify-token')
    );
  }

  // Face Recognition APIs
  async enrollFace(
    faceDescriptor: number[],
    faceImage?: File
  ): Promise<{
    faceEnrolled: boolean;
    descriptorsCount: number;
    attemptsRemaining: number;
  }> {
    const formData = new FormData();
    formData.append('faceDescriptor', JSON.stringify(faceDescriptor));
    if (faceImage) {
      formData.append('faceImage', faceImage);
    }

    return this.handleRequest(
      this.api.post('/auth/face/enroll', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  }

  async resetFaceEnrollment(): Promise<void> {
    return this.handleRequest(
      this.api.delete('/auth/face/reset')
    );
  }

  // Attendance APIs
  async markAttendanceWithFace(
    faceDescriptor: number[],
    type: 'check-in' | 'check-out' | 'break-start' | 'break-end',
    confidence: number,
    faceImage?: File,
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    },
    notes?: string
  ): Promise<{ attendance: AttendanceRecord }> {
    const formData = new FormData();
    formData.append('faceDescriptor', JSON.stringify(faceDescriptor));
    formData.append('type', type);
    formData.append('confidence', confidence.toString());
    
    if (location) {
      formData.append('location', JSON.stringify(location));
    }
    
    if (notes) {
      formData.append('notes', notes);
    }

    if (faceImage) {
      formData.append('faceImage', faceImage);
    }

    return this.handleRequest(
      this.api.post('/attendance/face-recognition', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  }

  async getTodayAttendance(): Promise<{ attendance: AttendanceRecord[] }> {
    return this.handleRequest(
      this.api.get('/attendance/today')
    );
  }

  async getAttendanceHistory(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
  }): Promise<{
    attendance: AttendanceRecord[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  }> {
    return this.handleRequest(
      this.api.get('/attendance/history', { params })
    );
  }

  // Get recent attendance activity for admin dashboard
  async getRecentAttendanceActivity(limit: number = 10): Promise<{
    attendance: Array<{
      _id: string;
      user: {
        firstName: string;
        lastName: string;
        fullName: string;
        employeeId: string;
        department: string;
      };
      type: 'check-in' | 'check-out';
      checkInTime: string;
      checkOutTime?: string;
      isOffline: boolean;
      createdAt: string;
    }>;
  }> {
    return this.handleRequest(
      this.api.get('/attendance/all', { 
        params: { 
          limit, 
          page: 1
        } 
      })
    );
  }

  async getAttendanceSummary(
    startDate?: string,
    endDate?: string
  ): Promise<{
    summary: any[];
    metrics: {
      totalDays: number;
      totalWorkingHours: number;
      totalOvertime: number;
      averageWorkingHours: number;
      formattedTotalHours: string;
    };
  }> {
    return this.handleRequest(
      this.api.get('/attendance/summary', {
        params: { startDate, endDate },
      })
    );
  }

  // Admin APIs
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    department?: string;
    role?: string;
    isApproved?: boolean;
    isActive?: boolean;
    faceEnrolled?: boolean;
    search?: string;
  }): Promise<{
    users: User[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  }> {
    return this.handleRequest(
      this.api.get('/users/all', { params })
    );
  }

  async performAdminAction(
    userId: string,
    action: 'approve' | 'reject' | 'activate' | 'deactivate' | 'reset-face',
    reason?: string
  ): Promise<{ user: User }> {
    return this.handleRequest(
      this.api.post(`/users/${userId}/admin-action`, { action, reason })
    );
  }

  // Organization APIs
  async getOrganizations(params?: {
    page?: number;
    limit?: number;
    type?: string;
    isActive?: boolean;
    plan?: string;
    search?: string;
  }): Promise<{
    organizations: Organization[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  }> {
    return this.handleRequest(
      this.api.get('/organizations', { params })
    );
  }

  async createOrganization(data: {
    name: string;
    type: string;
    description?: string;
    address?: any;
    phone?: string;
    email?: string;
    website?: string;
    settings?: any;
    subscription?: any;
  }): Promise<{ organization: Organization }> {
    return this.handleRequest(
      this.api.post('/organizations', data)
    );
  }

  async registerOrganization(data: {
    organizationData: {
      name: string;
      type: string;
      description?: string;
      address?: any;
      phone?: string;
      email?: string;
      website?: string;
      settings?: any;
      subscription?: any;
    };
    managerData: {
      firstName: string;
      lastName: string;
      email: string;
      employeeId: string;
      phoneNumber: string;
      password: string;
      confirmPassword: string;
    };
  }): Promise<LoginData> {
    return this.handleRequest(
      this.api.post('/auth/register-organization', data)
    );
  }

  async getOrganization(id: string): Promise<{ organization: Organization }> {
    return this.handleRequest(
      this.api.get(`/organizations/${id}`)
    );
  }

  async updateOrganization(id: string, data: any): Promise<{ organization: Organization }> {
    return this.handleRequest(
      this.api.put(`/organizations/${id}`, data)
    );
  }

  async deleteOrganization(id: string): Promise<{ message: string }> {
    return this.handleRequest(
      this.api.delete(`/organizations/${id}`)
    );
  }

  async getOrganizationUsers(orgId: string, params?: {
    page?: number;
    limit?: number;
    department?: string;
    role?: string;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    users: User[];
    organization: Organization;
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  }> {
    return this.handleRequest(
      this.api.get(`/organizations/${orgId}/users`, { params })
    );
  }

  async getOrganizationStats(orgId: string): Promise<{
    organization: { name: string; type: string };
    userStats: { total: number; active: number; approved: number; pending: number };
    todayStats: { checkIns: number; checkOuts: number; present: number; absent: number };
    departmentStats: Array<{ _id: string; count: number; active: number }>;
  }> {
    return this.handleRequest(
      this.api.get(`/organizations/${orgId}/stats`)
    );
  }

  async getGlobalStats(): Promise<{
    totalOrganizations: number;
    organizationsByType: Array<{ _id: string; count: number }>;
    totalUsers: number;
    totalAttendance: number;
    todayAttendance: number;
  }> {
    return this.handleRequest(
      this.api.get('/organizations/global/stats')
    );
  }

  async getOrganizationByInviteCode(inviteCode: string): Promise<{ organization: Organization }> {
    return this.handleRequest(
      this.api.get(`/organizations/by-invite/${inviteCode}`)
    );
  }

  async getUserStats(): Promise<{
    overview: {
      totalUsers: number;
      approvedUsers: number;
      pendingApproval: number;
      activeUsers: number;
      faceEnrolledUsers: number;
      aadhaarVerifiedUsers: number;
    };
    departmentStats: any[];
    todayAttendance: {
      checkedIn: number;
      checkedOut: number;
      onBreak: number;
      resumedWork: number;
    };
  }> {
    return this.handleRequest(
      this.api.get('/users/stats')
    );
  }

  async getPendingApprovalUsers(): Promise<{ users: User[] }> {
    return this.handleRequest(
      this.api.get('/users/pending-approval')
    );
  }

  // Aadhaar APIs
  async sendAadhaarOTP(aadhaarNumber: string): Promise<{
    requestId: string;
    expiresIn: number;
  }> {
    return this.handleRequest(
      this.api.post('/aadhaar/send-otp', { aadhaarNumber })
    );
  }

  async verifyAadhaarOTP(
    aadhaarNumber: string,
    otp: string
  ): Promise<{
    aadhaarVerified: boolean;
    verificationDate: string;
    userInfo: any;
  }> {
    return this.handleRequest(
      this.api.post('/aadhaar/verify-otp', { aadhaarNumber, otp })
    );
  }

  async getAadhaarStatus(): Promise<{
    aadhaarNumber?: string;
    aadhaarVerified: boolean;
    verificationDate?: string;
    hasAadhaar: boolean;
  }> {
    return this.handleRequest(
      this.api.get('/aadhaar/status')
    );
  }

  async validateAadhaar(aadhaarNumber: string): Promise<{
    valid: boolean;
    exists: boolean | null;
    canProceed: boolean;
  }> {
    return this.handleRequest(
      this.api.post('/aadhaar/validate', { aadhaarNumber })
    );
  }

  // Utility methods
  isOnline(): boolean {
    return navigator.onLine;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  // Offline storage methods
  async storeOfflineAttendance(attendanceData: any): Promise<void> {
    try {
      const offlineData = JSON.parse(
        localStorage.getItem('offlineAttendance') || '[]'
      );
      offlineData.push({
        ...attendanceData,
        timestamp: Date.now(),
        synced: false,
      });
      localStorage.setItem('offlineAttendance', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error storing offline attendance:', error);
    }
  }

  async syncOfflineAttendance(): Promise<void> {
    try {
      const offlineData = JSON.parse(
        localStorage.getItem('offlineAttendance') || '[]'
      );
      const unsyncedData = offlineData.filter((item: any) => !item.synced);

      for (const item of unsyncedData) {
        try {
          await this.markAttendanceWithFace(
            item.faceDescriptor,
            item.type,
            item.confidence,
            undefined, // File object can't be stored offline
            item.location,
            item.notes
          );
          
          // Mark as synced
          item.synced = true;
        } catch (error) {
          console.error('Error syncing attendance item:', error);
        }
      }

      // Update localStorage
      localStorage.setItem('offlineAttendance', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error syncing offline attendance:', error);
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export types for use in components
export type {
  User,
  Organization,
  LoginData,
  AttendanceRecord,
  ApiResponse,
}; 