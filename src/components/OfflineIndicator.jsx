import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowOfflineMessage(false);
      }, 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
      showOfflineMessage ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`mx-auto max-w-sm rounded-lg shadow-lg p-4 ${
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        <div className="flex items-center">
          {isOnline ? (
            <Wifi className="h-5 w-5 mr-2" />
          ) : (
            <WifiOff className="h-5 w-5 mr-2" />
          )}
          <span className="text-sm font-medium">
            {isOnline 
              ? 'Koneksi internet tersambung kembali' 
              : 'Anda sedang offline. Beberapa fitur mungkin tidak tersedia.'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
