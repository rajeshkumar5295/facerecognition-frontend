import React from 'react';
import { useOffline } from '../../contexts/OfflineContext.tsx';

const OfflineIndicator: React.FC = () => {
  const { isOnline, hasOfflineData } = useOffline();

  if (isOnline && !hasOfflineData) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 mb-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L5.636 18.364m0-12.728L18.364 18.364" />
          </svg>
          <span className="text-sm font-medium">You're offline</span>
        </div>
      )}
      
      {hasOfflineData && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-sm font-medium">Unsynced data</span>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator; 