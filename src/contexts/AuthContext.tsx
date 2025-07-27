import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiService, { User } from '../services/api.ts';
import faceRecognitionService from '../services/faceRecognition.ts';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  phoneNumber: string;
  password: string;
  aadhaarNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state and face recognition service
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize face recognition service
        console.log('Initializing face recognition service...');
        await faceRecognitionService.initialize();
        console.log('Face recognition service initialized successfully');
        
        // Check for existing token and verify it
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const { user: userData } = await apiService.verifyToken();
            setUser(userData);
          } catch (error) {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        console.error('Face recognition service initialization failed:', error);
        // Don't show error toast here as it's not critical for login functionality
        // The face recognition features will handle their own error messages
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const { user: userData, token } = await apiService.login(email, password);
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success(`Welcome back, ${userData.firstName}!`);
    } catch (error: any) {
      const message = error.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      const { user: newUser, token } = await apiService.register(userData);
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Registration successful! Please wait for admin approval.');
    } catch (error: any) {
      const message = error.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  // Update user function (for profile updates)
  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Refresh user data from server
  const refreshUser = async (): Promise<void> => {
    try {
      const { user: userData } = await apiService.getProfile();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Error refreshing user:', error);
      if (error.message.includes('401')) {
        // Token expired, logout
        await logout();
      }
    }
  };

  // Sync offline data when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      if (user && navigator.onLine) {
        try {
          await apiService.syncOfflineAttendance();
          toast.success('Offline data synced successfully');
        } catch (error) {
          console.error('Error syncing offline data:', error);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 