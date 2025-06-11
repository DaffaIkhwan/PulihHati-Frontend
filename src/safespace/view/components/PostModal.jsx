import { X, Heart, MessageCircle, Send, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { formatPostDate, formatCommentDate, getPostDate } from '../../../utils/dateUtils';
import { useState, useRef, useEffect } from 'react';

function PostModal({ post, user, newComment, submittingComment, onClose, onNewComment, onNewCommentChange, onEditComment, onDeleteComment }) {
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [commentDropdowns, setCommentDropdowns] = useState({});
  const dropdownRefs = useRef({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(commentId => {
        if (dropdownRefs.current[commentId] && !dropdownRefs.current[commentId].contains(event.target)) {
          setCommentDropdowns(prev => ({ ...prev, [commentId]: false }));
        }
      });
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

  const handleEditComment = (comment) => {
    setEditingComment(comment.id || comment._id);
    setEditCommentContent(comment.content);
    setCommentDropdowns(prev => ({ ...prev, [comment.id || comment._id]: false }));
  };

  const handleSaveEditComment = async (commentId) => {
    if (!editCommentContent.trim()) return;

    try {
      await onEditComment(commentId, editCommentContent.trim());
      setEditingComment(null);
      setEditCommentContent('');
    } catch (error) {
      console.error('Error saving comment edit:', error);
    }
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentContent('');
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await onDeleteComment(commentId);
        setCommentDropdowns(prev => ({ ...prev, [commentId]: false }));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const toggleCommentDropdown = (commentId) => {
    setCommentDropdowns(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const canEditComment = (comment) => {
    return user && comment.author && (user.id === comment.author.id || user._id === comment.author.id);
  };

  const canDeleteComment = (comment) => {
    // User can delete if they are the comment author OR the post owner
    const isCommentAuthor = user && comment.author && (user.id === comment.author.id || user._id === comment.author.id);
    const isPostOwner = user && post.author && (user.id === post.author.id || user._id === post.author.id);
    return isCommentAuthor || isPostOwner;
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
                  <span>{post.likes_count || (Array.isArray(post.likes) ? post.likes.length : 0) || 0} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments_count || (Array.isArray(post.comments) ? post.comments.length : 0) || 0} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-medium text-black mb-4">
            Comments ({post.comments_count || (Array.isArray(post.comments) ? post.comments.length : 0) || 0})
          </h3>
          {Array.isArray(post.comments) && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map(comment => (
                <div key={comment._id || comment.id} className="flex items-start">
                  {comment.author?.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author?.name}
                      className="h-10 w-10 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full mr-2 bg-amber-100 flex items-center justify-center text-amber-800 font-semibold text-sm">
                      {getInitials(comment.author?.name)}
                    </div>
                  )}
                  <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-black">{comment.author?.name || 'Anonymous'}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatCommentDate(getPostDate(comment))}
                          </span>
                          {comment.updated_at && comment.updated_at !== comment.created_at && (
                            <span className="text-xs text-gray-400 italic">
                              • edited {formatCommentDate(comment.updated_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      {(canEditComment(comment) || canDeleteComment(comment)) && (
                        <div className="relative" ref={el => dropdownRefs.current[comment.id || comment._id] = el}>
                          <button
                            onClick={() => toggleCommentDropdown(comment.id || comment._id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </button>
                          {commentDropdowns[comment.id || comment._id] && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
                              {canEditComment(comment) && (
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Edit3 className="h-3 w-3 mr-2 text-blue-500" />
                                  Edit
                                </button>
                              )}
                              {canDeleteComment(comment) && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id || comment._id)}
                                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {editingComment === (comment.id || comment._id) ? (
                      <div className="mt-2">
                        <textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                          rows="2"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveEditComment(comment.id || comment._id)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                            disabled={!editCommentContent.trim()}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditComment}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-black mt-1">{comment.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            </div>
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
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    submittingComment || !newComment.trim()
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                  disabled={submittingComment || !newComment.trim()}
                >
                  {submittingComment ? (
                    <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
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