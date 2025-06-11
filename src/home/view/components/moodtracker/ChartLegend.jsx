import React from 'react';

// Mood types ordered from worst to best for legend display
const moodTypes = [
  { id: 5, label: 'Sangat Buruk', emoji: '😢', color: 'border-red-500 bg-red-50', chartColor: '#EF4444' },
  { id: 4, label: 'Buruk', emoji: '😔', color: 'border-orange-500 bg-orange-50', chartColor: '#F97316' },
  { id: 3, label: 'Biasa', emoji: '😐', color: 'border-yellow-500 bg-yellow-50', chartColor: '#EAB308' },
  { id: 2, label: 'Baik', emoji: '🙂', color: 'border-emerald-500 bg-emerald-50', chartColor: '#10B981' },
  { id: 1, label: 'Sangat Baik', emoji: '😊', color: 'border-green-500 bg-green-50', chartColor: '#22C55E' }
];

function ChartLegend() {
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      {moodTypes.map((mood) => (
        <div key={mood.id} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: mood.chartColor }}
          ></div>
          <span className="text-xs text-stone-600">{mood.emoji} {mood.label}</span>
        </div>
      ))}
    </div>
  );
}

export default ChartLegend; 