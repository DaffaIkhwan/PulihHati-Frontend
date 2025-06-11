import axios from 'axios';
import { API_CONFIG } from '../../config/api.js';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
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

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect immediately, let the component handle it
      console.log('Authentication required for SafeSpace');
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

  async getPosts(page = 1, limit = 10, append = false) {
    try {
      // Create cache key with pagination
      const cacheKey = `posts_page_${page}_limit_${limit}`;

      // For first page, check if we have cached data
      if (page === 1 && !append) {
        const cachedData = this.getCache('posts_all');
        if (cachedData && cachedData.length > 0) {
          console.log('Using cached posts data');
          return cachedData;
        }
      }

      const token = localStorage.getItem('token');
      let posts = [];
      let responseData = null;

      // If user is logged in, try authenticated endpoint first for full features
      if (token) {
        try {
          console.log(`Fetching authenticated posts from server... (page: ${page}, limit: ${limit})`);
          const authResponse = await api.get(`/safespace/posts?page=${page}&limit=${limit}`);
          console.log('Authenticated posts response:', authResponse.data);

          // Handle pagination response
          responseData = authResponse.data;
          if (responseData && responseData.posts && Array.isArray(responseData.posts)) {
            posts = responseData.posts;
            this.setCache('pagination_info', responseData.pagination);
          } else if (Array.isArray(responseData)) {
            posts = responseData;
          }

          if (append && page > 1) {
            const existingPosts = this.getCache('posts_all') || [];
            posts = [...existingPosts, ...posts];
          }

          this.setCache('posts_all', posts);
          this.setCache(cacheKey, responseData);

          return posts;
        } catch (authError) {
          console.error('Authenticated posts failed:', authError);
          // If auth fails due to invalid token, remove it and fall back to public
          if (authError.response?.status === 401) {
            console.log('Token invalid, removing and falling back to public endpoint');
            localStorage.removeItem('token');
          }
          // Continue to try public endpoint
        }
      }

      // Try public endpoint (for non-authenticated users or as fallback)
      console.log(`Fetching public posts from server... (page: ${page}, limit: ${limit})`);
      console.log('API URL:', `${api.defaults.baseURL}/safespace/posts/public`);

      try {
        const publicResponse = await api.get(`/safespace/posts/public?page=${page}&limit=${limit}`);
        console.log('Public posts response status:', publicResponse.status);
        console.log('Public posts response data:', publicResponse.data);

        // Handle pagination response
        responseData = publicResponse.data;
        if (responseData && responseData.posts && Array.isArray(responseData.posts)) {
          posts = responseData.posts;
          this.setCache('pagination_info', responseData.pagination);
        } else if (Array.isArray(responseData)) {
          posts = responseData;
        }

        if (append && page > 1) {
          const existingPosts = this.getCache('posts_all') || [];
          // Filter out duplicates based on _id or id
          const newPosts = posts.filter(newPost =>
            !existingPosts.some(existingPost =>
              (existingPost._id && newPost._id && existingPost._id === newPost._id) ||
              (existingPost.id && newPost.id && existingPost.id === newPost.id)
            )
          );
          posts = [...existingPosts, ...newPosts];
          console.log(`Appended ${newPosts.length} new posts, total: ${posts.length}`);
        }

        this.setCache('posts_all', posts);
        this.setCache(cacheKey, responseData);

        return posts;
      } catch (publicError) {
        console.error('Public posts also failed:', publicError);
        throw publicError;
      }

    } catch (error) {
      console.error('Error fetching posts:', error);

      // Provide more specific error messages
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('Backend not available, using mock data for demo...');

        // Return mock data for demo purposes
        const mockPosts = [
          {
            _id: 'demo-1',
            id: 'demo-1',
            content: 'Ini adalah contoh post dalam mode read-only. Backend sedang tidak tersedia, tapi Anda tetap bisa melihat bagaimana SafeSpace bekerja.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            author: {
              _id: 'demo-user',
              id: 'demo-user',
              name: 'Demo User',
              avatar: null
            },
            likes: [],
            comments: [],
            likes_count: 5,
            comments_count: 2,
            bookmarked: false,
            liked: false
          },
          {
            _id: 'demo-2',
            id: 'demo-2',
            content: 'Mode read-only memungkinkan Anda melihat posts tanpa perlu login. Untuk berinteraksi (like, comment, post), silakan login terlebih dahulu.',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            author: {
              _id: 'anonymous',
              id: 'anonymous',
              name: 'Anonymous',
              avatar: null
            },
            likes: [],
            comments: [],
            likes_count: 12,
            comments_count: 8,
            bookmarked: false,
            liked: false
          }
        ];

        // Cache mock data
        this.setCache(cacheKey, mockPosts);
        this.setCache('isAuthenticated', false);

        return mockPosts;
      }

      if (error.response?.status === 404) {
        throw new Error('Posts endpoint not found. Please check if the backend is updated.');
      }

      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch posts. Please try again later.');
    }
  }

  // Check if there are more posts to load
  async hasMorePosts(page = 1, limit = 10) {
    try {
      console.log(`Checking if there are more posts after page ${page}`);

      // First check cached pagination info
      const paginationInfo = this.getCache('pagination_info');
      if (paginationInfo) {
        console.log('Using cached pagination info:', paginationInfo);
        const hasMore = paginationInfo.hasNext || page < paginationInfo.pages;
        console.log(`Has more posts: ${hasMore}`);
        return hasMore;
      }

      // Check current posts count to make a better decision
      const currentPosts = this.getCache('posts_all') || [];
      const expectedPostsForPage = page * limit;

      // If we have fewer posts than expected for this page, likely no more posts
      if (currentPosts.length < expectedPostsForPage && page > 1) {
        console.log(`Current posts (${currentPosts.length}) < expected (${expectedPostsForPage}), likely no more posts`);
        return false;
      }

      // Fallback: check by making a request for next page
      const nextPage = page + 1;
      const token = localStorage.getItem('token');
      let endpoint = '/safespace/posts/public';

      // If user is authenticated, try authenticated endpoint first
      if (token) {
        try {
          console.log(`Checking authenticated endpoint for page ${nextPage}`);
          const response = await api.get(`/safespace/posts?page=${nextPage}&limit=1`);
          if (response.data && response.data.posts) {
            const hasMore = response.data.posts.length > 0;
            console.log(`Authenticated check - has more: ${hasMore}`);
            return hasMore;
          } else if (Array.isArray(response.data)) {
            const hasMore = response.data.length > 0;
            console.log(`Authenticated check (array) - has more: ${hasMore}`);
            return hasMore;
          }
          return false;
        } catch (authError) {
          console.error('Auth check failed:', authError);
          // If auth fails, fall back to public endpoint
          if (authError.response?.status === 401) {
            localStorage.removeItem('token');
          }
        }
      }

      // Try public endpoint
      console.log(`Checking public endpoint for page ${nextPage}`);
      const response = await api.get(`${endpoint}?page=${nextPage}&limit=1`);
      if (response.data && response.data.posts) {
        const hasMore = response.data.posts.length > 0;
        console.log(`Public check - has more: ${hasMore}`);
        return hasMore;
      } else if (Array.isArray(response.data)) {
        const hasMore = response.data.length > 0;
        console.log(`Public check (array) - has more: ${hasMore}`);
        return hasMore;
      }

      console.log('No more posts found');
      return false;
    } catch (error) {
      console.error('Error checking for more posts:', error);

      // For network errors, be more conservative - assume there might be more posts
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('Network error - assuming more posts might be available');
        return true; // Allow retry
      }

      // For 404 or other server errors, assume no more posts
      if (error.response?.status === 404 || error.response?.status >= 500) {
        console.log('Server error - assuming no more posts');
        return false;
      }

      // For other errors, be conservative and assume more posts might be available
      console.log('Unknown error - assuming more posts might be available for retry');
      return true;
    }
  }

  // Clear posts cache when needed
  clearPostsCache() {
    this.clearCache('posts_all');
    // Clear all page-specific caches
    for (const key of this.cache.keys()) {
      if (key.startsWith('posts_page_')) {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');

    // If no token, definitely not authenticated
    if (!token) {
      return false;
    }

    // If we have a token, consider authenticated
    // The actual validation will happen when making API calls
    return true;
  }

  // Validate token with backend
  async validateToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      // Try to get user data to validate token
      const response = await api.get('/auth/me');
      return response.status === 200;
    } catch (error) {
      // If token is invalid, remove it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        return false;
      }
      // For other errors (network, server), assume token is still valid
      return true;
    }
  }

  async getPostById(postId) {
    try {
      console.log('Fetching complete post by ID:', postId);
      const token = localStorage.getItem('token');

      // If user is authenticated, try authenticated endpoint first for full features
      if (token) {
        try {
          console.log('Fetching authenticated post by ID:', postId);
          const authResponse = await api.get(`/safespace/posts/${postId}`);
          console.log('Authenticated post response:', authResponse.data);

          const postData = authResponse.data;
          if (postData && !postData.comments) {
            postData.comments = [];
          }

          return postData;
        } catch (authError) {
          console.error('Authenticated post endpoint failed:', authError);
          // If auth fails due to invalid token, remove it and fall back to public
          if (authError.response?.status === 401) {
            console.log('Token invalid, removing and falling back to public endpoint');
            localStorage.removeItem('token');
          }
          // Continue to try public endpoint
        }
      }

      // Try public endpoint (for non-authenticated users or as fallback)
      console.log('Fetching public post by ID:', postId);
      const publicResponse = await api.get(`/safespace/posts/${postId}/public`);
      console.log('Public post response:', publicResponse.data);

      const postData = publicResponse.data;
      if (postData && !postData.comments) {
        postData.comments = [];
      }

      return postData;
    } catch (error) {
      console.error('Error fetching post by ID:', error);

      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }

      if (error.response?.status === 404) {
        throw new Error('Post not found or endpoint not available.');
      }

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