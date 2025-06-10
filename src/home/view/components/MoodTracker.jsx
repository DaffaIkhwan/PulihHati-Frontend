import React from 'react';
import { TrendingUp } from "lucide-react";
import MoodSelection from './moodtracker/MoodSelection';
import MoodChart from './moodtracker/MoodChart';
import ChartLegend from './moodtracker/ChartLegend';

const moodTypes = [
  { id: 1, label: 'Sangat Baik', emoji: '😊', color: 'border-green-500 bg-green-50', chartColor: '#22C55E' },
  { id: 2, label: 'Baik', emoji: '🙂', color: 'border-emerald-500 bg-emerald-50', chartColor: '#10B981' },
  { id: 3, label: 'Biasa', emoji: '😐', color: 'border-yellow-500 bg-yellow-50', chartColor: '#EAB308' },
  { id: 4, label: 'Buruk', emoji: '😔', color: 'border-orange-500 bg-orange-50', chartColor: '#F97316' },
  { id: 5, label: 'Sangat Buruk', emoji: '😢', color: 'border-red-500 bg-red-50', chartColor: '#EF4444' }
];

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

export default MoodTracker; 