import { useEffect, useRef, useCallback } from 'react';

function InfiniteScroll({ 
  hasMore, 
  loading, 
  onLoadMore, 
  threshold = 100,
  children 
}) {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;

    if (entry.isIntersecting && hasMore && !loading && !loadingRef.current) {
      loadingRef.current = true;
      console.log('🚀 Loading more posts...');

      onLoadMore().finally(() => {
        loadingRef.current = false;
      });
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1
    });

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [handleIntersection, threshold]);

  return (
    <div>
      {children}
      
      {/* Sentinel element for intersection observer */}
      <div 
        ref={sentinelRef} 
        className="h-4 w-full"
        style={{ minHeight: '1px' }}
      />
      
      {/* Loading indicator */}
      {loading && hasMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
            <span className="text-stone-600">Loading more posts...</span>
          </div>
        </div>
      )}
      
      {/* End of posts indicator */}
      {!hasMore && (
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-stone-500 font-medium">You've reached the end!</p>
            <p className="text-stone-400 text-sm mt-1">No more posts to load</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfiniteScroll;
