import PropTypes from 'prop-types';
import { useState } from 'react';
import { Plus, MessageCircle, Bookmark } from 'lucide-react';
import PostCard from './PostCard';
import NewPostForm from './NewPostForm';
import InfiniteScroll from './InfiniteScroll';

function HomeTab({
  activeTab,
  posts,
  loading,
  newPost,
  user,
  bookmarkAnimations,
  inlineComments,
  isReadOnly,
  hasMorePosts,
  loadingMore,
  onNewPost,
  onNewPostChange,
  onLike,
  onBookmark,
  onCommentClick,
  onInlineComment,
  onInlineCommentChange,
  getRecentComments,
  onEdit,
  onDelete,
  onLoadMore
}) {
  const [is_anonymous, setIsAnonymous] = useState(false);

  const handleAnonymousChange = (checked) => {
    setIsAnonymous(!!checked);
  };

  const handleNewPost = (e, isAnon) => {
    onNewPost(e, !!isAnon);
  };

  return (
    <div className="space-y-6">
      {/* New Post Form (only on home tab and when authenticated) */}
      {activeTab === 'home' && !isReadOnly && (
        <NewPostForm
          user={user}
          newPost={newPost}
          onNewPost={handleNewPost}
          onNewPostChange={onNewPostChange}
          is_anonymous={is_anonymous}
          onAnonymousChange={handleAnonymousChange}
        />
      )}

      {/* Read-only login prompt for posting */}
      {activeTab === 'home' && isReadOnly && (
        <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ingin berbagi cerita?</h3>
            <p className="text-gray-500 mb-4">Login untuk membuat post dan berinteraksi dengan komunitas</p>
            <button
              onClick={() => window.location.href = '/signin'}
              className="bg-[#251404] hover:bg-[#4F3422] text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Login untuk Posting
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-2 text-stone-500">Loading posts...</p>
        </div>
      )}

      {/* Posts with Infinite Scroll */}
      {!loading && posts.length > 0 ? (
        <InfiniteScroll
          hasMore={hasMorePosts}
          loading={loadingMore}
          onLoadMore={onLoadMore}
          threshold={200}
        >
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                bookmarkAnimations={bookmarkAnimations}
                inlineComments={inlineComments}
                isReadOnly={isReadOnly}
                onLike={onLike}
                onBookmark={onBookmark}
                onCommentClick={onCommentClick}
                onInlineComment={onInlineComment}
                onInlineCommentChange={onInlineCommentChange}
                getRecentComments={getRecentComments}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            {activeTab === 'saved' ? (
              <>
                <Bookmark className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No saved posts yet</h3>
                <p className="text-gray-500">Items you save will appear here</p>
              </>
            ) : (
              <>
                <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No posts yet</h3>
                <p className="text-gray-500">
                  {isReadOnly
                    ? 'Be the first to share your thoughts! Login to create a post.'
                    : 'Be the first to share something!'
                  }
                </p>
                {isReadOnly && (
                  <button
                    onClick={() => window.location.href = '/signin'}
                    className="mt-4 bg-[#251404] text-white px-6 py-2 rounded-lg hover:bg-[#4F3422] transition-colors"
                  >
                    Login to Post
                  </button>
                )}
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}

HomeTab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  newPost: PropTypes.string.isRequired,
  user: PropTypes.object,
  bookmarkAnimations: PropTypes.object.isRequired,
  inlineComments: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  hasMorePosts: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  onNewPost: PropTypes.func.isRequired,
  onNewPostChange: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  onCommentClick: PropTypes.func.isRequired,
  onInlineComment: PropTypes.func.isRequired,
  onInlineCommentChange: PropTypes.func.isRequired,
  getRecentComments: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired
};

export default HomeTab;