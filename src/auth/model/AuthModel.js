import api from '../../utils/api';

class AuthModel {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Login user
  async login(email, password) {
    try {
      console.log('🔐 Attempting login to:', api.defaults.baseURL);

      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log('✅ Login successful');
      return { token, user };
    } catch (error) {
      console.error('❌ Login error:', error);

      // Handle network errors specifically
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      }

      // Handle timeout errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Koneksi timeout. Server membutuhkan waktu terlalu lama untuk merespons.');
      }

      // Handle other errors
      throw new Error(error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { token, user };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout endpoint if available
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get current token from localStorage
  getCurrentToken() {
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getCurrentToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Verify token with backend
  async verifyToken() {
    try {
      const token = this.getCurrentToken();
      if (!token) {
        return false;
      }

      const response = await api.get('/auth/verify');
      return response.data.valid === true;
    } catch (error) {
      console.error('Token verification error:', error);
      // Clear invalid token
      this.logout();
      return false;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;

      // Update stored token
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      this.logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      const updatedUser = response.data;

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile.');
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });

      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password.');
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      await api.post('/auth/forgot-password', { email });
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send reset email.');
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to reset password.');
    }
  }

  // Initialize auth state
  initializeAuth() {
    const token = this.getCurrentToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    };
  }

  // Clear cache
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

export default AuthModel;
