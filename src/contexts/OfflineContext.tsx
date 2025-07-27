import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import localforage from 'localforage';

interface OfflineContextType {
  isOnline: boolean;
  hasOfflineData: boolean;
  syncOfflineData: () => Promise<void>;
  storeOfflineData: (key: string, data: any) => Promise<void>;
  getOfflineData: (key: string) => Promise<any>;
  clearOfflineData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);

  // Initialize offline storage
  useEffect(() => {
    // Configure localforage
    localforage.config({
      name: 'AttendanceApp',
      storeName: 'attendanceData',
      version: 1.0,
      description: 'Offline storage for attendance data'
    });

    // Check for existing offline data
    checkOfflineData();
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if there's offline data
  const checkOfflineData = async (): Promise<void> => {
    try {
      const keys = await localforage.keys();
      setHasOfflineData(keys.length > 0);
    } catch (error) {
      console.error('Error checking offline data:', error);
    }
  };

  // Store data offline
  const storeOfflineData = async (key: string, data: any): Promise<void> => {
    try {
      await localforage.setItem(key, {
        ...data,
        timestamp: Date.now(),
        synced: false
      });
      setHasOfflineData(true);
    } catch (error) {
      console.error('Error storing offline data:', error);
      throw error;
    }
  };

  // Get offline data
  const getOfflineData = async (key: string): Promise<any> => {
    try {
      return await localforage.getItem(key);
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  };

  // Sync offline data when online
  const syncOfflineData = async (): Promise<void> => {
    if (!isOnline) return;

    try {
      const keys = await localforage.keys();
      const attendanceKeys = keys.filter(key => key.startsWith('attendance_'));
      
      // Here you would typically send the data to your API
      // For now, we'll just mark it as synced
      for (const key of attendanceKeys) {
        const data = await localforage.getItem(key);
        if (data && typeof data === 'object' && 'synced' in data && !data.synced) {
          // Mark as synced (in real implementation, send to API first)
          await localforage.setItem(key, { ...data, synced: true });
        }
      }

      await checkOfflineData();
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  };

  // Clear all offline data
  const clearOfflineData = async (): Promise<void> => {
    try {
      await localforage.clear();
      setHasOfflineData(false);
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  };

  const value: OfflineContextType = {
    isOnline,
    hasOfflineData,
    syncOfflineData,
    storeOfflineData,
    getOfflineData,
    clearOfflineData,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

// Custom hook to use offline context
export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export default OfflineContext; 