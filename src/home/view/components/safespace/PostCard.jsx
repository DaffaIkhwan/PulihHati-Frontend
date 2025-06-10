import React from 'react';
import { Heart, MessageCircle } from "lucide-react";

function PostCard({ post }) {
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
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl shadow-lg border border-stone-200 p-4 min-h-[160px] transition-all duration-500 transform">
      <div className="flex items-start mb-3">
        <div className="h-8 w-8 rounded-full mr-2 border-2 border-amber-300 bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-xs">
          {getInitials(post?.author?.name)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-stone-800 text-sm">{post?.author?.name || 'Anonymous'}</h4>
          <p className="text-xs text-stone-500">
            {new Date(post?.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <p className="text-stone-700 text-sm leading-relaxed mb-3" style={{
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {post?.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-red-500">
            <Heart className="h-4 w-4 mr-1 fill-current" />
            <span className="text-sm font-medium">{post?.likes?.length || 0}</span>
          </div>
          <div className="flex items-center text-stone-500">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">{post?.comments?.length || 0}</span>
          </div>
        </div>

        <div className="text-xs text-amber-700 font-medium bg-amber-100 px-2 py-1 rounded-full">
          #Trending
        </div>
      </div>
    </div>
  );
}

export default PostCard; 