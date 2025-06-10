import React from 'react';
import PostCard from './safespace/PostCard';
import SlideNavigation from './safespace/SlideNavigation';
import SlideIndicators from './safespace/SlideIndicators';

function SafeSpaceSection({ 
  popularPosts, 
  currentSlide, 
  onPrevSlide, 
  onNextSlide, 
  onSlideChange,
  onNavigate 
}) {
  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-700 via-amber-700 to-amber-800 rounded-[40px] shadow-2xl shadow-amber-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>

        <div className="relative z-10 p-8 lg:p-12">
          <h2 className="text-white text-3xl lg:text-4xl font-bold font-['Sora'] text-center mb-8">
            Safe Space
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[30px] shadow-xl p-6 lg:p-8 backdrop-blur-sm border border-white/20">
              <div className="text-center space-y-8">
                <h3 className="text-stone-800 text-xl lg:text-2xl font-semibold font-['Sora'] leading-relaxed">
                  Ruang Aman untuk Berbagi
                </h3>
                <p className="text-stone-600 text-base leading-relaxed">
                  Bergabunglah dengan komunitas yang saling mendukung dan memahami perjalanan kesehatan mental Anda.
                </p>

                {/* Popular Posts Section */}
                <div className="py-6">
                  <div className="relative">
                    {/* Post Card */}
                    {popularPosts.length > 0 ? (
                      <PostCard post={popularPosts[currentSlide]} />
                    ) : (
                      <div className="text-center text-white py-8">
                        <p className="text-lg">Belum ada post populer</p>
                        <p className="text-sm opacity-80">Mulai berbagi cerita untuk melihat post terpopuler</p>
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {popularPosts.length > 1 && (
                      <SlideNavigation 
                        onPrevSlide={onPrevSlide}
                        onNextSlide={onNextSlide}
                      />
                    )}

                    {/* Slide Indicators */}
                    {popularPosts.length > 1 && (
                      <SlideIndicators 
                        totalSlides={popularPosts.length}
                        currentSlide={currentSlide}
                        onSlideChange={onSlideChange}
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('/safespace')}
                  className="bg-gradient-to-r from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 text-stone-800 px-8 py-4 rounded-full border-2 border-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 font-semibold font-['Sora']"
                >
                  Bergabung Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SafeSpaceSection; 