import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, User, Mail, Edit3, X, MessageSquare, Heart, Bookmark, FileText } from 'lucide-react';
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

const ProfileSimple = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Posts state
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

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

  // Fetch posts data based on active tab
  const fetchPostsData = useCallback(async (tab) => {
    try {
      setPostsLoading(true);
      setError('');

      let response;
      switch (tab) {
        case 'posts':
          response = await api.get('/safespace/user/posts');
          setUserPosts(Array.isArray(response.data) ? response.data : response.data.posts || []);
          break;
        case 'comments':
          response = await api.get('/safespace/user/comments');
          setUserComments(Array.isArray(response.data) ? response.data : response.data.comments || []);
          break;
        case 'bookmarks':
          response = await api.get('/safespace/bookmarks');
          setUserBookmarks(Array.isArray(response.data) ? response.data : response.data.posts || []);
          break;
        case 'likes':
          response = await api.get('/safespace/user/likes');
          setUserLikes(Array.isArray(response.data) ? response.data : response.data.posts || []);
          break;
        default:
          break;
      }

      console.log(`${tab} data loaded`);
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
      setError(`Failed to load ${tab}`);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    fetchUserData();
  }, [fetchUserData, navigate]);

  // Load posts when tab changes
  useEffect(() => {
    if (user.id || user._id) {
      fetchPostsData(activeTab);
    }
  }, [activeTab, user, fetchPostsData]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 pt-20">
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
                  <div className="h-32 w-32 rounded-full bg-stone-200 border-4 border-amber-200 flex items-center justify-center">
                    <User className="h-16 w-16 text-stone-400" />
                  </div>
                  <label className="absolute bottom-0 right-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-2 rounded-full cursor-pointer hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
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
                    />
                  ) : (
                    <p className="text-stone-800 py-2 bg-stone-50 rounded-xl px-4">{user.email || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 mt-6">
          <h3 className="text-xl font-semibold text-stone-800 mb-6">My Activity</h3>

          {/* Tabs */}
          <div className="flex border-b border-stone-300 mb-6">
            <button className="px-4 py-2 font-medium text-amber-700 border-b-2 border-amber-700">
              <FileText className="h-5 w-5 inline mr-1" />
              <span>Posts</span>
            </button>
            <button className="px-4 py-2 font-medium text-stone-500 hover:text-stone-700">
              <MessageSquare className="h-5 w-5 inline mr-1" />
              <span>Comments</span>
            </button>
            <button className="px-4 py-2 font-medium text-stone-500 hover:text-stone-700">
              <Bookmark className="h-5 w-5 inline mr-1" />
              <span>Bookmarks</span>
            </button>
            <button className="px-4 py-2 font-medium text-stone-500 hover:text-stone-700">
              <Heart className="h-5 w-5 inline mr-1" />
              <span>Likes</span>
            </button>
          </div>

          {/* Demo Posts */}
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-stone-200 border-2 border-amber-200 flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-stone-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-stone-800">Demo User</h4>
                    <span className="text-xs text-stone-500">•</span>
                    <p className="text-xs text-stone-500">1 day ago</p>
                  </div>
                  <p className="text-stone-700 mb-3">
                    Hari ini aku belajar untuk lebih sabar dan menerima diri. Perjalanan healing memang tidak mudah, tapi setiap langkah kecil sangat berarti. 💙
                  </p>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      2 likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      1 comment
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-stone-200 border-2 border-amber-200 flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-stone-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-stone-800">Demo User</h4>
                    <span className="text-xs text-stone-500">•</span>
                    <p className="text-xs text-stone-500">2 days ago</p>
                  </div>
                  <p className="text-stone-700 mb-3">
                    Mencoba untuk bersyukur setiap hari membawa ketenangan pikiran. Kadang hal-hal kecil yang paling bermakna. 🌸
                  </p>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      1 like
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      0 comments
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-stone-200 border-2 border-amber-200 flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-stone-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-stone-800">Demo User</h4>
                    <span className="text-xs text-stone-500">•</span>
                    <p className="text-xs text-stone-500">3 days ago</p>
                  </div>
                  <p className="text-stone-700 mb-3">
                    Kamu tidak sendiri. Pulih bisa dimulai dari sini. Mari kita saling mendukung dalam perjalanan ini. ✨
                  </p>
                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      3 likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      1 comment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSimple;
