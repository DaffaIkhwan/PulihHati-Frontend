import { Heart, MessageCircle, Bookmark, Send, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { formatPostDate, formatCommentDate, getPostDate } from '../../../utils/dateUtils';

function PostCard({
  post,
  user,
  bookmarkAnimations,
  inlineComments,
  isReadOnly,
  commentSubmitting,
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

  const isOwner = !isReadOnly && user && post.author && (user.id === post.author.id || user._id === post.author.id);

  const handleActionClick = (action, ...args) => {
    if (isReadOnly) {
      // Redirect to login for read-only users
      window.location.href = '/signin';
      return;
    }
    action(...args);
  };

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
                  {formatPostDate(getPostDate(post))}
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
        <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
          <button
            className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-200 text-sm ${
              isReadOnly
                ? 'text-stone-400 cursor-not-allowed'
                : post.likes?.some(like => like.user === user?.id)
                  ? 'text-red-500 bg-red-50'
                  : 'text-stone-500 hover:bg-stone-100'
            }`}
            onClick={() => handleActionClick(onLike, post._id)}
            title={isReadOnly ? 'Login to like posts' : ''}
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 mr-1 ${!isReadOnly && post.likes?.some(like => like.user === user?.id) ? 'fill-current' : ''}`} />
            <span className="font-medium">
              {post.likes_count || (Array.isArray(post.likes) ? post.likes.length : 0) || 'Like'}
            </span>
          </button>
          <button
            className={`text-stone-500 flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-200 text-sm ${
              isReadOnly ? 'cursor-not-allowed' : 'hover:bg-stone-100'
            }`}
            onClick={() => handleActionClick(onCommentClick, post)}
            title={isReadOnly ? 'Login to comment' : ''}
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            <span className="font-medium">
              {post.comments_count || (Array.isArray(post.comments) ? post.comments.length : 0) || 'Comment'}
            </span>
          </button>
          <button
            className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-200 text-sm ${
              isReadOnly
                ? 'text-stone-400 cursor-not-allowed'
                : post.bookmarked
                  ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                  : 'text-stone-500 hover:bg-stone-100'
            }`}
            onClick={() => handleActionClick(onBookmark, post._id || post.id)}
            title={isReadOnly ? 'Login to save posts' : ''}
          >
            <Bookmark
              className={`h-4 w-4 sm:h-5 sm:w-5 mr-1 ${
                !isReadOnly && post.bookmarked ? 'fill-current text-amber-700' : ''
              } ${!isReadOnly && bookmarkAnimations[post._id || post.id] ? 'animate-bookmark' : ''}`}
            />
            <span className="font-medium">{!isReadOnly && post.bookmarked ? 'Saved' : 'Save'}</span>
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
                        {formatCommentDate(getPostDate(comment))}
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
                  onClick={() => isReadOnly ? null : onCommentClick(post)}
                  title={isReadOnly ? 'Login to view all comments' : ''}
                >
                  View all {post.comments.length} comments
                  {isReadOnly && <span className="text-gray-400 ml-1">(Login required)</span>}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Inline Comment Input */}
        {!isReadOnly ? (
          <div className="mt-4 border-t pt-4">
            <form onSubmit={(e) => onInlineComment(e, post._id || post.id)}>
              <div className="flex items-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Your Profile"
                    className="h-8 w-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full mr-2 bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-xs">
                    {getInitials(user?.name)}
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
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                      commentSubmitting?.[post._id || post.id] || !inlineComments[post._id || post.id]?.trim()
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:text-blue-600'
                    }`}
                    disabled={commentSubmitting?.[post._id || post.id] || !inlineComments[post._id || post.id]?.trim()}
                  >
                    {commentSubmitting?.[post._id || post.id] ? (
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-center py-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500 text-sm mr-2">Ingin berkomentar?</span>
              <button
                onClick={() => window.location.href = '/signin'}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Login di sini
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default PostCard; 