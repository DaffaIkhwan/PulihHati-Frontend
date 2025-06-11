import PropTypes from 'prop-types';
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
    <section className="w-full px-2 sm:px-4 py-12 sm:py-16 relative">
      {/* Enhanced Background decorative elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-6 sm:top-12 right-6 sm:right-12 w-16 sm:w-32 h-16 sm:h-32 bg-[#251404]/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 w-14 sm:w-28 h-14 sm:h-28 bg-[#A1BA82]/20 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-10 sm:w-20 h-10 sm:h-20 bg-[#251404]/8 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>


      <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#251404] via-[#4F3422] to-[#251404] rounded-[30px] sm:rounded-[50px] shadow-2xl shadow-[#251404]/30 relative overflow-hidden border border-[#251404]/20">
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#251404]/20 via-transparent to-[#251404]/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A1BA82]/8 to-transparent"></div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-16">

          <div className="bg-white/95 backdrop-blur-lg rounded-[25px] sm:rounded-[40px] shadow-2xl p-6 sm:p-8 lg:p-12 border border-white/50">
            <div className="text-center space-y-6 sm:space-y-10">
              <div>
                <h3 className="text-[#251404] text-xl sm:text-2xl lg:text-3xl font-bold font-['Inter'] leading-tight mb-3 sm:mb-4">
                  Ruang Aman untuk Berbagi
                </h3>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#A1BA82] to-[#251404] rounded-full mx-auto mb-4 sm:mb-6"></div>
                <p className="text-[#251404]/80 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-4 sm:mb-6 font-['Inter'] px-2 sm:px-0">
                  Bergabunglah dengan komunitas yang saling mendukung dan memahami perjalanan kesehatan mental Anda.
                </p>
                <div className="bg-gradient-to-r from-[#A1BA82]/15 to-[#251404]/15 rounded-xl p-3 sm:p-4 max-w-2xl mx-auto border border-[#A1BA82]/20">
                  <p className="text-[#251404]/90 text-sm font-semibold font-['Inter']">
                    ✨ <span className="text-[#A1BA82] font-bold">Akses Terbuka:</span> Lihat postingan populer tanpa perlu login!
                  </p>
                </div>
              </div>

                {/* Popular Posts Section */}
                <div className="py-6">
                  <div className="mb-4">
                  </div>

                  <div className="relative">
                    {/* Post Card */}
                    {popularPosts && popularPosts.length > 0 ? (
                      <PostCard post={popularPosts[currentSlide]} />
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-gradient-to-br from-[#A1BA82]/10 to-[#251404]/5 rounded-xl p-6 border border-[#251404]/10">
                          <div className="text-3xl mb-3">📝</div>
                          <h5 className="text-[#251404] text-base font-bold mb-1">Memuat Post Populer...</h5>
                          <p className="text-[#251404]/70 text-xs font-medium">
                            Sedang mengambil cerita inspiratif dari komunitas
                          </p>
                          {/* Debug info */}
                          {import.meta.env.DEV && (
                            <div className="mt-4 p-2 bg-yellow-100 rounded text-xs text-left">
                              <strong>Debug:</strong><br/>
                              popularPosts: {JSON.stringify(popularPosts)}<br/>
                              length: {popularPosts?.length}<br/>
                              type: {typeof popularPosts}
                            </div>
                          )}
                        </div>
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
                className="bg-gradient-to-r from-[#A1BA82] to-[#A1BA82]/80 hover:from-[#A1BA82]/80 hover:to-[#A1BA82] text-white px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 font-bold text-lg font-['Inter'] shadow-xl inline-flex items-center gap-3"
              >
                <span>Bergabung Sekarang</span>
                <div className="w-6 h-6 relative">
                  <div className="absolute top-1/2 left-1 w-4 h-0.5 bg-white rounded transform -translate-y-1/2 transition-transform group-hover:translate-x-1"></div>
                  <div className="absolute top-1/2 right-1 w-3 h-3 border-r-2 border-t-2 border-white transform rotate-45 -translate-y-1/2 transition-transform group-hover:rotate-90"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

SafeSpaceSection.propTypes = {
  popularPosts: PropTypes.array.isRequired,
  currentSlide: PropTypes.number.isRequired,
  onPrevSlide: PropTypes.func.isRequired,
  onNextSlide: PropTypes.func.isRequired,
  onSlideChange: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default SafeSpaceSection;