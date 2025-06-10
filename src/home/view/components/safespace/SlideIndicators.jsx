import React from 'react';

function SlideIndicators({ totalSlides, currentSlide, onSlideChange }) {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
          }`}
        />
      ))}
    </div>
  );
}

export default SlideIndicators; 