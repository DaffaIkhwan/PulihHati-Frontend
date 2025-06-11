import PropTypes from 'prop-types';
import { TrendingUp, Lock, Heart, Shield } from "lucide-react";
import MoodSelection from './moodtracker/MoodSelection';
import MoodChart from './moodtracker/MoodChart';
import ChartLegend from './moodtracker/ChartLegend';

function MoodTracker({
  moodHistory,
  selectedMood,
  showChart,
  loading,
  error,
  success,
  onMoodSelect,
  onToggleChart
}) {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token && token !== 'null' && token !== 'undefined';
  };

  const authenticated = isAuthenticated();
  // If not authenticated, show locked state
  if (!authenticated) {
    return (
      <div className="bg-gradient-to-r from-[#9bb067] via-[#a8bd74] to-[#9bb067] rounded-2xl shadow-lg border border-stone-200 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
            <Heart className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-stone-600" />
          </div>
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-stone-600" />
          </div>
        </div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-stone-700" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-2 sm:mb-3 font-['Inter']">Mood Tracker</h3>
          <p className="text-stone-700 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed px-2">
            Lacak suasana hati harianmu dan lihat perkembangan kesehatan mentalmu
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-stone-200">
            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <div className="text-xl sm:text-2xl lg:text-3xl">😢</div>
              <div className="text-xl sm:text-2xl lg:text-3xl">😔</div>
              <div className="text-xl sm:text-2xl lg:text-3xl">😐</div>
              <div className="text-xl sm:text-2xl lg:text-3xl">🙂</div>
              <div className="text-xl sm:text-2xl lg:text-3xl">😊</div>
            </div>
            <p className="text-stone-600 text-xs sm:text-sm">
              Pilih mood harianmu dan lihat grafik perkembangan emosi
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/signin'}
            className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
          >
            Login untuk Mulai Tracking
          </button>

          <p className="text-stone-600 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
            Sudah punya akun? <a href="/signin" className="font-semibold hover:underline text-stone-700">Masuk di sini</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-[#251404] mb-2 font-['Inter']">Mood Tracker</h3>
          <p className="text-[#251404]/70 text-sm sm:text-base font-medium">Bagaimana perasaanmu hari ini?</p>
        </div>
        <button
          onClick={onToggleChart}
          className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#A1BA82] to-[#A1BA82]/80 hover:from-[#A1BA82]/80 hover:to-[#A1BA82] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
        >
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-semibold">{showChart ? 'Sembunyikan' : 'Lihat'} Grafik</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-3 sm:mb-4 text-center text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Mood Selection */}
      <MoodSelection
        selectedMood={selectedMood}
        onMoodSelect={onMoodSelect}
        loading={loading}
      />

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-3 sm:mb-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm sm:text-base">Menyimpan mood...</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-3 sm:mb-4 text-center">
          <span className="text-base sm:text-lg mr-2">😊</span>
          <span className="text-sm sm:text-base">{success}</span>
        </div>
      )}

      {/* Chart */}
      {showChart && (
        <>
          <MoodChart
            key={`mood-chart-${moodHistory.length}-${moodHistory.filter(h => h.hasEntry).length}`}
            moodHistory={moodHistory}
          />
          <ChartLegend />
        </>
      )}
    </div>
  );
}

MoodTracker.propTypes = {
  moodHistory: PropTypes.array.isRequired,
  selectedMood: PropTypes.number,
  showChart: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
  onMoodSelect: PropTypes.func.isRequired,
  onToggleChart: PropTypes.func.isRequired
};

export default MoodTracker;