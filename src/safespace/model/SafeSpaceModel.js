import axios from 'axios';

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
    if (!token) {
      window.location.href = '/signin';
      return Promise.reject('No token found');
    }
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

class SafeSpaceModel {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.CACHE_DURATION = 60000; // 1 minute cache
  }

  // Helper method to check if cache is valid
  isCacheValid(key) {
    const timestamp = this.cacheTimestamps.get(key);
    return timestamp && (Date.now() - timestamp) < this.CACHE_DURATION;
  }

  // Helper method to set cache
  setCache(key, data) {
    this.cache.set(key, data);
    this.cacheTimestamps.set(key, Date.now());
  }

  // Helper method to get cache
  getCache(key) {
    if (this.isCacheValid(key)) {
      return this.cache.get(key);
    }
    return null;
  }

  // Helper method to clear cache
  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
          this.cacheTimestamps.delete(key);
        }
      }
    } else {
      this.cache.clear();
      this.cacheTimestamps.clear();
    }
  }

  async getPosts() {
    try {
      // Check cache first
      const cacheKey = 'posts';
      const cachedData = this.getCache(cacheKey);
      if (cachedData) {
        console.log('Using cached posts data');
        return cachedData;
      }

      console.log('Fetching posts from server...');
      const response = await api.get('/safespace/posts');
      console.log('Posts response:', response.data);

      // Cache the response
      this.setCache(cacheKey, response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch posts. Please try again later.');
    }
  }

  async getPostById(postId) {
    try {
      console.log('Fetching complete post by ID:', postId);
      const response = await api.get(`/safespace/posts/${postId}`);
      console.log('Complete post response:', response.data);

      const postData = response.data;
      if (postData && !postData.comments) {
        postData.comments = [];
      }

      return postData;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch post. Please try again later.');
    }
  }

  async createPost(content, is_anonymous) {
    try {
      const response = await api.post('/safespace/posts', { content, is_anonymous: !!is_anonymous });

      // Clear posts cache since we have new data
      this.clearCache('posts');

      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error(error.response?.data?.message || 'Failed to create post. Please try again later.');
    }
  }

  async likePost(id) {
    try {
      const response = await api.put(`/safespace/posts/${id}/like`);

      // Clear posts cache since likes have changed
      this.clearCache('posts');

      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw new Error(error.response?.data?.message || 'Failed to like post. Please try again later.');
    }
  }

  async addComment(postId, content) {
    try {
      const response = await api.post(`/safespace/posts/${postId}/comments`, { content });

      // Clear posts cache since comments have changed
      this.clearCache('posts');

      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to add comment. Please try again later.');
    }
  }

  async toggleBookmark(postId) {
    try {
      const response = await api.put(`/safespace/posts/${postId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error('Error bookmarking post:', error);
      throw new Error(error.response?.data?.message || 'Failed to bookmark post. Please try again later.');
    }
  }

  async updatePost(postId, content) {
    try {
      const response = await api.put(`/safespace/posts/${postId}`, { content });

      // Clear posts cache since post has been updated
      this.clearCache('posts');

      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error(error.response?.data?.message || 'Failed to update post. Please try again later.');
    }
  }

  async deletePost(postId) {
    try {
      const response = await api.delete(`/safespace/posts/${postId}`);

      // Clear posts cache since post has been deleted
      this.clearCache('posts');

      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete post. Please try again later.');
    }
  }

  async getBookmarkedPosts() {
    try {
      const response = await api.get('/safespace/bookmarks');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarked posts:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bookmarked posts. Please try again later.');
    }
  }

  async getNotifications() {
    try {
      const response = await api.get('/safespace/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications. Please try again later.');
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/safespace/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read. Please try again later.');
    }
  }

  async markAllNotificationsAsRead() {
    try {
      const response = await api.put('/safespace/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read. Please try again later.');
    }
  }

  async getUserData() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user data. Please try again later.');
    }
  }

  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/safespace/upload-avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload avatar. Please try again later.');
    }
  }
}

export default new SafeSpaceModel(); 