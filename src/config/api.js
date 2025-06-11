// API Configuration
// This file centralizes all API-related configuration

// Get API base URL from environment variables
// Fallback to localhost if not set
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // Request timeout in milliseconds
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000, // Increased timeout for Railway backend

  // App environment
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',

  // Debug mode
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
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
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
};

// Log current configuration in development
if (API_CONFIG.DEBUG) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    environment: API_CONFIG.APP_ENV
  });

  // Test connection in debug mode
  testBackendConnection();
}

export default API_CONFIG;
