import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt if not already dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed && !standalone) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual install instructions
    if (iOS && !standalone) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowInstallPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isStandalone || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <Smartphone className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Install PulihHati</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Install aplikasi PulihHati untuk akses yang lebih cepat dan pengalaman yang lebih baik.
        </p>

        {isIOS ? (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Untuk menginstall di iOS:
            </p>
            <ol className="text-xs text-gray-600 space-y-1 ml-4">
              <li>1. Tap tombol Share di Safari</li>
              <li>2. Pilih "Add to Home Screen"</li>
              <li>3. Tap "Add" untuk menginstall</li>
            </ol>
            <button
              onClick={handleDismiss}
              className="w-full mt-3 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Mengerti
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Nanti
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
