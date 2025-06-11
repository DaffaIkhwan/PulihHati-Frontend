import axios from 'axios';
import { API_CONFIG } from '../../config/api.js';

// Create axios instance with faster timeout for home page
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 3000, // 3 seconds max for home page requests
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

// Fallback posts for fast loading if API fails or times out
const fallbackPosts = [
  {
    id: 1,
    title: "Selamat datang di SafeSpace!",
    content: "Bagikan cerita dan dukunganmu di sini. Semua postingan bersifat anonim dan aman.",
    likes_count: 10,
    author: "Admin",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Tips menjaga kesehatan mental",
    content: "Luangkan waktu untuk dirimu sendiri setiap hari. Jangan ragu untuk meminta bantuan jika diperlukan.",
    likes_count: 8,
    author: "Admin",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Kamu tidak sendiri",
    content: "Banyak orang yang peduli dan siap mendengarkan ceritamu di sini.",
    likes_count: 5,
    author: "Admin",
    created_at: new Date().toISOString()
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
    // Return fallback posts immediately for faster loading
    const fastFallback = () => {
      console.log('Model: Using fallback posts for faster loading');
      return fallbackPosts;
    };

    try {
      const token = localStorage.getItem('token');

      // Use Promise.race to timeout quickly
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 2000)
      );

      let response;

      // Try authenticated endpoint first if user is logged in
      if (token && token !== 'null' && token !== 'undefined') {
        try {
          response = await Promise.race([
            api.get('/safespace/posts?limit=3'), // Reduced limit for faster loading
            timeoutPromise
          ]);
        } catch (authError) {
          // If auth fails, remove invalid token and fall back quickly
          if (authError.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          return fastFallback();
        }
      }

      // If no authenticated response, try public endpoint with timeout
      if (!response) {
        try {
          response = await Promise.race([
            api.get('/safespace/posts/public?limit=3'),
            timeoutPromise
          ]);
        } catch (publicError) {
          return fastFallback();
        }
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
      return fastFallback();
    }
  }
}

export default HomeModel; 