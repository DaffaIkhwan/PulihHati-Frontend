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

const moodTypes = [
  { id: 1, label: 'Sangat Baik', emoji: '😊', color: 'border-green-500 bg-green-50', chartColor: '#22C55E' },
  { id: 2, label: 'Baik', emoji: '🙂', color: 'border-emerald-500 bg-emerald-50', chartColor: '#10B981' },
  { id: 3, label: 'Biasa', emoji: '😐', color: 'border-yellow-500 bg-yellow-50', chartColor: '#EAB308' },
  { id: 4, label: 'Buruk', emoji: '😔', color: 'border-orange-500 bg-orange-50', chartColor: '#F97316' },
  { id: 5, label: 'Sangat Buruk', emoji: '😢', color: 'border-red-500 bg-red-50', chartColor: '#EF4444' }
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

  const handlePrevQuote = () => {
    console.log('Previous quote');
    setState(prev => ({
      ...prev,
      currentQuote: (prev.currentQuote - 1 + quotes.length) % quotes.length
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
    // In real app, use navigate(path)
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Terjadi Kesalahan</p>
          <p>{state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 min-h-screen pt-20">
      <Navbar />

      {/* Mood Tracker Section */}
      <section className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
      </section>

      {/* Hero Section */}
      <HeroSection
        currentQuote={state.currentQuote}
        onPrevQuote={handlePrevQuote}
        onNextQuote={handleNextQuote}
        onQuoteChange={handleQuoteChange}
      />

      {/* Chatbot Section */}
      <ChatbotSection onNavigate={handleNavigation} />

      {/* Safe Space Section */}
      <SafeSpaceSection
        popularPosts={state.popularPosts}
        currentSlide={state.currentSlide}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
        onSlideChange={handleSlideChange}
        onNavigate={handleNavigation}
      />

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomeView; 