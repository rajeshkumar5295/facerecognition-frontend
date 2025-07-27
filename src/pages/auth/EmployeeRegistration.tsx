import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.tsx';
import apiService, { Organization } from '../../services/api.ts';

const EmployeeRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  
  const [formData, setFormData] = useState({
    inviteCode: searchParams.get('code') || '',
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    department: '',
    designation: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    aadhaarNumber: ''
  });

  useEffect(() => {
    if (formData.inviteCode) {
      verifyInviteCode(formData.inviteCode);
    }
  }, []);

  const verifyInviteCode = async (code: string) => {
    if (!code || code.length < 8) return;
    
    try {
      setVerifyingCode(true);
      const response = await apiService.getOrganizationByInviteCode(code);
      setOrganization(response.organization);
      toast.success(`Found organization: ${response.organization.name}`);
    } catch (error: any) {
      toast.error(error.message || 'Invalid invite code');
      setOrganization(null);
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-verify invite code when user types
    if (name === 'inviteCode' && value.length === 8) {
      verifyInviteCode(value);
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

  const getDepartmentSuggestions = (orgType: string) => {
    const suggestions: { [key: string]: string[] } = {
      school: ['Teaching', 'Administration', 'Maintenance', 'Security', 'Library', 'Sports'],
      office: ['HR', 'IT', 'Finance', 'Marketing', 'Sales', 'Operations', 'Admin'],
      hotel: ['Front Desk', 'Housekeeping', 'Food & Beverage', 'Maintenance', 'Security', 'Management'],
      hospital: ['Nursing', 'Doctors', 'Administration', 'Pharmacy', 'Laboratory', 'Security', 'Maintenance'],
      factory: ['Production', 'Quality Control', 'Maintenance', 'Safety', 'Administration', 'Logistics'],
      retail: ['Sales', 'Customer Service', 'Inventory', 'Cashier', 'Security', 'Management'],
      other: ['Operations', 'Administration', 'Support', 'Management']
    };
    return suggestions[orgType] || suggestions.other;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization) {
      toast.error('Please enter a valid invite code');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeId || 
        !formData.department || !formData.designation || !formData.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        employeeId: formData.employeeId,
        department: formData.department,
        designation: formData.designation,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: 'employee',
        organization: organization._id,
        aadhaarNumber: formData.aadhaarNumber || undefined
      };

      await apiService.registerWithOrganization(userData);

      toast.success('Registration successful! Awaiting manager approval.');
      navigate('/login');

    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="white" />
          <p className="text-white mt-4 text-lg">Registering your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-indigo-500/10"></div>
        
        {/* Workplace floating elements */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full opacity-30 ${
                i % 4 === 0 ? 'w-1 h-1 bg-indigo-400' : 
                i % 4 === 1 ? 'w-0.5 h-0.5 bg-blue-400' : 
                i % 4 === 2 ? 'w-1.5 h-1.5 bg-cyan-400' :
                'w-0.5 h-0.5 bg-indigo-300'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `workplace-float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Professional connection lines */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`network-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-indigo-400/25 to-transparent opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${25 + Math.random() * 35}%`,
                animation: `data-stream ${4 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 45}deg)`
              }}
            />
          ))}
        </div>

        {/* Workplace icon shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-8">
          <svg className="absolute top-20 left-10 w-16 h-16 text-indigo-400/20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
          </svg>
          <svg className="absolute top-1/3 right-16 w-12 h-12 text-blue-400/20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <svg className="absolute bottom-32 left-1/4 w-14 h-14 text-cyan-400/20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <svg className="absolute top-1/2 right-1/4 w-10 h-10 text-indigo-400/20" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute top-24 right-24 w-28 h-28 border border-indigo-400/20 rounded-2xl rotate-12 animate-workplace-spin"></div>
        <div className="absolute top-1/4 left-16 w-20 h-20 border border-blue-400/20 rounded-full animate-pulse-workplace"></div>
        <div className="absolute bottom-40 right-1/3 w-14 h-14 border border-cyan-400/20 rounded-lg rotate-45 animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-18 h-18 border border-indigo-400/20 rounded-full animate-workplace-orbit"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 border border-blue-400/15 rounded-2xl animate-workplace-spin-slow"></div>
        <div className="absolute top-16 left-1/3 w-10 h-10 border border-cyan-400/25 rounded-full animate-pulse-slow"></div>
        
        {/* Floating workplace elements */}
        <div className="absolute top-1/3 right-1/4 w-6 h-6 border border-indigo-400/30 rounded-lg rotate-12 animate-float-workplace"></div>
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 border border-blue-400/30 rounded-full animate-pulse-workplace"></div>
        <div className="absolute top-2/3 right-1/6 w-8 h-8 border border-cyan-400/25 rounded-lg rotate-45 animate-float-workplace"></div>
        <div className="absolute top-1/6 left-2/3 w-12 h-12 border border-indigo-400/20 rounded-full animate-workplace-spin-reverse"></div>
        <div className="absolute bottom-1/6 right-2/3 w-10 h-10 border border-blue-400/25 rotate-45 animate-pulse-fast"></div>
        
        {/* Professional data streaming effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-data-stream"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-data-stream-reverse"></div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-data-stream-vertical"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent animate-data-stream-vertical-reverse"></div>
        </div>

        {/* Professional grid overlay */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-1/6 left-0 w-full h-px bg-indigo-400/20 animate-grid-pulse"></div>
          <div className="absolute top-2/6 left-0 w-full h-px bg-blue-400/20 animate-grid-pulse"></div>
          <div className="absolute top-3/6 left-0 w-full h-px bg-cyan-400/20 animate-grid-pulse"></div>
          <div className="absolute top-4/6 left-0 w-full h-px bg-indigo-400/20 animate-grid-pulse"></div>
          <div className="absolute top-5/6 left-0 w-full h-px bg-blue-400/20 animate-grid-pulse"></div>
          
          <div className="absolute top-0 left-1/6 w-px h-full bg-indigo-400/20 animate-grid-pulse"></div>
          <div className="absolute top-0 left-2/6 w-px h-full bg-blue-400/20 animate-grid-pulse"></div>
          <div className="absolute top-0 left-3/6 w-px h-full bg-cyan-400/20 animate-grid-pulse"></div>
          <div className="absolute top-0 left-4/6 w-px h-full bg-indigo-400/20 animate-grid-pulse"></div>
          <div className="absolute top-0 left-5/6 w-px h-full bg-blue-400/20 animate-grid-pulse"></div>
        </div>

        {/* Orbiting workplace elements */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-indigo-400/60 rounded-full animate-workplace-orbit"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-workplace-orbit-reverse"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-cyan-400/60 rounded-full animate-workplace-orbit-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl shadow-2xl mb-6 animate-header-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up">
              Join Your Organization
            </h2>
            <p className="text-xl text-slate-300 animate-fade-in-up-delay">
              Register as an employee using your organization's invite code
            </p>
          </div>

          {/* Form Container with Glass Effect */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12 transition-all duration-700 hover:bg-white/15 animate-slide-in">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Invite Code Section */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Organization Invite Code *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m6 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v0a2 2 0 002 2h6z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="inviteCode"
                    value={formData.inviteCode}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                    placeholder="Enter 8-character code"
                    maxLength={8}
                    required
                  />
                  {verifyingCode && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Get this code from your manager or HR department
                </p>
              </div>

              {/* Organization Info */}
              {organization && (
                <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-6 animate-fade-in">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4 p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      {getOrganizationTypeIcon(organization.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-emerald-100 mb-1">
                        {organization.name}
                      </h3>
                      <p className="text-sm text-emerald-200">
                        {organization.type.charAt(0).toUpperCase() + organization.type.slice(1)} Organization
                      </p>
                    </div>
                    <div className="text-emerald-300">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {organization.description && (
                    <p className="mt-4 text-sm text-emerald-200 bg-white/10 rounded-xl p-3">
                      {organization.description}
                    </p>
                  )}
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                      placeholder="your.email@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Employee ID *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="e.g., EMP001"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="+1 234 567 8900"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className="space-y-6 pt-6 border-t border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Work Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Department *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
                          </svg>
                        </div>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                          required
                        >
                          <option value="">Select Department</option>
                          {organization && getDepartmentSuggestions(organization.type).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Designation *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                          placeholder="e.g., Software Developer"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Aadhaar Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                      placeholder="12-digit Aadhaar number"
                      maxLength={12}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="Minimum 6 characters"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Note */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6">
                <h4 className="font-bold text-blue-300 mb-3 flex items-center text-lg">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  What happens next?
                </h4>
                <ul className="text-sm text-blue-200 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Your registration will be sent to your manager for approval
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    You'll be able to login once approved
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    After login, you'll need to enroll your face for attendance
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    You can then mark attendance using face recognition
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !organization}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Registering...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0" />
                      </svg>
                      <span>Register as Employee</span>
                      <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              <div className="space-y-4 text-center">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center justify-center group"
                >
                  <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Already have an account? Login
                </Link>

                <Link
                  to="/organization-register"
                  className="text-emerald-300 hover:text-emerald-200 transition-colors duration-300 flex items-center justify-center group"
                >
                  <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
                  </svg>
                  Want to create an organization? Register as Manager
                </Link>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Registration
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Quick Approval
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted Platform
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>
        {`
          @keyframes workplace-float {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            33% { transform: translateY(-6px) rotate(1deg) scale(1.05); }
            66% { transform: translateY(3px) rotate(-1deg) scale(0.95); }
          }
          
          @keyframes float-workplace {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.3; }
            50% { transform: translateY(-10px) rotate(2deg) scale(1.1); opacity: 0.6; }
          }
          
          @keyframes workplace-spin {
            from { transform: rotate(0deg) scale(1); }
            to { transform: rotate(360deg) scale(1.05); }
          }
          
          @keyframes workplace-spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes workplace-spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          
          @keyframes pulse-workplace {
            0%, 100% { opacity: 0.25; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.08); }
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          
          @keyframes workplace-orbit {
            0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
          }
          
          @keyframes workplace-orbit-reverse {
            0% { transform: rotate(360deg) translateX(15px) rotate(-360deg); }
            100% { transform: rotate(0deg) translateX(15px) rotate(0deg); }
          }
          
          @keyframes workplace-orbit-slow {
            0% { transform: rotate(0deg) translateX(25px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(25px) rotate(-360deg); }
          }
          
          @keyframes data-stream {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          
          @keyframes data-stream-reverse {
            0% { transform: translateX(100%); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateX(-100%); opacity: 0; }
          }
          
          @keyframes data-stream-vertical {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(100%); opacity: 0; }
          }
          
          @keyframes data-stream-vertical-reverse {
            0% { transform: translateY(100%); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-100%); opacity: 0; }
          }
          
          @keyframes grid-pulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
          }
          
          @keyframes header-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            50% { transform: scale(1.05); box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 25px 50px -12px rgba(99, 102, 241, 0.25); }
          }
          
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-up-delay {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-in {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-workplace-spin {
            animation: workplace-spin 20s linear infinite;
          }
          
          .animate-workplace-spin-slow {
            animation: workplace-spin-slow 25s linear infinite;
          }
          
          .animate-workplace-spin-reverse {
            animation: workplace-spin-reverse 18s linear infinite;
          }
          
          .animate-pulse-workplace {
            animation: pulse-workplace 4s ease-in-out infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
          
          .animate-workplace-orbit {
            animation: workplace-orbit 8s linear infinite;
          }
          
          .animate-workplace-orbit-reverse {
            animation: workplace-orbit-reverse 6s linear infinite;
          }
          
          .animate-workplace-orbit-slow {
            animation: workplace-orbit-slow 12s linear infinite;
          }
          
          .animate-float-workplace {
            animation: float-workplace 4s ease-in-out infinite;
          }
          
          .animate-data-stream {
            animation: data-stream 3s ease-in-out infinite;
          }
          
          .animate-data-stream-reverse {
            animation: data-stream-reverse 4s ease-in-out infinite;
            animation-delay: 1s;
          }
          
          .animate-data-stream-vertical {
            animation: data-stream-vertical 5s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          
          .animate-data-stream-vertical-reverse {
            animation: data-stream-vertical-reverse 4s ease-in-out infinite;
            animation-delay: 2s;
          }
          
          .animate-grid-pulse {
            animation: grid-pulse 4s ease-in-out infinite;
          }
          
          .animate-header-pulse {
            animation: header-pulse 4s ease-in-out infinite;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }
          
          .animate-fade-in-up-delay {
            animation: fade-in-up-delay 0.8s ease-out 0.2s both;
          }
          
          .animate-slide-in {
            animation: slide-in 0.6s ease-out;
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          .animate-pulse-slow {
            animation: pulse-workplace 6s ease-in-out infinite;
          }
          
          .animate-pulse-fast {
            animation: pulse-workplace 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default EmployeeRegistration; 