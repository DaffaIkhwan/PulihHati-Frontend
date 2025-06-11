import React from 'react';

// Mood types for chart color mapping (ID-based, not display order)
const moodTypes = [
  { id: 1, label: 'Sangat Baik', emoji: '😊', color: 'border-green-500 bg-green-50', chartColor: '#22C55E' },
  { id: 2, label: 'Baik', emoji: '🙂', color: 'border-emerald-500 bg-emerald-50', chartColor: '#10B981' },
  { id: 3, label: 'Biasa', emoji: '😐', color: 'border-yellow-500 bg-yellow-50', chartColor: '#EAB308' },
  { id: 4, label: 'Buruk', emoji: '😔', color: 'border-orange-500 bg-orange-50', chartColor: '#F97316' },
  { id: 5, label: 'Sangat Buruk', emoji: '😢', color: 'border-red-500 bg-red-50', chartColor: '#EF4444' }
];

function MoodChart({ moodHistory }) {
  // Convert mood ID to chart value (lower ID = higher value for better mood)
  const getMoodChartValue = (moodId) => {
    if (!moodId) return 0;
    // Invert the scale: ID 1 (Sangat Baik) = 5, ID 5 (Sangat Buruk) = 1
    return 6 - moodId;
  };

  // Use fixed max value of 5 for consistent scaling
  const maxChartValue = 5; // Since our chart values range from 1-5

  return (
    <div className="border-t border-stone-200 pt-4 sm:pt-6">
      <h4 className="text-base sm:text-lg font-medium text-stone-800 mb-3 sm:mb-4 font-['Inter']">Mood 7 Hari Terakhir</h4>
      <div className="flex items-end justify-between h-24 sm:h-32 lg:h-36 bg-stone-50 rounded-xl p-3 sm:p-4 overflow-x-auto">
        {moodHistory.map((item) => {
          const chartValue = getMoodChartValue(item.mood);
          const maxHeight = window.innerWidth < 640 ? 60 : window.innerWidth < 1024 ? 80 : 100; // Responsive max height

          return (
            <div key={`${item.day}-${item.date}`} className="flex flex-col items-center min-w-0 flex-1">
              <div
                className="w-4 sm:w-6 lg:w-8 rounded-t-lg mb-1 sm:mb-2 transition-all duration-500 ease-in-out"
                style={{
                  height: chartValue > 0 ? `${(chartValue / maxChartValue) * maxHeight}px` : '8px',
                  backgroundColor: item.mood ? moodTypes.find(m => m.id === item.mood)?.chartColor || '#6B7280' : '#E5E7EB',
                  minHeight: '8px',
                  transform: item.hasEntry ? 'scale(1)' : 'scale(0.8)',
                  opacity: item.hasEntry ? 1 : 0.5
                }}
              ></div>
              <div className="text-xs sm:text-xs text-stone-600 font-medium truncate w-full text-center">{item.day}</div>
              <div className="text-sm sm:text-base lg:text-lg mt-0.5 sm:mt-1 transition-all duration-300">
                {item.emoji || '⚪'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MoodChart; 