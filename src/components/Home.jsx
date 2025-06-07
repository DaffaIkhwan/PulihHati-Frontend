import { useState, useEffect, useCallback } from "react";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import axios from 'axios';
import Navbar from './Navbar';

const quotes = [
  "Kamu tidak sendiri. Pulih bisa dimulai dari sini.",
  "Setiap emosi itu valid. Dengarkan dirimu.",
  "Tak apa merasa lelah, kamu manusia.",
  "Langkah kecil tetap langkah menuju pulih."
];

// Mood types with emojis
const moodTypes = [
  { id: 1, emoji: '😢', label: 'Sedih', color: 'bg-blue-100 text-blue-700 border-blue-300', chartColor: '#3B82F6' },
  { id: 2, emoji: '😟', label: 'Cemas', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', chartColor: '#F59E0B' },
  { id: 3, emoji: '😐', label: 'Netral', color: 'bg-gray-100 text-gray-700 border-gray-300', chartColor: '#6B7280' },
  { id: 4, emoji: '😊', label: 'Senang', color: 'bg-green-100 text-green-700 border-green-300', chartColor: '#10B981' },
  { id: 5, emoji: '😄', label: 'Sangat Bahagia', color: 'bg-pink-100 text-pink-700 border-pink-300', chartColor: '#EC4899' }
];



// API configuration
const API_URL = 'http://localhost:5000/api';
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

// Mood Tracker Component
const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Generate empty mood history for last 7 days
  const generateEmptyMoodHistory = useCallback(() => {
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayIndex = date.getDay();
      const dayName = dayNames[dayIndex];

      result.push({
        day: dayName,
        date: dateStr,
        mood: null,
        emoji: null,
        label: null,
        hasEntry: false
      });
    }

    return result;
  }, []);

  // Fetch weekly mood history from backend
  const fetchWeeklyMoodHistory = useCallback(async () => {
    try {
      const response = await api.get('/mood/history/week');
      console.log('📊 Received mood history:', response.data.data);

      // If no data received, use empty structure
      if (!response.data.data || response.data.data.length === 0) {
        setMoodHistory(generateEmptyMoodHistory());
      } else {
        setMoodHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching mood history:', error);
      setError('Gagal memuat riwayat mood');
      // Set empty mood history as fallback
      setMoodHistory(generateEmptyMoodHistory());
    }
  }, [generateEmptyMoodHistory]);

  // Fetch mood types and history on component mount
  useEffect(() => {
    fetchWeeklyMoodHistory();
  }, [fetchWeeklyMoodHistory]);

  // Handle mood selection and save to backend
  const handleMoodSelect = async (moodId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get local date in YYYY-MM-DD format
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayDate = `${year}-${month}-${day}`;

      const todayDay = now.getDay(); // 0=Minggu, 1=Senin, dst
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

      console.log(`📅 Saving mood for: ${todayDate} (${dayNames[todayDay]})`);
      console.log(`😊 Mood level: ${moodId}`);

      // Save mood to backend
      const response = await api.post('/mood/entry', {
        mood_level: moodId,
        entry_date: todayDate
      });

      console.log('✅ Mood saved successfully:', response.data);

      setSelectedMood(moodId);
      setSuccess(`Mood ${dayNames[todayDay]} berhasil disimpan!`);

      // Update mood history immediately for real-time feedback
      const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const todayShort = dayNamesShort[todayDay];
      const selectedMoodType = moodTypes.find(m => m.id === moodId);

      // Update the mood history state immediately
      setMoodHistory(prevHistory => {
        const updatedHistory = [...prevHistory];
        const todayIndex = updatedHistory.findIndex(item => item.day === todayShort);

        if (todayIndex !== -1) {
          // Update existing entry
          updatedHistory[todayIndex] = {
            ...updatedHistory[todayIndex],
            mood: moodId,
            emoji: selectedMoodType?.emoji || '😐',
            label: selectedMoodType?.label || 'Unknown',
            hasEntry: true
          };
        } else {
          // Add new entry for today (shouldn't happen normally, but just in case)
          updatedHistory.push({
            day: todayShort,
            date: todayDate,
            mood: moodId,
            emoji: selectedMoodType?.emoji || '😐',
            label: selectedMoodType?.label || 'Unknown',
            hasEntry: true
          });
        }

        console.log('📊 Updated mood history:', updatedHistory);
        return updatedHistory;
      });

      // Also refresh from backend to ensure data consistency
      setTimeout(() => {
        fetchWeeklyMoodHistory();
      }, 500);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSelectedMood(null);
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Error saving mood:', error);
      setError(error.response?.data?.message || 'Gagal menyimpan mood');
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (moodId) => {
    const mood = moodTypes.find(m => m.id === moodId);
    return mood ? mood.emoji : '😐';
  };

  const getMoodColor = (moodId) => {
    const mood = moodTypes.find(m => m.id === moodId);
    return mood ? mood.chartColor : '#6B7280';
  };

  const maxMood = Math.max(...moodHistory.map(item => item.mood));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-stone-800 mb-1">Mood Tracker</h3>
          <p className="text-stone-600 text-sm">Bagaimana perasaanmu hari ini?</p>
        </div>
        <button
          onClick={() => setShowChart(!showChart)}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium">{showChart ? 'Sembunyikan' : 'Lihat'} Grafik</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">
          {error}
        </div>
      )}

      {/* Mood Selection */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {moodTypes.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            disabled={loading}
            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedMood === mood.id
                ? 'border-amber-500 bg-amber-50 shadow-lg'
                : mood.color + ' hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-2">{mood.emoji}</div>
            <div className="text-xs font-medium">{mood.label}</div>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            Menyimpan mood...
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-center">
          <span className="text-lg mr-2">{getMoodEmoji(selectedMood)}</span>
          {success}
        </div>
      )}

      {/* Chart */}
      {showChart && (
        <div className="border-t border-stone-200 pt-6">
          <h4 className="text-lg font-medium text-stone-800 mb-4">Mood 7 Hari Terakhir</h4>
          <div className="flex items-end justify-between h-32 bg-stone-50 rounded-xl p-4">
            {moodHistory.map((item) => (
              <div key={`${item.day}-${item.date}`} className="flex flex-col items-center">
                <div
                  className="w-8 rounded-t-lg mb-2 transition-all duration-500 ease-in-out"
                  style={{
                    height: item.mood ? `${(item.mood / maxMood) * 80}px` : '10px',
                    backgroundColor: item.mood ? getMoodColor(item.mood) : '#E5E7EB',
                    minHeight: '10px',
                    transform: item.hasEntry ? 'scale(1)' : 'scale(0.8)',
                    opacity: item.hasEntry ? 1 : 0.5
                  }}
                ></div>
                <div className="text-xs text-stone-600 font-medium">{item.day}</div>
                <div className="text-lg mt-1 transition-all duration-300">
                  {item.emoji || '⚪'}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {moodTypes.map((mood) => (
              <div key={mood.id} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: mood.chartColor }}
                ></div>
                <span className="text-xs text-stone-600">{mood.emoji} {mood.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Popular Posts Component
const PopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch popular posts
  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await api.get('/safespace/posts');
        const posts = response.data.posts || response.data || [];

        // Sort by likes count and take top 3
        const sortedPosts = posts
          .filter(post => post.likes && Array.isArray(post.likes))
          .sort((a, b) => b.likes.length - a.likes.length)
          .slice(0, 3);

        setPopularPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching popular posts:', error);
        setPopularPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  // Auto slide effect
  useEffect(() => {
    if (popularPosts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % popularPosts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [popularPosts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % popularPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + popularPosts.length) % popularPosts.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (popularPosts.length === 0) {
    return (
      <div className="text-center text-white py-8">
        <p className="text-lg">Belum ada post populer</p>
        <p className="text-sm opacity-80">Mulai berbagi cerita untuk melihat post terpopuler</p>
      </div>
    );
  }

  const currentPost = popularPosts[currentSlide];

  return (
    <div className="relative">
      {/* Post Card */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl shadow-lg border border-stone-200 p-4 min-h-[160px] transition-all duration-500 transform">
        <div className="flex items-start mb-3">
          <img
            src={currentPost.author?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
            alt={currentPost.author?.name}
            className="h-8 w-8 rounded-full mr-2 border-2 border-amber-300"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-stone-800 text-sm">{currentPost.author?.name || 'Anonymous'}</h4>
            <p className="text-xs text-stone-500">
              {new Date(currentPost.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <p className="text-stone-700 text-sm leading-relaxed mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {currentPost.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-red-500">
              <Heart className="h-4 w-4 mr-1 fill-current" />
              <span className="text-sm font-medium">{currentPost.likes?.length || 0}</span>
            </div>
            <div className="flex items-center text-stone-500">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{currentPost.comments?.length || 0}</span>
            </div>
          </div>

          <div className="text-xs text-amber-700 font-medium bg-amber-100 px-2 py-1 rounded-full">
            #Trending
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {popularPosts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {popularPosts.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {popularPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(0);

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    // In real app, use navigate(path)
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 min-h-screen pt-20">
      <Navbar />

      {/* Mood Tracker Section */}
      <section className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <MoodTracker />
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full min-h-[500px] bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center px-4 py-4">
        <div className="max-w-4xl w-full bg-white rounded-[40px] shadow-2xl shadow-stone-400/20 flex flex-col lg:flex-row gap-8 justify-center items-center p-8 lg:p-12 backdrop-blur-sm border border-white/50">
          <div className="flex-shrink-0 transition-transform duration-700 hover:scale-105">
            <img
              className="w-80 h-64 object-contain drop-shadow-lg"
              src="/public/Frame.png"
              alt="Mental Health Illustration"
            />
          </div>
          <div className="flex-1 max-w-md text-center lg:text-left">
            <div className="text-stone-800 text-3xl lg:text-4xl font-bold font-['Sora'] leading-relaxed transition-all duration-700 ease-in-out transform">
              <span className="inline-block animate-pulse">
                {quotes[currentQuote]}
              </span>
            </div>
            <div className="flex justify-center lg:justify-start mt-6 space-x-2">
              {quotes.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuote ? 'bg-amber-600 w-6' : 'bg-stone-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="w-full flex justify-center px-4 py-8">
        <div className="max-w-4xl w-full bg-gradient-to-br from-amber-300 via-amber-300 to-amber-400 rounded-[40px] shadow-2xl shadow-amber-500/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12">
            <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
              <img
                className="w-72 h-72 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-110"
                src="/public/Group.png"
                alt="Chatbot Character"
              />
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-stone-800 text-2xl lg:text-3xl font-bold font-['Sora'] leading-tight mb-8 max-w-lg">
                Tanya apa saja tentang kesehatan mental mu, aku siap membantu!!
              </h2>

              <button
                onClick={() => handleNavigation('/chatbot')}
                className="group/btn bg-stone-700 hover:bg-stone-800 text-white px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 inline-flex items-center gap-3"
              >
                <span className="text-lg font-bold font-['Urbanist']">
                  Ngobrol yuk
                </span>
                <div className="w-6 h-6 relative">
                  <div className="absolute top-1/2 left-1 w-4 h-0.5 bg-white rounded transform -translate-y-1/2 transition-transform group-hover/btn:translate-x-1"></div>
                  <div className="absolute top-1/2 right-1 w-3 h-3 border-r-2 border-t-2 border-white transform rotate-45 -translate-y-1/2 transition-transform group-hover/btn:rotate-90"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Space Section */}
      <section className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-700 via-amber-700 to-amber-800 rounded-[40px] shadow-2xl shadow-amber-900/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>

          <div className="relative z-10 p-8 lg:p-12">
            <h2 className="text-white text-3xl lg:text-4xl font-bold font-['Sora'] text-center mb-8">
              Safe Space
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-[30px] shadow-xl p-6 lg:p-8 backdrop-blur-sm border border-white/20">
                <div className="text-center space-y-8">
                  <h3 className="text-stone-800 text-xl lg:text-2xl font-semibold font-['Sora'] leading-relaxed">
                    Ruang Aman untuk Berbagi
                  </h3>
                  <p className="text-stone-600 text-base leading-relaxed">
                    Bergabunglah dengan komunitas yang saling mendukung dan memahami perjalanan kesehatan mental Anda.
                  </p>

                  {/* Popular Posts Section */}
                  <div className="py-6">
                    <PopularPosts />
                  </div>

                  <button
                    onClick={() => handleNavigation('/safespace')}
                    className="bg-gradient-to-r from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 text-stone-800 px-8 py-4 rounded-full border-2 border-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 font-semibold font-['Sora']"
                  >
                    Bergabung Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-stone-300/20 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-shrink-0 p-8 lg:p-12 bg-gradient-to-br from-stone-50 to-stone-100">
              <img
                className="w-full max-w-sm h-auto object-contain mx-auto drop-shadow-lg"
                src="/public/Group (1).png"
                alt="About PulihHati"
              />
            </div>

            <div className="flex-1 p-8 lg:p-12">
              <h2 className="text-stone-800 text-2xl lg:text-3xl font-bold font-['Sora'] mb-8 text-center lg:text-left">
                Tentang PulihHati
              </h2>

              <div className="space-y-6 text-stone-700 text-sm lg:text-base font-['Sora'] leading-relaxed">
                <p>
                  <strong>PulihHati</strong> adalah sebuah inisiatif digital yang lahir dari keprihatinan terhadap meningkatnya kasus gangguan kesehatan mental, terutama di kalangan remaja dan dewasa muda. Kami percaya bahwa setiap individu berhak atas akses terhadap kesehatan jiwa yang mudah, aman, dan tanpa stigma.
                </p>

                <p>
                  Didukung oleh tim multidisiplin dari berbagai universitas di Indonesia, PulihHati dirancang sebagai aplikasi berbasis web yang membantu pengguna mengenali kondisi kesehatan mental mereka secara mandiri melalui pendekatan ilmiah berbasis data dan teknologi kecerdasan buatan (AI/ML).
                </p>

                <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-6 rounded-2xl border-l-4 border-amber-600">
                  <p className="font-medium">
                    <span className="text-amber-600">🔹</span> Asesmen Kesehatan Mental / Chatbot Interaktif untuk deteksi awal kondisi psikologis<br/>
                    <span className="text-amber-600">🔹</span> Mood Tracker untuk memantau dan memahami dinamika emosi<br/>
                    <span className="text-amber-600">🔹</span> Forum SafeSpace sebagai ruang aman untuk berbagi dan saling mendukung
                  </p>
                </div>

                <p>
                  PulihHati tidak hanya menjadi alat bantu personal, tetapi juga gerakan kolektif untuk memutus rantai stigma dan membuka ruang dialog sehat seputar kesehatan mental. Dengan desain yang inklusif dan teknologi yang humanis, kami berkomitmen untuk membantu masyarakat menemukan kembali tenangnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-16">
        <div className="bg-gradient-to-r from-[#9bb067] via-[#a8bd74] to-[#9bb067] py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h3 className="text-stone-800 text-3xl lg:text-4xl font-bold font-['Sora'] mb-4">
                Pulih Hati
              </h3>
              <p className="text-stone-700 text-lg font-['Sora'] max-w-2xl mx-auto leading-relaxed">
                Bersama membangun kesehatan mental yang lebih baik untuk Indonesia
              </p>
              <div className="mt-8 flex justify-center space-x-8">
                <div className="w-12 h-1 bg-stone-600 rounded-full"></div>
                <div className="w-8 h-1 bg-stone-500 rounded-full"></div>
                <div className="w-12 h-1 bg-stone-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}