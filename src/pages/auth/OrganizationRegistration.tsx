import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.tsx';
import apiService from '../../services/api.ts';

const OrganizationRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Organization Info, 2: Manager Info, 3: Confirmation
  
  const [organizationData, setOrganizationData] = useState({
    name: '',
    type: 'office',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    phone: '',
    email: '',
    website: ''
  });

  const [managerData, setManagerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const organizationTypes = [
    { value: 'office', label: 'Office/Corporate', icon: '🏢' },
    { value: 'school', label: 'School/Educational', icon: '🏫' },
    { value: 'hotel', label: 'Hotel/Hospitality', icon: '🏨' },
    { value: 'hospital', label: 'Hospital/Healthcare', icon: '🏥' },
    { value: 'factory', label: 'Factory/Manufacturing', icon: '🏭' },
    { value: 'retail', label: 'Retail/Store', icon: '🏪' },
    { value: 'other', label: 'Other', icon: '🏛️' }
  ];

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setOrganizationData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setOrganizationData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManagerData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!organizationData.name || !organizationData.type) {
      toast.error('Please fill in organization name and type');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { firstName, lastName, email, employeeId, phoneNumber, password, confirmPassword } = managerData;
    
    if (!firstName || !lastName || !email || !employeeId || !phoneNumber || !password || !confirmPassword) {
      toast.error('Please fill in all manager details');
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate passwords match
      if (managerData.password !== managerData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (managerData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      // Register organization and manager in one call
      const response = await apiService.registerOrganization({
        organizationData,
        managerData
      });

      toast.success('Organization created successfully! Check your email for the invite code.');
      
      // Auto-login the manager
      localStorage.setItem('token', response.token);
      
      navigate('/dashboard');

    } catch (error: any) {
      toast.error(error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="white" />
          <p className="text-white mt-4 text-lg">Creating your organization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 via-purple-500/10 to-slate-500/10"></div>
        
        {/* Corporate floating elements */}
        <div className="absolute inset-0">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full opacity-30 ${
                i % 4 === 0 ? 'w-1 h-1 bg-slate-400' : 
                i % 4 === 1 ? 'w-0.5 h-0.5 bg-purple-400' : 
                i % 4 === 2 ? 'w-1.5 h-1.5 bg-indigo-400' :
                'w-0.5 h-0.5 bg-slate-300'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `corporate-float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Network connection lines */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`network-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-slate-400/20 to-transparent opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${30 + Math.random() * 40}%`,
                animation: `data-flow ${4 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 90}deg)`
              }}
            />
          ))}
        </div>

        {/* Corporate building silhouettes */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg className="absolute bottom-0 left-0 w-full h-64" viewBox="0 0 1200 200" fill="none">
            <rect x="50" y="60" width="80" height="140" fill="currentColor" className="text-slate-400" />
            <rect x="150" y="40" width="60" height="160" fill="currentColor" className="text-purple-400" />
            <rect x="230" y="80" width="90" height="120" fill="currentColor" className="text-slate-400" />
            <rect x="340" y="20" width="70" height="180" fill="currentColor" className="text-indigo-400" />
            <rect x="430" y="100" width="50" height="100" fill="currentColor" className="text-slate-400" />
            <rect x="500" y="30" width="100" height="170" fill="currentColor" className="text-purple-400" />
            <rect x="620" y="70" width="80" height="130" fill="currentColor" className="text-slate-400" />
            <rect x="720" y="50" width="60" height="150" fill="currentColor" className="text-indigo-400" />
            <rect x="800" y="90" width="70" height="110" fill="currentColor" className="text-slate-400" />
            <rect x="890" y="10" width="80" height="190" fill="currentColor" className="text-purple-400" />
            <rect x="990" y="60" width="90" height="140" fill="currentColor" className="text-slate-400" />
            <rect x="1100" y="40" width="60" height="160" fill="currentColor" className="text-indigo-400" />
          </svg>
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-slate-400/20 rounded-lg rotate-12 animate-corporate-spin"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 border border-purple-400/20 rounded-full animate-pulse-corporate"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-indigo-400/20 rounded-lg rotate-45 animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border border-slate-400/20 rounded-full animate-corporate-orbit"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-purple-400/15 rounded-lg animate-corporate-spin-slow"></div>
        <div className="absolute top-10 right-1/4 w-12 h-12 border border-indigo-400/25 rounded-full animate-pulse-slow"></div>
        
        {/* Floating corporate icons */}
        <div className="absolute top-1/4 left-1/3 w-8 h-8 border border-slate-400/30 rounded-lg rotate-12 animate-float-corporate"></div>
        <div className="absolute bottom-1/4 right-1/4 w-6 h-6 border border-purple-400/30 rounded-full animate-pulse-corporate"></div>
        <div className="absolute top-3/4 left-1/6 w-10 h-10 border border-indigo-400/25 rounded-lg rotate-45 animate-float-corporate"></div>
        <div className="absolute top-1/6 right-1/6 w-14 h-14 border border-slate-400/20 rounded-full animate-corporate-spin-reverse"></div>
        <div className="absolute bottom-1/6 left-2/3 w-12 h-12 border border-purple-400/25 rotate-45 animate-pulse-fast"></div>
        
        {/* Data streaming effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent animate-data-stream"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-data-stream-reverse"></div>
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent animate-data-stream-vertical"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-400/30 to-transparent animate-data-stream-vertical-reverse"></div>
        </div>

        {/* Corporate grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/6 left-0 w-full h-px bg-slate-400/30 animate-grid-pulse"></div>
          <div className="absolute top-2/6 left-0 w-full h-px bg-purple-400/30 animate-grid-pulse"></div>
          <div className="absolute top-3/6 left-0 w-full h-px bg-indigo-400/30 animate-grid-pulse"></div>
          <div className="absolute top-4/6 left-0 w-full h-px bg-slate-400/30 animate-grid-pulse"></div>
          <div className="absolute top-5/6 left-0 w-full h-px bg-purple-400/30 animate-grid-pulse"></div>
          
          <div className="absolute top-0 left-1/6 w-px h-full bg-slate-400/30 animate-grid-pulse"></div>
          <div className="absolute top-0 left-2/6 w-px h-full bg-purple-400/30 animate-grid-pulse"></div>
          <div className="absolute top-0 left-3/6 w-px h-full bg-indigo-400/30 animate-grid-pulse"></div>
          <div className="absolute top-0 left-4/6 w-px h-full bg-slate-400/30 animate-grid-pulse"></div>
          <div className="absolute top-0 left-5/6 w-px h-full bg-purple-400/30 animate-grid-pulse"></div>
        </div>

        {/* Orbiting corporate elements */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-slate-400/60 rounded-full animate-corporate-orbit"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-corporate-orbit-reverse"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-indigo-400/60 rounded-full animate-corporate-orbit-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-600 to-purple-600 rounded-3xl shadow-2xl mb-6 animate-header-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
              </svg>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up">
              Create Your Organization
            </h2>
            <p className="text-xl text-slate-300 animate-fade-in-up-delay">
              Set up your organization and start managing your team
            </p>
          </div>

          {/* Enhanced Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center relative">
              {/* Progress Line Background */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-80 h-1 bg-slate-700 rounded-full"></div>
              <div 
                className="absolute top-4 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-in-out"
                style={{ width: `${((step - 1) / 2) * 320}px` }}
              ></div>
              
              <div className="flex items-center justify-center space-x-20 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center group">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 transform ${
                    step >= 1 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-400 text-white scale-110 shadow-lg' 
                      : 'bg-slate-800 border-slate-600 text-slate-400 group-hover:scale-105'
                  }`}>
                    {step > 1 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
                      </svg>
                    )}
                  </div>
                  <span className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                    step >= 1 ? 'text-white' : 'text-slate-400'
                  }`}>
                    Organization
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center group">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 transform ${
                    step >= 2 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-400 text-white scale-110 shadow-lg' 
                      : 'bg-slate-800 border-slate-600 text-slate-400 group-hover:scale-105'
                  }`}>
                    {step > 2 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <span className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                    step >= 2 ? 'text-white' : 'text-slate-400'
                  }`}>
                    Manager
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center group">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 transform ${
                    step >= 3 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-400 text-white scale-110 shadow-lg' 
                      : 'bg-slate-800 border-slate-600 text-slate-400 group-hover:scale-105'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                    step >= 3 ? 'text-white' : 'text-slate-400'
                  }`}>
                    Confirm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container with Glass Effect */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12 transition-all duration-700 hover:bg-white/15">
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Organization Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Organization Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={organizationData.name}
                      onChange={handleOrganizationChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                      placeholder="e.g., ABC Company Ltd"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Organization Type *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-lg">
                        {organizationTypes.find(t => t.value === organizationData.type)?.icon}
                      </span>
                    </div>
                    <select
                      name="type"
                      value={organizationData.type}
                      onChange={handleOrganizationChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                    >
                      {organizationTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={organizationData.description}
                    onChange={handleOrganizationChange}
                    className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white resize-none"
                    placeholder="Brief description of your organization"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
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
                        value={organizationData.email}
                        onChange={handleOrganizationChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={organizationData.phone}
                        onChange={handleOrganizationChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-slate-300 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address (Optional)
                  </h4>
                  <div className="group">
                    <input
                      type="text"
                      name="address.street"
                      value={organizationData.address.street}
                      onChange={handleOrganizationChange}
                      placeholder="Street Address"
                      className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="group">
                      <input
                        type="text"
                        name="address.city"
                        value={organizationData.address.city}
                        onChange={handleOrganizationChange}
                        placeholder="City"
                        className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                      />
                    </div>
                    <div className="group">
                      <input
                        type="text"
                        name="address.state"
                        value={organizationData.address.state}
                        onChange={handleOrganizationChange}
                        placeholder="State"
                        className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                      />
                    </div>
                    <div className="group">
                      <input
                        type="text"
                        name="address.country"
                        value={organizationData.address.country}
                        onChange={handleOrganizationChange}
                        placeholder="Country"
                        className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                      />
                    </div>
                    <div className="group">
                      <input
                        type="text"
                        name="address.zipCode"
                        value={organizationData.address.zipCode}
                        onChange={handleOrganizationChange}
                        placeholder="ZIP Code"
                        className="w-full px-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Already have an account? Login
                </Link>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center group"
                >
                  <span>Next: Manager Info</span>
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-in">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Manager Account Information</h3>
              </div>
              
              <div className="space-y-6">
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
                        value={managerData.firstName}
                        onChange={handleManagerChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="Enter first name"
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
                        value={managerData.lastName}
                        onChange={handleManagerChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="Enter last name"
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
                      value={managerData.email}
                      onChange={handleManagerChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                      placeholder="manager@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Manager ID/Employee ID *
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
                        value={managerData.employeeId}
                        onChange={handleManagerChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="e.g., MGR001"
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
                        value={managerData.phoneNumber}
                        onChange={handleManagerChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
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
                        value={managerData.password}
                        onChange={handleManagerChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="Minimum 6 characters"
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
                        value={managerData.confirmPassword}
                        onChange={handleManagerChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-300/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white transition-all duration-300 group-hover:bg-white"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Organization
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center group"
                >
                  <span>Next: Review</span>
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-in">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Review & Confirm</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <h4 className="font-bold text-white mb-4 flex items-center text-lg">
                    <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
                    </svg>
                    Organization Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-300 min-w-16 text-sm font-medium">Name:</span>
                      <span className="text-white font-medium text-sm flex-1">{organizationData.name}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-300 min-w-16 text-sm font-medium">Type:</span>
                      <span className="text-white font-medium text-sm flex-1">
                        {organizationTypes.find(t => t.value === organizationData.type)?.label}
                      </span>
                    </div>
                    {organizationData.email && (
                      <div className="flex items-start gap-3">
                        <span className="text-slate-300 min-w-16 text-sm font-medium">Email:</span>
                        <span className="text-white font-medium text-sm flex-1">{organizationData.email}</span>
                      </div>
                    )}
                    {organizationData.phone && (
                      <div className="flex items-start gap-3">
                        <span className="text-slate-300 min-w-16 text-sm font-medium">Phone:</span>
                        <span className="text-white font-medium text-sm flex-1">{organizationData.phone}</span>
                      </div>
                    )}
                    {organizationData.description && (
                      <div className="flex items-start gap-3">
                        <span className="text-slate-300 min-w-16 text-sm font-medium">Description:</span>
                        <span className="text-white font-medium text-sm flex-1">{organizationData.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <h4 className="font-bold text-white mb-4 flex items-center text-lg">
                    <svg className="w-6 h-6 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Manager Account
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-300 min-w-20 text-sm font-medium">Name:</span>
                      <span className="text-white font-medium text-sm flex-1">{managerData.firstName} {managerData.lastName}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-300 min-w-20 text-sm font-medium">Email:</span>
                      <span className="text-white font-medium text-sm flex-1">{managerData.email}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-300 min-w-20 text-sm font-medium">Manager ID:</span>
                      <span className="text-white font-medium text-sm flex-1">{managerData.employeeId}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-300 min-w-20 text-sm font-medium">Phone:</span>
                      <span className="text-white font-medium text-sm flex-1">{managerData.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-6">
                  <h4 className="font-bold text-emerald-300 mb-3 flex items-center text-lg">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    What happens next?
                  </h4>
                  <ul className="text-sm text-emerald-200 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Your organization will be created
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      You'll get admin access to manage employees
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Employees can join using your organization invite code
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      You can approve employee registrations
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Manager Info
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center group"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Creating Organization...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Create Organization</span>
                      <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
                      )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Enterprise Grade Security
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Lightning Fast Setup
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by 1000+ Organizations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>
        {`
          @keyframes corporate-float {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            33% { transform: translateY(-8px) rotate(1deg) scale(1.05); }
            66% { transform: translateY(4px) rotate(-1deg) scale(0.95); }
          }
          
          @keyframes float-corporate {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.3; }
            50% { transform: translateY(-12px) rotate(2deg) scale(1.1); opacity: 0.6; }
          }
          
          @keyframes corporate-spin {
            from { transform: rotate(0deg) scale(1); }
            to { transform: rotate(360deg) scale(1.05); }
          }
          
          @keyframes corporate-spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes corporate-spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          
          @keyframes pulse-corporate {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.08); }
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes corporate-orbit {
            0% { transform: rotate(0deg) translateX(25px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(25px) rotate(-360deg); }
          }
          
          @keyframes corporate-orbit-reverse {
            0% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
            100% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          }
          
          @keyframes corporate-orbit-slow {
            0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
          }
          
          @keyframes data-flow {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(100vh); opacity: 0; }
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
            50% { transform: scale(1.05); box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 25px 50px -12px rgba(99, 102, 241, 0.25); }
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
          
          .animate-corporate-spin {
            animation: corporate-spin 25s linear infinite;
          }
          
          .animate-corporate-spin-slow {
            animation: corporate-spin-slow 30s linear infinite;
          }
          
          .animate-corporate-spin-reverse {
            animation: corporate-spin-reverse 20s linear infinite;
          }
          
          .animate-pulse-corporate {
            animation: pulse-corporate 3s ease-in-out infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
          
          .animate-corporate-orbit {
            animation: corporate-orbit 10s linear infinite;
          }
          
          .animate-corporate-orbit-reverse {
            animation: corporate-orbit-reverse 8s linear infinite;
          }
          
          .animate-corporate-orbit-slow {
            animation: corporate-orbit-slow 15s linear infinite;
          }
          
          .animate-float-corporate {
            animation: float-corporate 5s ease-in-out infinite;
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
            animation: slide-in 0.5s ease-out;
          }
          
          .animate-pulse-slow {
            animation: pulse-corporate 6s ease-in-out infinite;
          }
          
          .animate-pulse-fast {
            animation: pulse-corporate 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default OrganizationRegistration; 