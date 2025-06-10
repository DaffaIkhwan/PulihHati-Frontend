import { useState } from 'react';
import { Plus, Heart, MessageCircle, Bookmark, Send } from 'lucide-react';
import PostCard from './PostCard';
import NewPostForm from './NewPostForm';

function HomeTab({
  activeTab,
  posts,
  loading,
  newPost,
  user,
  bookmarkAnimations,
  inlineComments,
  onNewPost,
  onNewPostChange,
  onLike,
  onBookmark,
  onCommentClick,
  onInlineComment,
  onInlineCommentChange,
  getRecentComments,
  onEdit,
  onDelete
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
      {/* New Post Form (only on home tab) */}
      {activeTab === 'home' && (
        <NewPostForm
          user={user}
          newPost={newPost}
          onNewPost={handleNewPost}
          onNewPostChange={onNewPostChange}
          is_anonymous={is_anonymous}
          onAnonymousChange={handleAnonymousChange}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-2 text-stone-500">Loading posts...</p>
        </div>
      )}

      {/* Posts */}
      {!loading && posts.length > 0 ? (
        posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            bookmarkAnimations={bookmarkAnimations}
            inlineComments={inlineComments}
            onLike={onLike}
            onBookmark={onBookmark}
            onCommentClick={onCommentClick}
            onInlineComment={onInlineComment}
            onInlineCommentChange={onInlineCommentChange}
            getRecentComments={getRecentComments}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
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
                <p className="text-gray-500">Be the first to share something!</p>
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default HomeTab; 