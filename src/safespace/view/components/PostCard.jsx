import { Heart, MessageCircle, Bookmark, Send, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function PostCard({
  post,
  user,
  bookmarkAnimations,
  inlineComments,
  onLike,
  onBookmark,
  onCommentClick,
  onInlineComment,
  onInlineCommentChange,
  getRecentComments,
  onEdit,
  onDelete
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isOwner = user && post.author && (user.id === post.author.id || user._id === post.author.id);

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit && onEdit(post);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    onDelete && onDelete(post);
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg border border-stone-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="flex items-center">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.is_anonymous ? 'Anonim' : post.author.name}
                  className="h-10 w-10 rounded-full mr-3 border-2 border-amber-200"
                />
              ) : (
                <div className="h-10 w-10 rounded-full mr-3 border-2 border-amber-200 bg-amber-100 flex items-center justify-center text-amber-800 font-semibold">
                  {post.is_anonymous ? 'A' : getInitials(post.author.name)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-stone-800">
                  {post.is_anonymous ? 'Anonim' : post.author.name}
                </h3>
                <p className="text-sm text-stone-500">
                  {new Date(post.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
          {isOwner && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <MoreHorizontal className="h-5 w-5 text-stone-500" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-2 text-blue-500" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-stone-700 leading-relaxed">{post.content}</p>
        </div>
        <div className="mt-5 flex space-x-3">
          <button
            className={`flex items-center px-3 py-2 rounded-full transition-all duration-200 ${post.likes?.some(like => like.user === user.id) ? 'text-red-500 bg-red-50' : 'text-stone-500 hover:bg-stone-100'}`}
            onClick={() => onLike(post._id)}
          >
            <Heart className={`h-5 w-5 mr-1 ${post.likes?.some(like => like.user === user.id) ? 'fill-current' : ''}`} />
            <span className="font-medium">
              {Array.isArray(post.likes)
                ? post.likes.length > 0
                  ? post.likes.length
                  : 'Like'
                : 'Like'}
            </span>
          </button>
          <button
            className="text-stone-500 flex items-center hover:bg-stone-100 px-3 py-2 rounded-full transition-all duration-200"
            onClick={() => onCommentClick(post)}
          >
            <MessageCircle className="h-5 w-5 mr-1" />
            <span className="font-medium">
              {Array.isArray(post.comments)
                ? post.comments.length > 0
                  ? post.comments.length
                  : 'Comment'
                : 'Comment'}
            </span>
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-full transition-all duration-200 ${
              post.bookmarked
                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
            onClick={() => onBookmark(post._id || post.id)}
          >
            <Bookmark
              className={`h-5 w-5 mr-1 ${
                post.bookmarked ? 'fill-current text-amber-700' : ''
              } ${bookmarkAnimations[post._id || post.id] ? 'animate-bookmark' : ''}`}
            />
            <span className="font-medium">{post.bookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Recent Comments Section */}
        {Array.isArray(post.comments) && post.comments.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="space-y-3">
              {getRecentComments(post.comments).map(comment => (
                <div key={comment._id} className="flex items-start">
                  {comment.author?.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full mr-2 bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-xs">
                      {getInitials(comment.author?.name)}
                    </div>
                  )}
                  <div className="flex-1 bg-gray-50 p-2 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-black text-sm">{comment.author?.name}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-black mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}

              {/* View all comments link if there are more than 1 */}
              {post.comments.length > 1 && (
                <button
                  className="text-blue-600 text-sm hover:text-blue-800 font-medium"
                  onClick={() => onCommentClick(post)}
                >
                  View all {post.comments.length} comments
                </button>
              )}
            </div>
          </div>
        )}

        {/* Inline Comment Input */}
        <div className="mt-4 border-t pt-4">
          <form onSubmit={(e) => onInlineComment(e, post._id || post.id)}>
            <div className="flex items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Your Profile"
                  className="h-8 w-8 rounded-full mr-2"
                />
              ) : (
                <div className="h-8 w-8 rounded-full mr-2 bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-xs">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-gray-50 rounded-full px-4 py-2 text-gray-700 w-full text-sm"
                  placeholder="Write a comment..."
                  value={inlineComments[post._id || post.id] || ''}
                  onChange={(e) => onInlineCommentChange(post._id || post.id, e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  disabled={!inlineComments[post._id || post.id]?.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </article>
  );
}

export default PostCard; 