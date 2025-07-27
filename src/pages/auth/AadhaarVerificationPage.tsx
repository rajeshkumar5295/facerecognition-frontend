import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner.tsx';

interface LocationState {
  aadhaarNumber?: string;
  returnTo?: string;
}

const AadhaarVerificationPage: React.FC = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  React.useEffect(() => {
    if (state?.aadhaarNumber) {
      setAadhaarNumber(state.aadhaarNumber);
    }
  }, [state]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const validateAadhaarNumber = (number: string): boolean => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(number.replace(/\s/g, ''));
  };

  const formatAadhaarNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 12) {
      setAadhaarNumber(formatted);
    }
  };

  const sendOtp = async () => {
    if (!validateAadhaarNumber(aadhaarNumber)) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsOtpSent(true);
      setResendCooldown(30);
      alert('OTP sent to your registered mobile number');
    } catch (error: any) {
      alert(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification  
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otp === '123456') {
        setIsVerified(true);
        alert('Aadhaar verification successful!');
        
        setTimeout(() => {
          const returnTo = state?.returnTo || '/dashboard';
          navigate(returnTo, { 
            state: { 
              aadhaarVerified: true,
              aadhaarData: {
                name: 'John Doe',
                dateOfBirth: '01/01/1990',
                gender: 'M',
                address: 'Mock Address, City, State - 123456'
              }
            }
          });
        }, 2000);
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      alert(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    await sendOtp();
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your Aadhaar has been verified successfully. Redirecting you now...
          </p>
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Aadhaar Verification
            </h1>
          </div>
        </div>

        {!isOtpSent ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={handleAadhaarChange}
                placeholder="1234 5678 9012"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-wider"
                maxLength={14}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your 12-digit Aadhaar number
              </p>
            </div>

            <button
              onClick={sendOtp}
              disabled={isLoading || !validateAadhaarNumber(aadhaarNumber)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Sending OTP...</span>
                </div>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                OTP sent to your registered mobile number ending with{' '}
                <span className="font-medium">****{aadhaarNumber.slice(-4)}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    setOtp(value);
                  }
                }}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-wider text-center"
                maxLength={6}
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Verifying...</span>
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive OTP?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp('');
                }}
                className="text-gray-600 hover:text-gray-700 text-sm"
              >
                Change Aadhaar Number
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            Your Aadhaar information is encrypted and securely processed in compliance with UIDAI guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerificationPage; 