import React from 'react';

const moodTypes = [
  { id: 1, label: 'Sangat Baik', emoji: '😊', color: 'border-green-500 bg-green-50', chartColor: '#22C55E' },
  { id: 2, label: 'Baik', emoji: '🙂', color: 'border-emerald-500 bg-emerald-50', chartColor: '#10B981' },
  { id: 3, label: 'Biasa', emoji: '😐', color: 'border-yellow-500 bg-yellow-50', chartColor: '#EAB308' },
  { id: 4, label: 'Buruk', emoji: '😔', color: 'border-orange-500 bg-orange-50', chartColor: '#F97316' },
  { id: 5, label: 'Sangat Buruk', emoji: '😢', color: 'border-red-500 bg-red-50', chartColor: '#EF4444' }
];

function MoodChart({ moodHistory }) {
  return (
    <div className="border-t border-stone-200 pt-6">
      <h4 className="text-lg font-medium text-stone-800 mb-4">Mood 7 Hari Terakhir</h4>
      <div className="flex items-end justify-between h-32 bg-stone-50 rounded-xl p-4">
        {moodHistory.map((item) => (
          <div key={`${item.day}-${item.date}`} className="flex flex-col items-center">
            <div
              className="w-8 rounded-t-lg mb-2 transition-all duration-500 ease-in-out"
              style={{
                height: item.mood ? `${(item.mood / Math.max(...moodHistory.map(i => i.mood || 0))) * 80}px` : '10px',
                backgroundColor: item.mood ? moodTypes.find(m => m.id === item.mood)?.chartColor || '#6B7280' : '#E5E7EB',
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
    </div>
  );
}

export default MoodChart; 