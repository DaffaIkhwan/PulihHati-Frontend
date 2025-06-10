import { useState } from 'react';
import { Plus } from 'lucide-react';

function NewPostForm({ user, newPost, onNewPost, onNewPostChange, is_anonymous, onAnonymousChange }) {
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
    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
      <form onSubmit={e => onNewPost(e, is_anonymous)}>
        <div className="flex items-start">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Your Profile"
              className="h-12 w-12 rounded-full mr-3 border-2 border-amber-200"
            />
          ) : (
            <div className="h-12 w-12 rounded-full mr-3 border-2 border-amber-200 bg-amber-100 flex items-center justify-center text-amber-800 font-semibold">
              {getInitials(user.name)}
            </div>
          )}
          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-semibold text-stone-800">{user.name}</h3>
              <p className="text-sm text-stone-500">Share your thoughts with the community</p>
            </div>
            <textarea
              className="w-full border border-stone-300 rounded-xl p-4 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50"
              placeholder="What's on your mind?"
              rows="3"
              value={newPost}
              onChange={(e) => onNewPostChange(e.target.value)}
            ></textarea>
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={is_anonymous}
                  onChange={e => onAnonymousChange(e.target.checked)}
                  className="accent-amber-700"
                />
                Posting sebagai Anonim
              </label>
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full font-medium flex items-center hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg"
                disabled={!newPost.trim()}
              >
                <Plus className="h-5 w-5 mr-1" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewPostForm; 