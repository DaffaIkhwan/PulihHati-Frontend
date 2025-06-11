import { useEffect, useRef, useCallback, useState } from 'react';

function InfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 100,
  children
}) {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const retryCountRef = useRef(0);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  // Detect if we're on mobile for better threshold
  const isMobile = window.innerWidth <= 768;
  const mobileThreshold = isMobile ? 300 : threshold; // Larger threshold for mobile

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;

    if (entry.isIntersecting && hasMore && !loading && !loadingRef.current && !retrying) {
      loadingRef.current = true;
      setError(null);
      console.log('🚀 Loading more posts... (Mobile:', isMobile, 'Threshold:', mobileThreshold, ')');

      onLoadMore()
        .then(() => {
          retryCountRef.current = 0; // Reset retry count on success
        })
        .catch((err) => {
          console.error('Error loading more posts:', err);
          setError(err.message || 'Failed to load more posts');
          retryCountRef.current += 1;
        })
        .finally(() => {
          loadingRef.current = false;
        });
    }
  }, [hasMore, loading, onLoadMore, isMobile, mobileThreshold, retrying]);

  // Retry function for failed loads
  const handleRetry = useCallback(async () => {
    if (retryCountRef.current >= 3) {
      setError('Maximum retry attempts reached. Please refresh the page.');
      return;
    }

    setRetrying(true);
    setError(null);

    try {
      await onLoadMore();
      retryCountRef.current = 0;
    } catch (err) {
      console.error('Retry failed:', err);
      setError(err.message || 'Failed to load more posts');
      retryCountRef.current += 1;
    } finally {
      setRetrying(false);
    }
  }, [onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Enhanced observer options for better mobile detection
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: `${mobileThreshold}px`,
      threshold: isMobile ? 0.01 : 0.1 // Lower threshold for mobile for better detection
    });

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [handleIntersection, mobileThreshold, isMobile]);

  return (
    <div>
      {children}

      {/* Sentinel element for intersection observer - Enhanced for mobile */}
      <div
        ref={sentinelRef}
        className={`w-full ${isMobile ? 'h-8' : 'h-4'}`}
        style={{ minHeight: isMobile ? '32px' : '16px' }}
      />

      {/* Loading indicator */}
      {(loading || retrying) && hasMore && !error && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
            <span className="text-stone-600">
              {retrying ? 'Retrying...' : 'Loading more posts...'}
            </span>
          </div>
        </div>
      )}

      {/* Error indicator with retry button */}
      {error && hasMore && (
        <div className="flex flex-col justify-center items-center py-8">
          <div className="text-center max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">Failed to load more posts</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={handleRetry}
              disabled={retrying || retryCountRef.current >= 3}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                retrying || retryCountRef.current >= 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {retrying ? 'Retrying...' : retryCountRef.current >= 3 ? 'Max retries reached' : 'Try Again'}
            </button>
            {retryCountRef.current > 0 && retryCountRef.current < 3 && (
              <p className="text-gray-500 text-xs mt-2">
                Attempt {retryCountRef.current + 1} of 3
              </p>
            )}
          </div>
        </div>
      )}

      {/* End of posts indicator */}
      {!hasMore && !error && (
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
