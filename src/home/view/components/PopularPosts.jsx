import { ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import { formatCardDate, getPostDate } from '../../utils/dateUtils';

function PopularPosts({ posts = [], currentSlide = 0, onPrevSlide, onNextSlide, onSlideChange }) {
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-white py-8">
        <p className="text-lg">Belum ada post populer</p>
        <p className="text-sm opacity-80">Mulai berbagi cerita untuk melihat post terpopuler</p>
      </div>
    );
  }

  const currentPost = posts[currentSlide];

  return (
    <div className="relative">
      {/* Post Card */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl shadow-lg border border-stone-200 p-4 min-h-[160px] transition-all duration-500 transform">
        <div className="flex items-start mb-3">
          {currentPost.author?.avatar ? (
            <img
              src={currentPost.author.avatar}
              alt={currentPost.author?.name}
              className="h-8 w-8 rounded-full mr-2 border-2 border-amber-300"
            />
          ) : (
            <div className="h-8 w-8 rounded-full mr-2 border-2 border-amber-300 bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-semibold">
              {getInitials(currentPost.author?.name)}
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-stone-800 text-sm">{currentPost.author?.name || 'Anonymous'}</h4>
            <p className="text-xs text-stone-500">
              {formatCardDate(getPostDate(currentPost))}
            </p>
          </div>
        </div>

        <p className="text-stone-700 text-sm leading-relaxed mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {currentPost.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-red-500">
              <Heart className="h-4 w-4 mr-1 fill-current" />
              <span className="text-sm font-medium">{currentPost.likes?.length || 0}</span>
            </div>
            <div className="flex items-center text-stone-500">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{currentPost.comments?.length || 0}</span>
            </div>
          </div>

          <div className="text-xs text-amber-700 font-medium bg-amber-100 px-2 py-1 rounded-full">
            #Trending
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {posts.length > 1 && (
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
      )}

      {/* Slide Indicators */}
      {posts.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => onSlideChange(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PopularPosts; 