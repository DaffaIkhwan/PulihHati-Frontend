import { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';

function EditPostModal({ 
  isOpen, 
  onClose, 
  post, 
  onSave, 
  loading = false 
}) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setContent(post.content || '');
      setError('');
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    if (content.trim() === post?.content?.trim()) {
      setError('No changes made');
      return;
    }

    try {
      await onSave(post.id || post._id, content.trim());
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update post');
    }
  };

  const handleCancel = () => {
    setContent(post?.content || '');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Edit3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800">Edit Post</h2>
              <p className="text-sm text-stone-500">Make changes to your post</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-2">
              Post Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError('');
              }}
              className="w-full h-32 p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-stone-700 placeholder-stone-400"
              placeholder="What's on your mind?"
              disabled={loading}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-stone-500">
                {content.length}/1000 characters
              </p>
              {content.trim() !== post?.content?.trim() && (
                <p className="text-xs text-amber-600 font-medium">
                  Changes detected
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim() || content.trim() === post?.content?.trim()}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostModal;
