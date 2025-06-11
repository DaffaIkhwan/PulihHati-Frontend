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

// Fallback data for popular posts
const fallbackPosts = [
  {
    _id: 'fallback-1',
    id: 'fallback-1',
    content: '🌱 Kamu tidak sendiri dalam perjalanan ini. Setiap langkah kecil menuju kesehatan mental adalah kemajuan yang berarti. Mari kita saling mendukung dan tumbuh bersama di komunitas yang aman ini.',
    author: {
      _id: 'admin-1',
      id: 'admin-1',
      name: 'PulihHati Team',
      avatar: null
    },
    likes: Array(15).fill().map((_, i) => ({ _id: `like-${i}` })),
    comments: Array(8).fill().map((_, i) => ({ _id: `comment-${i}` })),
    likes_count: 15,
    comments_count: 8,
    bookmarked: false,
    liked: false,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'fallback-2',
    id: 'fallback-2',
    content: '💪 Hari ini aku belajar untuk lebih sabar dan menerima diri apa adanya. Proses healing memang tidak mudah, tapi setiap hari adalah kesempatan baru untuk menjadi versi terbaik dari diri kita.',
    author: {
      _id: 'admin-2',
      id: 'admin-2',
      name: 'Wellness Guide',
      avatar: null
    },
    likes: Array(12).fill().map((_, i) => ({ _id: `like-${i}` })),
    comments: Array(6).fill().map((_, i) => ({ _id: `comment-${i}` })),
    likes_count: 12,
    comments_count: 6,
    bookmarked: false,
    liked: false,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    _id: 'fallback-3',
    id: 'fallback-3',
    content: '🙏 Mencoba untuk bersyukur setiap hari membawa ketenangan pikiran yang luar biasa. Kadang hal-hal kecil seperti secangkir teh hangat atau senyuman orang asing bisa mengubah seluruh hari kita.',
    author: {
      _id: 'admin-3',
      id: 'admin-3',
      name: 'Mindful Soul',
      avatar: null
    },
    likes: Array(18).fill().map((_, i) => ({ _id: `like-${i}` })),
    comments: Array(10).fill().map((_, i) => ({ _id: `comment-${i}` })),
    likes_count: 18,
    comments_count: 10,
    bookmarked: false,
    liked: false,
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 259200000).toISOString()
  }
];

class HomeModel {
  async getMoodHistory() {
    try {
      const response = await api.get('/mood/history/week');
      return response.data.data;
    } catch (error) {
      console.error('Model: Error fetching mood history:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
      }
      throw new Error(error.response?.data?.message || 'Gagal memuat riwayat mood');
    }
  }

  async saveMood(moodLevel, entryDate) {
    try {
      const response = await api.post('/mood/entry', {
        mood_level: moodLevel,
        entry_date: entryDate
      });
      return response.data;
    } catch (error) {
      console.error('Model: Error saving mood:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
      }
      throw new Error(error.response?.data?.message || 'Gagal menyimpan mood');
    }
  }

  async getPopularPosts() {
    try {
      const token = localStorage.getItem('token');
      let response;

      // Try authenticated endpoint first if user is logged in
      if (token && token !== 'null' && token !== 'undefined') {
        try {
          response = await api.get('/safespace/posts?limit=10');
        } catch (authError) {
          // If auth fails, remove invalid token and fall back to public
          if (authError.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          response = null;
        }
      }

      // If no authenticated response, try public endpoint
      if (!response) {
        response = await api.get('/safespace/posts/public?limit=10');
      }

      const posts = response.data.posts || response.data || [];

      const popularPosts = posts
        .filter(post => post.likes_count !== undefined || (post.likes && Array.isArray(post.likes)))
        .sort((a, b) => {
          const aLikes = a.likes_count || (a.likes ? a.likes.length : 0);
          const bLikes = b.likes_count || (b.likes ? b.likes.length : 0);
          return bLikes - aLikes;
        })
        .slice(0, 3);

      return popularPosts.length > 0 ? popularPosts : fallbackPosts;
    } catch (error) {
      console.error('Model: Error fetching popular posts:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return fallbackPosts;
      }

      // If public endpoint also fails, return fallback posts instead of throwing error
      return fallbackPosts;
    }
  }
}

export default HomeModel; 