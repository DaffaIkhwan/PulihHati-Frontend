function ProfileTab({ user, posts }) {
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
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 text-center border-b">
        <div className="inline-block mb-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Your Profile"
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 bg-[#4F3422]/20 flex items-center justify-center text-[#251404] text-2xl font-semibold">
              {getInitials(user.name)}
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-black">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <div className="p-6">
        <h4 className="text-lg font-medium text-black mb-4">Your Activity</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h5 className="text-gray-500 text-sm mb-1">Posts</h5>
            <p className="text-2xl font-bold text-[#251404]">
              {posts.filter(post => post.author?._id === user.id).length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h5 className="text-gray-500 text-sm mb-1">Comments</h5>
            <p className="text-2xl font-bold text-[#251404]">
              {posts.reduce((count, post) => count + (post.comments?.filter(comment => comment.author?._id === user.id).length || 0), 0)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h5 className="text-gray-500 text-sm mb-1">Bookmarks</h5>
            <p className="text-2xl font-bold text-[#251404]">
              {posts.filter(post => post.bookmarked).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab; 