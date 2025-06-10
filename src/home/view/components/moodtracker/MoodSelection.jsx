import React from 'react';

const moodTypes = [
  { id: 1, label: 'Sangat Baik', emoji: '😊', color: 'border-green-500 bg-green-50', chartColor: '#22C55E' },
  { id: 2, label: 'Baik', emoji: '🙂', color: 'border-emerald-500 bg-emerald-50', chartColor: '#10B981' },
  { id: 3, label: 'Biasa', emoji: '😐', color: 'border-yellow-500 bg-yellow-50', chartColor: '#EAB308' },
  { id: 4, label: 'Buruk', emoji: '😔', color: 'border-orange-500 bg-orange-50', chartColor: '#F97316' },
  { id: 5, label: 'Sangat Buruk', emoji: '😢', color: 'border-red-500 bg-red-50', chartColor: '#EF4444' }
];

function MoodSelection({ selectedMood, onMoodSelect, loading }) {
  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      {moodTypes.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood.id)}
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
  );
}

export default MoodSelection; 