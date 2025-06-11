import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, User, Mail, Edit3, X } from 'lucide-react';
import Navbar from './Navbar';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to validate and get proper avatar URL
const getValidAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  if (avatarUrl.includes('cloudinary.com') || avatarUrl.includes('res.cloudinary.com')) {
    return avatarUrl;
  }
  return null;
};

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return 'A';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [avatarUrl, setAvatarUrl] = useState('');

  const navigate = useNavigate();

  // Fetch user data from backend
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/safespace/profile-stats');
      const userData = response.data.user;

      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || ''
      });

      // Set avatar URL with proper validation
      const validAvatarUrl = getValidAvatarUrl(userData.avatar);
      setAvatarUrl(validAvatarUrl);
      setAvatarUrl(validAvatarUrl);
      console.log('User data loaded:', userData);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile data');

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setRequiresAuth(true);
      setLoading(false);
      return;
    }

    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Basic validation
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }

      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }

      // Update profile via API
      const response = await api.put('/safespace/profile', {
        name: formData.name,
        email: formData.email
      });

      // Update user state
      if (response.data.user) {
        const updatedUser = { ...user, ...response.data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setSuccess('Profile updated successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
    setIsEditing(false);
    setError('');
  };

  const handleAvatarUpload = async (file) => {
    try {
      // Validation
      if (!file) {
        alert('No file selected');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setUploading(true);
      setError('');

      // Create FormData
      const formData = new FormData();
      formData.append('avatar', file);

      // Upload avatar
      const response = await api.post('/safespace/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });

      // Update state with response data
      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        const newAvatarUrl = getValidAvatarUrl(updatedUser.avatar);

        setUser(updatedUser);
        setAvatarUrl(newAvatarUrl);
        setAvatarUrl(newAvatarUrl);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setTimeout(() => setSuccess(''), 3000);
      }

    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  // Show login prompt if authentication is required
  if (requiresAuth) {
    navigate('/signin');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#A1BA82]"> {/* Changed background */}
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-4 text-stone-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#A1BA82] pt-20"> {/* Changed background */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-stone-800">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="bg-stone-500 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-stone-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:from-stone-400 disabled:to-stone-400"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
            {success}
          </div>
        )}

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="relative">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-amber-300"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-amber-700 text-4xl font-medium">
                        {getInitials(user.name)}
                      </div>
                    )}

                    {/* Upload overlay when uploading */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="text-white text-xs">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto mb-1"></div>
                          Uploading...
                        </div>
                      </div>
                    )}

                    <label className={`absolute bottom-0 right-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-2 rounded-full cursor-pointer hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-stone-800 mb-2">
                  {user.name || 'User Name'}
                </h2>
                <p className="text-stone-600 mb-4">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
              <h3 className="text-xl font-semibold text-stone-800 mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50 text-stone-700"
                      placeholder="Enter your full name"
                      required
                    />
                  ) : (
                    <p className="text-stone-800 py-2 bg-stone-50 rounded-xl px-4">{user.name || 'Not provided'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50 text-stone-700"
                      placeholder="Enter your email"
                      required
                    />
                  ) : (
                    <p className="text-stone-800 py-2 bg-stone-50 rounded-xl px-4">{user.email || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
