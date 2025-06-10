import { Trash2, AlertTriangle, X } from 'lucide-react';

function DeletePostModal({ 
  isOpen, 
  onClose, 
  post, 
  onConfirm, 
  loading = false 
}) {
  const handleDelete = async () => {
    try {
      await onConfirm(post);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800">Delete Post</h2>
              <p className="text-sm text-stone-500">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start">
              <div className="p-3 bg-red-50 rounded-lg mr-4 flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-stone-800 mb-2">
                  Are you sure you want to delete this post?
                </h3>
                <p className="text-stone-600 text-sm mb-4">
                  This will permanently delete your post and all its comments and likes. 
                  This action cannot be undone.
                </p>
                
                {/* Post Preview */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <p className="text-sm text-stone-700 line-clamp-3">
                    {post?.content}
                  </p>
                  <div className="flex items-center mt-3 text-xs text-stone-500">
                    <span>
                      {post?.likes?.length || 0} likes • {post?.comments?.length || 0} comments
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePostModal;
