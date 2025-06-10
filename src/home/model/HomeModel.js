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
    id: 1,
    content: 'Kamu tidak sendiri. Pulih bisa dimulai dari sini.',
    user: {
      name: 'Admin',
      avatar: null
    },
    likes: [],
    comments: [],
    bookmarks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    content: 'Hari ini aku belajar untuk lebih sabar dan menerima diri.',
    user: {
      name: 'Admin',
      avatar: null
    },
    likes: [],
    comments: [],
    bookmarks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    content: 'Mencoba untuk bersyukur setiap hari membawa ketenangan pikiran.',
    user: {
      name: 'Admin',
      avatar: null
    },
    likes: [],
    comments: [],
    bookmarks: [],
    createdAt: new Date().toISOString()
  }
];

class HomeModel {
  async getMoodHistory() {
    console.log('Model: Fetching mood history');
    try {
      const response = await api.get('/mood/history/week');
      console.log('Model: Mood history response:', response.data);
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
    console.log('Model: Saving mood:', { moodLevel, entryDate });
    try {
      const response = await api.post('/mood/entry', {
        mood_level: moodLevel,
        entry_date: entryDate
      });
      console.log('Model: Save mood response:', response.data);
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
    console.log('Model: Fetching popular posts');
    try {
      const response = await api.get('/safespace/posts');
      console.log('Model: Popular posts response:', response.data);
      const posts = response.data.posts || response.data || [];
      const popularPosts = posts
        .filter(post => post.likes && Array.isArray(post.likes))
        .sort((a, b) => b.likes.length - a.likes.length)
        .slice(0, 3);
      
      return popularPosts.length > 0 ? popularPosts : fallbackPosts;
    } catch (error) {
      console.error('Model: Error fetching popular posts:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('Model: Using fallback posts due to network error');
        return fallbackPosts;
      }
      throw new Error(error.response?.data?.message || 'Gagal memuat post populer');
    }
  }
}

export default HomeModel; 