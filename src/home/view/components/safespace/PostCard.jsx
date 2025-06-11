import React from 'react';
import { Heart, MessageCircle } from "lucide-react";
import { formatCardDate, getPostDate } from '../../../../utils/dateUtils';

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
    <div className="bg-gradient-to-br from-white to-stone-50 rounded-2xl shadow-xl border border-[#251404]/10 p-6 min-h-[180px] transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
      <div className="flex items-start mb-4">
        <div className="h-10 w-10 rounded-full mr-3 border-2 border-[#251404] bg-[#A1BA82]/20 flex items-center justify-center text-[#251404] font-bold text-sm">
          {getInitials(post?.author?.name)}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#251404] text-base">{post?.author?.name || 'Anonymous'}</h4>
          <p className="text-xs text-[#251404]/60 font-medium">
            {formatCardDate(getPostDate(post))}
          </p>
        </div>
      </div>

      <p className="text-[#251404]/80 text-sm leading-relaxed mb-4 font-medium" style={{
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {post?.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-red-500">
            <Heart className="h-4 w-4 mr-1 fill-current" />
            <span className="text-sm font-bold">{post?.likes_count || post?.likes?.length || 0}</span>
          </div>
          <div className="flex items-center text-[#251404]/70">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-sm font-semibold">{post?.comments_count || post?.comments?.length || 0}</span>
          </div>
        </div>

        <div className="text-xs text-white font-bold bg-gradient-to-r from-[#A1BA82] to-[#A1BA82]/80 px-3 py-1.5 rounded-full shadow-lg">
          #Trending
        </div>
      </div>
    </div>
  );
}

export default PostCard; 