// API Configuration
// This file centralizes all API-related configuration

// Get API base URL from environment variables
// Fallback to Railway production if not set (for deployment)
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: import.meta.env.VITE_API_BASE_URL ||
           (import.meta.env.PROD ? 'https://pulih-hati-backend-production.up.railway.app/api' : 'http://localhost:5000/api'),

  // Request timeout in milliseconds
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) ||
          (import.meta.env.PROD ? 30000 : 15000), // Longer timeout for production

  // App environment
  APP_ENV: import.meta.env.VITE_APP_ENV || (import.meta.env.PROD ? 'production' : 'development'),

  // Debug mode
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || (!import.meta.env.PROD && import.meta.env.DEV),
};

// Available backend options for easy switching
export const BACKEND_OPTIONS = {
  LOCAL: 'http://localhost:5000/api',
  RAILWAY: 'https://pulih-hati-backend-production.up.railway.app/api', // Railway deployment (Primary)
  VERCEL: 'https://pulih-hati-backend-obpvpxn7l-daffaikhwans-projects.vercel.app/api' // Vercel deployment (Alternative)
};

// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection to:', API_CONFIG.BASE_URL);

    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout for health check
    });

    if (response.ok) {
      console.log('✅ Backend connection successful');
      return true;
    } else {
      console.warn('⚠️ Backend responded with status:', response.status);
      if (response.status === 404) {
        console.error('🔍 404 Error: Backend endpoint not found. Check if Railway backend is deployed correctly.');
      }
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    if (error.name === 'AbortError') {
      console.error('⏱️ Connection timeout: Backend took too long to respond');
    }
    return false;
  }
};

// Test static assets
export const testStaticAssets = () => {
  const assets = [
    '/favicon.ico',
    '/manifest.webmanifest',
    '/logo2.png',
    '/offline.html'
  ];

  assets.forEach(asset => {
    fetch(asset)
      .then(response => {
        if (response.ok) {
          console.log(`✅ Asset found: ${asset}`);
        } else {
          console.warn(`⚠️ Asset missing (${response.status}): ${asset}`);
        }
      })
      .catch(error => {
        console.error(`❌ Asset error: ${asset}`, error.message);
      });
  });
};

// Log current configuration for debugging
console.log('🔧 API Configuration:', {
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  environment: API_CONFIG.APP_ENV,
  debug: API_CONFIG.DEBUG,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  envVars: {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    VITE_DEBUG: import.meta.env.VITE_DEBUG
  }
});

// Test connection in debug mode or production for troubleshooting
if (API_CONFIG.DEBUG || import.meta.env.PROD) {
  testBackendConnection();
  testStaticAssets();
}

export default API_CONFIG;
