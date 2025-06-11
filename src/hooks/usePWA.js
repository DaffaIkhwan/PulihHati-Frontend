import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if app is installed (standalone mode)
    const checkInstalled = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
      setIsInstalled(standalone);
    };

    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
      return outcome === 'accepted';
    }
    return false;
  };

  const shareApp = async (data = {}) => {
    const shareData = {
      title: 'PulihHati - Aplikasi Kesehatan Mental',
      text: 'Aplikasi kesehatan mental untuk membantu Anda pulih dan berkembang',
      url: window.location.origin,
      ...data
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.log('Error sharing:', error);
        return false;
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        return true;
      } catch (error) {
        console.log('Error copying to clipboard:', error);
        return false;
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/logo2-192x192.png',
        badge: '/logo2-192x192.png',
        ...options
      });
      
      return notification;
    }
    return null;
  };

  const checkForUpdates = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
        }
      });
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    shareApp,
    requestNotificationPermission,
    showNotification,
    checkForUpdates
  };
};

export default usePWA;
