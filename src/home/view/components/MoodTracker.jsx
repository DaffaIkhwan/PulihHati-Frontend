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
      <div className="bg-gradient-to-r from-[#9bb067] via-[#a8bd74] to-[#9bb067] rounded-2xl shadow-lg border border-stone-200 p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4">
            <Heart className="h-16 w-16 text-stone-600" />
          </div>
          <div className="absolute bottom-4 left-4">
            <Shield className="h-12 w-12 text-stone-600" />
          </div>
        </div>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-stone-700" />
          </div>

          <h3 className="text-2xl font-bold text-stone-800 mb-3">Mood Tracker</h3>
          <p className="text-stone-700 mb-6 text-lg leading-relaxed">
            Lacak suasana hati harianmu dan lihat perkembangan kesehatan mentalmu
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-stone-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-3xl">😢</div>
              <div className="text-3xl">😔</div>
              <div className="text-3xl">😐</div>
              <div className="text-3xl">🙂</div>
              <div className="text-3xl">😊</div>
            </div>
            <p className="text-stone-600 text-sm">
              Pilih mood harianmu dan lihat grafik perkembangan emosi
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/signin'}
            className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Login untuk Mulai Tracking
          </button>

          <p className="text-stone-600 text-sm mt-4">
            Sudah punya akun? <a href="/signin" className="font-semibold hover:underline text-stone-700">Masuk di sini</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-stone-800 mb-1">Mood Tracker</h3>
          <p className="text-stone-600 text-sm">Bagaimana perasaanmu hari ini?</p>
        </div>
        <button
          onClick={onToggleChart}
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
      <MoodSelection 
        selectedMood={selectedMood}
        onMoodSelect={onMoodSelect}
        loading={loading}
      />

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
          <span className="text-lg mr-2">😊</span>
          {success}
        </div>
      )}

      {/* Chart */}
      {showChart && (
        <>
          <MoodChart moodHistory={moodHistory} />
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