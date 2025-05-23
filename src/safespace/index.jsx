import { useState } from 'react';
import { Search, Bell, Home as HomeIcon, ThumbsUp, MessageCircle, Bookmark, Send, X, ChevronLeft, ChevronRight } from 'lucide-react';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  
  // Posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      timePosted: '2h ago',
      content: 'Just finished a great book on mindfulness and mental health. Highly recommend it for anyone looking to improve their well-being!',
      likes: 24,
      comments: [],
      shares: 3,
      liked: false,
      bookmarked: false
    },
    {
      id: 2,
      author: {
        name: 'Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      timePosted: '5h ago',
      content: 'Today I practiced self-care by taking a long walk in nature. What are your favorite self-care activities?',
      likes: 42,
      comments: [
        {
          id: 1,
          author: {
            name: 'Alex Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
          },
          content: 'I love meditation and journaling!',
          timePosted: '4h ago'
        }
      ],
      shares: 7,
      liked: true,
      bookmarked: true
    }
  ]);
  
  // Notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      content: 'liked your post',
      postSnippet: 'Excited to share that I\'ve started a new position...',
      time: '2h ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Mike Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg'
      },
      content: 'commented on your post',
      postSnippet: 'Just published my thoughts on the future of product management...',
      comment: 'Great insights! I think AI will definitely transform how we approach product development.',
      time: '5h ago',
      read: true
    },
    {
      id: 3,
      type: 'mention',
      user: {
        name: 'Lisa Wong',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      content: 'mentioned you in a comment',
      postSnippet: 'Breaking: Major technology company announces new AI platform...',
      comment: 'I think @Your Name would have some interesting thoughts on this!',
      time: '1d ago',
      read: false
    }
  ]);
  
  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    ));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Toggle like status for a post
  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikedStatus = !post.liked;
        return {
          ...post,
          liked: newLikedStatus,
          likes: newLikedStatus ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };
  
  // Toggle bookmark status for a post
  const toggleBookmark = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          bookmarked: !post.bookmarked
        };
      }
      return post;
    }));
  };

  // Open comment modal
  const openCommentModal = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };
  
  // Close comment modal
  const closeCommentModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  // Handle new post submission
  const handleNewPost = (e) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) return;
    
    // Create new post object
    const newPost = {
      id: Date.now(), // Use timestamp as unique ID
      author: {
        name: 'Your Name',
        avatar: 'https://randomuser.me/api/portraits/lego/5.jpg'
      },
      timePosted: 'Just now',
      content: newPostContent,
      likes: 0,
      comments: [],
      shares: 0,
      liked: false,
      bookmarked: false
    };
    
    // Add new post to the beginning of posts array
    setPosts([newPost, ...posts]);
    
    // Clear input field
    setNewPostContent('');
  };

  // Get posts to display based on active tab
  const getDisplayedPosts = () => {
    if (activeTab === 'saved') {
      return posts.filter(post => post.bookmarked);
    }
    return posts;
  };

  // Toggle navbar collapse state
  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Left Sidebar - Navigation */}
      <aside className={`${isNavbarCollapsed ? 'w-16' : 'w-16 md:w-64'} bg-white shadow-sm fixed h-full left-0 top-0 z-10 flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b flex justify-between items-center">
          {!isNavbarCollapsed && (
            <h1 className="text-2xl font-serif font-bold text-blue-600 italic hidden md:block">Pulih Hati</h1>
          )}
          <h1 className={`text-xl font-serif font-bold text-blue-600 italic ${!isNavbarCollapsed ? 'md:hidden' : ''}`}>PH</h1>
          
          <button 
            onClick={toggleNavbar} 
            className="text-gray-500 hover:text-gray-700 hidden md:block"
          >
            {isNavbarCollapsed ? 
              <ChevronRight className="h-5 w-5" /> : 
              <ChevronLeft className="h-5 w-5" />
            }
          </button>
        </div>
        
        {/* Search in sidebar - Only show when expanded */}
        {!isNavbarCollapsed && (
          <div className="px-2 py-3 border-b hidden md:block">
            <div className="relative">
              <Search className="absolute left-2 top-2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                className="bg-gray-100 pl-9 pr-2 py-2 rounded-md w-full text-sm"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <nav className="p-2 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <a 
                href="#" 
                className={`flex items-center p-2 ${activeTab === 'home' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'} rounded-md`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('home');
                }}
              >
                <HomeIcon className="h-6 w-6" />
                {!isNavbarCollapsed && <span className="ml-3 hidden md:block">Home</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center p-2 ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'} rounded-md relative`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('notifications');
                }}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
                {!isNavbarCollapsed && <span className="ml-3 hidden md:block">Notifications</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center p-2 ${activeTab === 'saved' ? 'bg-gray-200 text-black' : 'text-gray-500 hover:bg-gray-100'} rounded-md`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('saved');
                }}
              >
                <Bookmark className="h-6 w-6" />
                {!isNavbarCollapsed && <span className="ml-3 hidden md:block">Saved</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center p-2 ${activeTab === 'profile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'} rounded-md`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('profile');
                }}
              >
                <img src="https://randomuser.me/api/portraits/lego/5.jpg" alt="Profile" className="h-6 w-6 rounded-full" />
                {!isNavbarCollapsed && <span className="ml-3 hidden md:block">Me</span>}
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`${isNavbarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'} flex-1 transition-all duration-300`}>
        {/* Main Feed - Full width */}
        <main className="max-w-4xl lg:max-w-5xl mx-auto px-4 py-6">
          {/* Page Title */}
          <h2 className="text-2xl font-bold mb-4 text-black">
            {activeTab === 'saved' ? 'Saved Posts' : 
             activeTab === 'notifications' ? 'Notifications' : 
             activeTab === 'profile' ? 'My Profile' : 'Home'}
          </h2>
          
          {/* Create Post - Only show on home tab */}
          {activeTab === 'home' && (
            <div className="bg-white rounded-lg shadow mb-4 p-4">
              <form onSubmit={handleNewPost}>
                <div className="flex items-center">
                  <img src="https://randomuser.me/api/portraits/lego/5.jpg" alt="Profile" className="h-12 w-12 rounded-full mr-2" />
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 text-gray-700 w-full"
                      placeholder="Start a post"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                    >
                      <Send className="h-5 w-5 transform rotate-90" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Notifications - Only show on notifications tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium text-black">Recent Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="divide-y">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <img 
                          src={notification.user.avatar} 
                          alt={notification.user.name} 
                          className="h-10 w-10 rounded-full mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm">
                              <span className="font-medium text-black">{notification.user.name}</span>
                              <span className="text-gray-600"> {notification.content}</span>
                            </p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          
                          {notification.postSnippet && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              &quot;{notification.postSnippet}&quot;
                            </p>
                          )}
                          
                          {notification.comment && (
                            <p className="text-xs text-gray-600 mt-1 bg-gray-100 p-2 rounded">
                              {notification.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No notifications yet</h3>
                    <p className="text-gray-500">When you get notifications, they&apos;ll show up here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Posts Feed - Only show on home tab */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {getDisplayedPosts().map(post => (
                <article key={post.id} className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <div className="flex items-start">
                      <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 rounded-full mr-2" />
                      <div className="flex-1">
                        <h3 className="font-medium text-black">{post.author.name}</h3>
                        <p className="text-xs text-gray-500">{post.timePosted}</p>
                      </div>
                      <button className="text-gray-500">•••</button>
                    </div>
                    <div className="mt-3">
                      <p className="text-black">{post.content}</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <button 
                        className={`flex items-center px-2 py-1 rounded ${post.liked ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <ThumbsUp className={`h-5 w-5 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                        <span>{post.likes > 0 ? post.likes : 'Like'}</span>
                      </button>
                      <button 
                        className="text-gray-500 flex items-center hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => openCommentModal(post)}
                      >
                        <MessageCircle className="h-5 w-5 mr-1" />
                        <span>{post.comments.length > 0 ? post.comments.length : 'Comment'}</span>
                      </button>
                      <button 
                        className={`flex items-center px-2 py-1 rounded ${post.bookmarked ? 'text-black' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => toggleBookmark(post.id)}
                      >
                        <Bookmark className={`h-5 w-5 mr-1 ${post.bookmarked ? 'fill-current' : ''}`} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Saved Posts - Only show on saved tab */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {getDisplayedPosts().length > 0 ? (
                getDisplayedPosts().map(post => (
                  <article key={post.id} className="bg-white rounded-lg shadow">
                    <div className="p-4">
                      <div className="flex items-start">
                        <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 rounded-full mr-2" />
                        <div className="flex-1">
                          <h3 className="font-medium text-black">{post.author.name}</h3>
                          <p className="text-xs text-gray-500">{post.timePosted}</p>
                        </div>
                        <button className="text-gray-500">•••</button>
                      </div>
                      <div className="mt-3">
                        <p className="text-black">{post.content}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <div className="flex justify-between">
                        <button 
                          className={`flex items-center px-2 py-1 rounded ${post.liked ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                          onClick={() => toggleLike(post.id)}
                        >
                          <ThumbsUp className={`h-5 w-5 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                          <span>{post.likes > 0 ? post.likes : 'Like'}</span>
                        </button>
                        <button 
                          className="text-gray-500 flex items-center hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => openCommentModal(post)}
                        >
                          <MessageCircle className="h-5 w-5 mr-1" />
                          <span>{post.comments.length > 0 ? post.comments.length : 'Comment'}</span>
                        </button>
                        <button 
                          className={`flex items-center px-2 py-1 rounded ${post.bookmarked ? 'text-black' : 'text-gray-500 hover:bg-gray-100'}`}
                          onClick={() => toggleBookmark(post.id)}
                        >
                          <Bookmark className={`h-5 w-5 mr-1 ${post.bookmarked ? 'fill-current' : ''}`} />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <Bookmark className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No saved posts yet</h3>
                  <p className="text-gray-500">Items you save will appear here</p>
                </div>
              )}
            </div>
          )}
          
          {/* Profile - Only show on profile tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 text-center border-b">
                <img 
                  src="https://randomuser.me/api/portraits/lego/5.jpg" 
                  alt="Your Profile" 
                  className="h-24 w-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-black">Your Name</h3>
                <p className="text-gray-600">Software Developer</p>
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-medium text-black mb-4">Your Activity</h4>
                <p className="text-gray-600 text-center py-8">
                  Your activity stats will appear here
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Comment Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-black">Post</h2>
              <button 
                onClick={closeCommentModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Modal Content - Post */}
            <div className="p-4 border-b overflow-y-auto">
              <div className="flex items-start">
                <img src={selectedPost.author.avatar} alt={selectedPost.author.name} className="h-12 w-12 rounded-full mr-2" />
                <div className="flex-1">
                  <h3 className="font-medium text-black">{selectedPost.author.name}</h3>
                  <p className="text-xs text-gray-500">{selectedPost.timePosted}</p>
                  <div className="mt-3">
                    <p className="text-black">{selectedPost.content}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Content - Comments */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-medium text-black mb-4">Comments</h3>
              <div className="space-y-4">
                {selectedPost.comments.map(comment => (
                  <div key={comment.id} className="flex items-start">
                    <img src={comment.author.avatar} alt={comment.author.name} className="h-10 w-10 rounded-full mr-2" />
                    <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-black">{comment.author.name}</h4>
                        <span className="text-xs text-gray-500">{comment.timePosted}</span>
                      </div>
                      <p className="text-sm text-black mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Add Comment */}
            <div className="p-4 border-t">
              <div className="flex items-start">
                <img src="https://randomuser.me/api/portraits/lego/5.jpg" alt="Your Profile" className="h-10 w-10 rounded-full mr-2" />
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    className="bg-gray-100 border border-gray-200 rounded-full px-4 py-2 w-full"
                    placeholder="Write a comment..."
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
                    <Send className="h-5 w-5 transform rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;























