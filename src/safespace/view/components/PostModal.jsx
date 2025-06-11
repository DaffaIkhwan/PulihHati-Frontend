import { X, Heart, MessageCircle, Send } from 'lucide-react';
import { formatPostDate, formatCommentDate, getPostDate } from '../../../utils/dateUtils';

function PostModal({ post, user, newComment, onClose, onNewComment, onNewCommentChange }) {
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-black">Post Details</h2>
            <p className="text-sm text-gray-500">Full post content and comments</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Post Content Section */}
        <div className="p-4 border-b bg-stone-50">
          <div className="flex items-start">
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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-stone-800">
                  {post.is_anonymous ? 'Anonim' : post.author.name}
                </h3>
                <span className="text-xs text-stone-500">•</span>
                <p className="text-xs text-stone-500">
                  {formatPostDate(getPostDate(post))}
                </p>
              </div>
              <div className="mt-3 bg-white p-4 rounded-lg border border-stone-200">
                <p className="text-stone-800 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Stats */}
              <div className="flex items-center gap-4 mt-3 text-sm text-stone-500">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes?.length || 0} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments?.length || 0} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-medium text-black mb-4">Comments</h3>
          {Array.isArray(post.comments) && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map(comment => (
                <div key={comment._id} className="flex items-start">
                  {comment.author?.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author?.name}
                      className="h-10 w-10 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full mr-2 bg-amber-100 flex items-center justify-center text-amber-800 font-semibold">
                      {getInitials(comment.author?.name)}
                    </div>
                  )}
                  <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-black">{comment.author?.name}</h4>
                      <span className="text-xs text-gray-500">
                        {formatCommentDate(getPostDate(comment))}
                      </span>
                    </div>
                    <p className="text-sm text-black mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t">
          <form onSubmit={onNewComment}>
            <div className="flex items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Your Profile"
                  className="h-10 w-10 rounded-full mr-2"
                />
              ) : (
                <div className="h-10 w-10 rounded-full mr-2 bg-amber-100 flex items-center justify-center text-amber-800 font-semibold">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-gray-100 rounded-full px-4 py-2 text-gray-700 w-full"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => onNewCommentChange(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  disabled={!newComment.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostModal; 