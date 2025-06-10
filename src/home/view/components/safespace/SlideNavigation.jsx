import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

function SlideNavigation({ onPrevSlide, onNextSlide }) {
  return (
    <>
      <button
        onClick={onPrevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={onNextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </>
  );
}

export default SlideNavigation; 