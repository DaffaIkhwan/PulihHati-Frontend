import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import HomePresenter from '../presenter/HomePresenter';
import HomeModel from '../model/HomeModel';
import MoodTracker from './components/MoodTracker';
import HeroSection from './components/HeroSection';
import ChatbotSection from './components/ChatbotSection';
import SafeSpaceSection from './components/SafeSpaceSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';


const quotes = [
  "Kesehatan mental sama pentingnya dengan kesehatan fisik",
  "Bersama kita bisa lebih kuat",
  "Setiap langkah kecil adalah kemajuan",
  "Kamu tidak sendirian dalam perjalanan ini"
];



function HomeView() {
  const [state, setState] = useState({
    moodHistory: [],
    selectedMood: null,
    showChart: false,
    loading: true,
    error: null,
    success: null,
    popularPosts: [],
    currentSlide: 0,
    currentQuote: 0
  });

  const presenterRef = useRef(null);

  useEffect(() => {
    console.log('Initializing HomeView...');
    try {
      const model = new HomeModel();
      const presenter = new HomePresenter(model);
      
      // Set initial state
      const initialState = {
        moodHistory: [],
        selectedMood: null,
        showChart: false,
        loading: true,
        error: null,
        success: null,
        popularPosts: [],
        currentSlide: 0,
        currentQuote: 0
      };
      
      presenter.setStateUpdater((newState) => {
        console.log('State updated:', newState);
        setState(newState);
      });
      
      presenterRef.current = presenter;
      
      // Initialize with initial state
      presenter.updateState(initialState);
      
      // Start initialization
      presenter.initialize().catch(error => {
        console.error('Error during initialization:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat data: ' + error.message
        }));
      });
    } catch (error) {
      console.error('Error creating presenter:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Terjadi kesalahan saat memuat halaman: ' + error.message
      }));
    }
  }, []);

  const handleMoodSelect = (moodId) => {
    console.log('Mood selected:', moodId);
    presenterRef.current?.handleMoodSelect(moodId);
  };

  const handleToggleChart = () => {
    console.log('Toggling chart');
    presenterRef.current?.toggleChart();
  };

  const handlePrevSlide = () => {
    console.log('Previous slide');
    presenterRef.current?.prevSlide();
  };

  const handleNextSlide = () => {
    console.log('Next slide');
    presenterRef.current?.nextSlide();
  };

  const handleNextQuote = () => {
    console.log('Next quote');
    setState(prev => ({
      ...prev,
      currentQuote: (prev.currentQuote + 1) % quotes.length
    }));
  };



  const handleQuoteChange = (index) => {
    console.log('Quote changed to:', index);
    setState(prev => ({
      ...prev,
      currentQuote: index
    }));
  };

  const handleSlideChange = (index) => {
    console.log('Slide changed to:', index);
    presenterRef.current?.setCurrentSlide(index);
  };

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    // Navigate to the specified path
    window.location.href = path;
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#A1BA82] flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#251404]/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/15 rounded-full blur-xl animate-pulse delay-300"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#251404]/20 border-t-[#251404] mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-[#251404] mb-2 font-['Sora']">Memuat PulihHati</h2>
          <p className="text-[#251404]/70 font-medium">Menyiapkan pengalaman terbaik untuk Anda...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-[#A1BA82] flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#251404]/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/15 rounded-full blur-xl"></div>
        </div>

        <div className="text-center relative z-10 max-w-md mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-[#251404] mb-3 font-['Sora']">Terjadi Kesalahan</h2>
            <p className="text-[#251404]/70 mb-6">{state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#A1BA82] to-[#A1BA82]/80 hover:from-[#A1BA82]/80 hover:to-[#A1BA82] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#A1BA82] min-h-screen pt-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#251404]/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-[#251404]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/15 rounded-full blur-xl"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 mb-12">
        <HeroSection
          currentQuote={state.currentQuote}
          onNextQuote={handleNextQuote}
          onQuoteChange={handleQuoteChange}
        />
      </section>

      {/* Mood Tracker Section */}
      <section className="w-full px-4 py-16 relative z-10 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
            <MoodTracker
              moodHistory={state.moodHistory}
              selectedMood={state.selectedMood}
              showChart={state.showChart}
              loading={state.loading}
              error={state.error}
              success={state.success}
              onMoodSelect={handleMoodSelect}
              onToggleChart={handleToggleChart}
            />
          </div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="relative z-10 mb-12">
        <ChatbotSection onNavigate={handleNavigation} />
      </section>

      {/* Safe Space Section */}
      <section className="relative z-10 mb-12">
        <SafeSpaceSection
          popularPosts={state.popularPosts}
          currentSlide={state.currentSlide}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
          onSlideChange={handleSlideChange}
          onNavigate={handleNavigation}
        />
      </section>

      {/* About Section */}
      <section className="relative z-10 mb-6">
        <AboutSection />
      </section>

      {/* Footer */}
      <Footer />


    </div>
  );
}

export default HomeView; 