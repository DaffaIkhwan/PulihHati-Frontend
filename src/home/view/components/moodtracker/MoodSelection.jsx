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
    <div className="grid grid-cols-5 gap-3 mb-6">
      {moodTypes.map((mood) => (
        <button
          key={mood.id}
          onClick={() => handleMoodClick(mood.id)}
          disabled={loading}
          title={isReadOnly ? 'Login untuk melacak mood' : ''}
          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
            isReadOnly
              ? 'opacity-60 cursor-not-allowed border-gray-300 bg-gray-50 hover:bg-gray-100'
              : selectedMood === mood.id
                ? 'border-amber-500 bg-amber-50 shadow-lg'
                : mood.color + ' hover:shadow-md'
          }`}
        >
          <div className="text-2xl mb-2">{mood.emoji}</div>
          <div className="text-xs font-medium">{mood.label}</div>
          {isReadOnly && (
            <div className="text-xs text-gray-500 mt-1">🔒</div>
          )}
        </button>
      ))}
    </div>
  );
}

export default MoodSelection; 