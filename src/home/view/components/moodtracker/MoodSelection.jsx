import React from 'react';

// Mood types ordered from worst to best (left to right in UI)
const moodTypes = [
  { id: 5, label: 'Sangat Buruk', emoji: '😢', color: 'border-red-500 bg-red-50', chartColor: '#EF4444' },
  { id: 4, label: 'Buruk', emoji: '😔', color: 'border-orange-500 bg-orange-50', chartColor: '#F97316' },
  { id: 3, label: 'Biasa', emoji: '😐', color: 'border-yellow-500 bg-yellow-50', chartColor: '#EAB308' },
  { id: 2, label: 'Baik', emoji: '🙂', color: 'border-emerald-500 bg-emerald-50', chartColor: '#10B981' },
  { id: 1, label: 'Sangat Baik', emoji: '😊', color: 'border-green-500 bg-green-50', chartColor: '#22C55E' }
];

function MoodSelection({ selectedMood, onMoodSelect, loading, isReadOnly = false }) {
  const handleMoodClick = (moodId) => {
    if (isReadOnly) {
      // Redirect to login if in read-only mode
      window.location.href = '/signin';
      return;
    }
    onMoodSelect(moodId);
  };

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
      {moodTypes.map((mood) => (
        <button
          key={mood.id}
          onClick={() => handleMoodClick(mood.id)}
          disabled={loading}
          title={isReadOnly ? 'Login untuk melacak mood' : ''}
          className={`p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 ${
            isReadOnly
              ? 'opacity-60 cursor-not-allowed border-gray-300 bg-gray-50 hover:bg-gray-100'
              : selectedMood === mood.id
                ? 'border-[#251404] bg-gradient-to-br from-[#A1BA82]/20 to-[#A1BA82]/10 shadow-xl scale-105 ring-2 sm:ring-4 ring-[#A1BA82]/30'
                : mood.color + ' hover:shadow-xl hover:border-opacity-80'
          }`}
        >
          <div className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 transition-transform duration-300 hover:scale-110">{mood.emoji}</div>
          <div className="text-xs sm:text-sm font-semibold text-[#251404] leading-tight">{mood.label}</div>
          {isReadOnly && (
            <div className="text-xs text-gray-500 mt-1 sm:mt-2">🔒</div>
          )}
          {selectedMood === mood.id && !isReadOnly && (
            <div className="mt-1 sm:mt-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#A1BA82] rounded-full mx-auto animate-pulse"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

export default MoodSelection; 