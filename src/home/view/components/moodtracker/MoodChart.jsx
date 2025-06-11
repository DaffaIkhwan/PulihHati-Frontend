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
  // Debug: Log mood history to verify updates
  console.log('📊 MoodChart received data:', moodHistory?.map(item =>
    `${item.day}(${item.date?.split('-')[2]}): mood=${item.mood}, hasEntry=${item.hasEntry}`
  ));

  // Convert mood ID to chart value with very dramatic differences
  const getMoodChartValue = (moodId) => {
    if (!moodId) return 0;
    // More dramatic scaling for extremely clear visual distinction
    switch(moodId) {
      case 1: return 100; // Sangat Baik - 100% height (full)
      case 2: return 65;  // Baik - 65% height (much more different from Sangat Baik)
      case 3: return 40;  // Biasa - 40% height (middle)
      case 4: return 20;  // Buruk - 20% height (low)
      case 5: return 8;   // Sangat Buruk - 8% height (very low)
      default: return 0;
    }
  };

  // Use fixed max value of 100 for percentage-based scaling
  const maxChartValue = 100;

  return (
    <div className="border-t border-stone-200 pt-4 sm:pt-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h4 className="text-base sm:text-lg font-medium text-stone-800 font-['Inter']">Mood 7 Hari Terakhir</h4>
        <div className="text-xs text-stone-500 flex items-center gap-1">
          <span>Hari ini</span>
          <div className="w-2 h-2 bg-[#A1BA82] rounded-full"></div>
          <span>→</span>
        </div>
      </div>
      <div className="flex items-end justify-between h-40 sm:h-52 lg:h-64 bg-stone-50 rounded-xl p-3 sm:p-4 overflow-x-auto">
        {moodHistory.map((item, index) => {
          const chartValue = getMoodChartValue(item.mood);
          // Further increased max height for much better visual distinction
          const maxHeight = window.innerWidth < 640 ? 100 : window.innerWidth < 1024 ? 150 : 180; // Much higher for clearer differences

          // More accurate today detection
          const today = new Date();
          const indonesiaTime = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
          const todayStr = `${indonesiaTime.getFullYear()}-${String(indonesiaTime.getMonth() + 1).padStart(2, '0')}-${String(indonesiaTime.getDate()).padStart(2, '0')}`;
          const isToday = item.date === todayStr;

          return (
            <div key={`${item.date}-${item.mood}-${item.hasEntry}`} className={`flex flex-col items-center min-w-0 flex-1 relative ${isToday ? 'ring-2 ring-[#A1BA82] ring-opacity-50 rounded-lg p-1' : ''}`}>
              {/* Today indicator */}
              {isToday && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-[#A1BA82] rounded-full animate-pulse"></div>
                </div>
              )}

              <div
                className={`w-4 sm:w-6 lg:w-8 rounded-t-lg mb-1 sm:mb-2 transition-all duration-500 ease-in-out ${isToday ? 'shadow-lg' : ''}`}
                style={{
                  // Calculate height based on mood level - no minimum to allow clear differences
                  height: item.hasEntry
                    ? `${(chartValue / maxChartValue) * maxHeight}px` // Direct percentage calculation
                    : `${maxHeight * 0.12}px`, // 12% height for empty days
                  backgroundColor: item.mood
                    ? moodTypes.find(m => m.id === item.mood)?.chartColor || '#6B7280'
                    : '#D1D5DB', // Light gray for empty days
                  // No minHeight to allow true proportional scaling
                  transform: item.hasEntry ? 'scale(1)' : 'scale(0.9)', // Less dramatic scale difference
                  opacity: item.hasEntry ? 1 : 0.7, // Less dramatic opacity difference
                  border: isToday ? '2px solid #A1BA82' : item.hasEntry ? 'none' : '1px dashed #9CA3AF', // Dashed border for empty days
                  borderRadius: item.hasEntry ? '4px 4px 0 0' : '4px' // Different border radius for empty days
                }}
              ></div>
              <div className={`text-xs sm:text-xs font-medium w-full text-center ${isToday ? 'text-[#A1BA82] font-bold' : 'text-stone-600'}`}>
                <div className="truncate">{item.day}</div>
                {isToday && (
                  <div className="text-[9px] sm:text-[10px] text-[#A1BA82] font-semibold mt-0.5 leading-tight">
                    Hari Ini
                  </div>
                )}
              </div>
              <div className="text-sm sm:text-base lg:text-lg mt-0.5 sm:mt-1 transition-all duration-300">
                {item.hasEntry ? item.emoji : '📊'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MoodChart; 