import { useState, useEffect } from 'react';
import { MessageCircle, Heart, Bookmark, Send, X, Plus, User, Home as HomeIcon, Bell, Camera } from 'lucide-react';
import axios from 'axios';

// API URL pointing to the other project
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions with better error handling
const getPosts = async () => {
  try {
    console.log('Fetching posts...');
    const response = await api.get('/safespace/posts');
    console.log('Posts response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch posts. Please try again later.');
  }
};

const getPostById = async (postId) => {
  try {
    console.log('Fetching complete post by ID:', postId);
    const response = await api.get(`/safespace/posts/${postId}`);
    console.log('Complete post response:', response.data);

    // Ensure we have complete post data with comments
    const postData = response.data;
    if (postData && !postData.comments) {
      postData.comments = [];
    }

    return postData;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch post. Please try again later.');
  }
};

const createPost = async (content) => {
  try {
    const response = await api.post('/safespace/posts', { content });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(error.response?.data?.message || 'Failed to create post. Please try again later.');
  }
};

const likePost = async (id) => {
  try {
    const response = await api.put(`/safespace/posts/${id}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error(error.response?.data?.message || 'Failed to like post. Please try again later.');
  }
};

const addComment = async (postId, content) => {
  try {
    const response = await api.post(`/safespace/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error(error.response?.data?.message || 'Failed to add comment. Please try again later.');
  }
};

const toggleBookmark = async (postId) => {
  try {
    const response = await api.put(`/safespace/posts/${postId}/bookmark`);
    return response.data;
  } catch (error) {
    console.error('Error bookmarking post:', error);
    throw new Error(error.response?.data?.message || 'Failed to bookmark post. Please try again later.');
  }
};

const getBookmarkedPosts = async () => {
  try {
    const response = await api.get('/safespace/bookmarks');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookmarked posts:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch bookmarked posts. Please try again later.');
  }
};

const getNotifications = async () => {
  try {
    const response = await api.get('/safespace/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications. Please try again later.');
  }
};

const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/safespace/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read. Please try again later.');
  }
};

const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/safespace/notifications/read-all');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read. Please try again later.');
  }
};

function SafeSpace() {
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState({});
  const [bookmarkAnimations, setBookmarkAnimations] = useState({});
  const [inlineComments, setInlineComments] = useState({}); // For inline comment inputs
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [processingNotification, setProcessingNotification] = useState(null);

  // Helper function to get the most recent comment
  const getRecentComments = (comments) => {
    if (!Array.isArray(comments) || comments.length === 0) return [];

    // Sort comments by created_at in descending order and take the first 1
    return comments
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 1);
  };

  // Fetch user data and notification count when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    const fetchNotificationCount = async () => {
      try {
        const data = await getNotifications();
        const notificationsArray = Array.isArray(data) ? data : [];
        const unread = notificationsArray.filter(notif => !notif.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };

    fetchUserData();
    fetchNotificationCount();
  }, []);

  // Fetch posts when component mounts or tab changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (activeTab === 'saved') {
          data = await getBookmarkedPosts();
        } else if (activeTab === 'notifications') {
          data = await getNotifications();
          setNotifications(Array.isArray(data) ? data : []);
          // Note: unread count will be updated by useEffect that watches notifications
          setLoading(false);
          return;
        } else {
          data = await getPosts();
        }

        // Handle different data formats
        if (!data) {
          setPosts([]);
        } else if (Array.isArray(data)) {
          setPosts(data);
        } else if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else if (typeof data === 'object') {
          // If it's a single post object
          setPosts([data]);
        } else {
          console.error('Unexpected data format:', data);
          setError('Received unexpected data format from server');
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (activeTab === 'notifications') {
          setError('Failed to fetch notifications. Please try again later.');
        } else {
          setError('Failed to fetch posts. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleNewPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      setLoading(true);
      const createdPost = await createPost(newPost);
      setPosts([createdPost, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const updatedLikes = await likePost(postId);
      setPosts(posts.map(post =>
        (post._id === postId || post.id === postId)
          ? { ...post, likes: updatedLikes }
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Failed to like post. Please try again.');
    }
  };

  const handleBookmark = async (postId) => {
    try {
      // Start animation immediately for better UX
      setBookmarkAnimations({
        ...bookmarkAnimations,
        [postId]: true
      });

      const updatedBookmarks = await toggleBookmark(postId);

      // Update the bookmarked status in the posts array
      setPosts(posts.map(post => {
        if (post._id === postId || post.id === postId) {
          // Check if the post is now bookmarked or not
          const isBookmarked = updatedBookmarks.includes(post._id || post.id);
          return { ...post, bookmarked: isBookmarked };
        }
        return post;
      }));

      // Clear animation after a delay
      setTimeout(() => {
        setBookmarkAnimations(prev => ({
          ...prev,
          [postId]: false
        }));
      }, 1000);
    } catch (err) {
      console.error('Error bookmarking post:', err);
      setError('Failed to bookmark post. Please try again.');
      // Clear animation if there's an error
      setBookmarkAnimations(prev => ({
        ...prev,
        [postId]: false
      }));
    }
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setNewComment('');
  };

  const closeCommentModal = () => {
    setSelectedPost(null);
    setNewComment('');
  };

  const handleNewComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPost) return;

    try {
      const postId = selectedPost._id || selectedPost.id;
      const updatedComments = await addComment(postId, newComment);

      // Update the comments in the selected post and in the posts array
      setSelectedPost({
        ...selectedPost,
        comments: updatedComments
      });

      setPosts(posts.map(post =>
        (post._id === postId || post.id === postId)
          ? { ...post, comments: updatedComments }
          : post
      ));

      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  // Handle inline comment submission
  const handleInlineComment = async (e, postId) => {
    e.preventDefault();
    const commentText = inlineComments[postId];
    if (!commentText?.trim()) return;

    try {
      const updatedComments = await addComment(postId, commentText);

      // Update the posts array with new comments
      setPosts(posts.map(post =>
        (post._id === postId || post.id === postId)
          ? { ...post, comments: updatedComments }
          : post
      ));

      // Update the selected post if it's the same post
      if (selectedPost && (selectedPost._id === postId || selectedPost.id === postId)) {
        setSelectedPost({
          ...selectedPost,
          comments: updatedComments
        });
      }

      // Clear the inline comment input
      setInlineComments(prev => ({
        ...prev,
        [postId]: ''
      }));
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  // Handle notification actions
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read. Please try again.');
    }
  };

  // Handle notification click - show post popup directly
  const handleNotificationClick = async (notification) => {
    try {
      // Set processing state
      setProcessingNotification(notification._id);

      // Clear any existing errors
      setError(null);

      // Mark as read if unread
      if (!notification.read) {
        await handleMarkAsRead(notification._id);
      }

      // Get the post ID from the notification
      const postId = notification.post?._id || notification.post?.id;

      if (!postId) {
        setError('Post not found for this notification.');
        setProcessingNotification(null);
        return;
      }

      // Try to find the post in current posts first
      let targetPost = posts.find(post =>
        (post._id === postId || post.id === postId)
      );

      // Always fetch fresh post data to ensure we have complete information
      // This is especially important for comment notifications to get latest comments
      try {
        console.log('Fetching fresh post data for notification...');
        const freshPost = await getPostById(postId);

        if (freshPost) {
          targetPost = freshPost;

          // Update the post in the posts list with fresh data
          setPosts(prevPosts => {
            const updatedPosts = prevPosts.map(p =>
              (p._id === postId || p.id === postId) ? freshPost : p
            );

            // If post doesn't exist in list, add it
            const exists = prevPosts.some(p =>
              (p._id === postId || p.id === postId)
            );
            if (!exists) {
              return [freshPost, ...prevPosts];
            }

            return updatedPosts;
          });

          console.log('Fresh post data loaded:', {
            postId: freshPost._id || freshPost.id,
            content: freshPost.content?.substring(0, 50) + '...',
            commentsCount: freshPost.comments?.length || 0,
            author: freshPost.author?.name
          });
        }
      } catch (fetchErr) {
        console.error('Error fetching fresh post data:', fetchErr);
        // If we can't fetch fresh data but have cached data, use it
        if (!targetPost) {
          setError('Could not load the post for this notification.');
          setProcessingNotification(null);
          return;
        }
        console.log('Using cached post data as fallback');
      }

      // Open the post in comment modal directly (stay on notifications page)
      if (targetPost) {
        console.log('Opening post modal with:', {
          postId: targetPost._id || targetPost.id,
          hasContent: !!targetPost.content,
          hasComments: !!targetPost.comments,
          commentsCount: targetPost.comments?.length || 0
        });
        openCommentModal(targetPost);
      } else {
        setError('Could not load the post for this notification.');
      }

    } catch (err) {
      console.error('Error handling notification click:', err);
      setError('Failed to load post. Please try again.');
    } finally {
      // Clear processing state
      setProcessingNotification(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read. Please try again.');
    }
  };

  // Update notification count when notifications change
  useEffect(() => {
    if (Array.isArray(notifications)) {
      const unread = notifications.filter(notif => !notif.read).length;
      setUnreadCount(unread);
    }
  }, [notifications]);

  // Helper function to get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'bookmark':
        return <Bookmark className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to format notification message
  const formatNotificationMessage = (notification) => {
    const { type, actor, post } = notification;
    const actorName = actor?.name || 'Someone';
    const postPreview = post?.content?.substring(0, 50) + (post?.content?.length > 50 ? '...' : '') || 'your post';

    switch (type) {
      case 'like':
        return `${actorName} liked ${postPreview}`;
      case 'comment':
        return `${actorName} commented on ${postPreview}`;
      case 'bookmark':
        return `${actorName} bookmarked ${postPreview}`;
      default:
        return `${actorName} interacted with ${postPreview}`;
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      // Validasi
      if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
        alert('Please select a valid image file (max 5MB)');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }

      setLoading(true);

      // Upload
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/safespace/upload-avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.user) {
        setUser(data.user);
        alert('Avatar updated successfully!');
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">


      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex border-b border-stone-300 mb-6">
          <button
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'home' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
            onClick={() => setActiveTab('home')}
          >
            <HomeIcon className="h-5 w-5 inline mr-1" />
            <span>Home</span>
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'saved' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark className="h-5 w-5 inline mr-1" />
            <span>Saved</span>
          </button>
          <button
            className={`px-4 py-2 font-medium relative transition-colors ${activeTab === 'notifications' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-5 w-5 inline mr-1" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'profile' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-5 w-5 inline mr-1" />
            <span>Profile</span>
          </button>
        </div>

        <main>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Home Tab */}
          {(activeTab === 'home' || activeTab === 'saved') && (
            <div className="space-y-6">
              {/* New Post Form (only on home tab) */}
              {activeTab === 'home' && (
                <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
                  <form onSubmit={handleNewPost}>
                    <div className="flex items-start">
                      <img
                        src={user.avatar || "https://randomuser.me/api/portraits/lego/5.jpg"}
                        alt="Your Profile"
                        className="h-12 w-12 rounded-full mr-3 border-2 border-amber-200"
                      />
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
                          onChange={(e) => setNewPost(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-3">
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full font-medium flex items-center hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg"
                            disabled={!newPost.trim() || loading}
                          >
                            <Plus className="h-5 w-5 mr-1" />
                            <span>Post</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Loading State */}
              {loading && activeTab !== 'profile' && (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
                  <p className="mt-2 text-stone-500">Loading posts...</p>
                </div>
              )}

              {/* Posts */}
              {!loading && posts.length > 0 ? (
                posts.map(post => (
                  <article key={post._id} className="bg-white rounded-2xl shadow-lg border border-stone-200">
                    <div className="p-6">
                      <div className="flex items-start">
                        <img
                          src={post.author?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                          alt={post.author?.name}
                          className="h-10 w-10 rounded-full mr-3 border-2 border-amber-200"
                        />
                        <div>
                          <h3 className="font-medium text-stone-800">{post.author?.name}</h3>
                          <p className="text-xs text-stone-500">
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-stone-700 leading-relaxed">{post.content}</p>
                      </div>
                      <div className="mt-5 flex space-x-3">
                        <button
                          className={`flex items-center px-3 py-2 rounded-full transition-all duration-200 ${post.likes?.some(like => like.user === user.id) ? 'text-red-500 bg-red-50' : 'text-stone-500 hover:bg-stone-100'}`}
                          onClick={() => toggleLike(post._id)}
                        >
                          <Heart className={`h-5 w-5 mr-1 ${post.likes?.some(like => like.user === user.id) ? 'fill-current' : ''}`} />
                          <span className="font-medium">
                            {Array.isArray(post.likes)
                              ? post.likes.length > 0
                                ? post.likes.length
                                : 'Like'
                              : 'Like'}
                          </span>
                        </button>
                        <button
                          className="text-stone-500 flex items-center hover:bg-stone-100 px-3 py-2 rounded-full transition-all duration-200"
                          onClick={() => openCommentModal(post)}
                        >
                          <MessageCircle className="h-5 w-5 mr-1" />
                          <span className="font-medium">
                            {Array.isArray(post.comments)
                              ? post.comments.length > 0
                                ? post.comments.length
                                : 'Comment'
                              : 'Comment'}
                          </span>
                        </button>
                        <button
                          className={`flex items-center px-3 py-2 rounded-full transition-all duration-200 ${
                            post.bookmarked
                              ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                              : 'text-stone-500 hover:bg-stone-100'
                          }`}
                          onClick={() => handleBookmark(post._id || post.id)}
                        >
                          <Bookmark
                            className={`h-5 w-5 mr-1 ${
                              post.bookmarked ? 'fill-current text-amber-700' : ''
                            } ${bookmarkAnimations[post._id || post.id] ? 'animate-bookmark' : ''}`}
                          />
                          <span className="font-medium">{post.bookmarked ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>

                      {/* Recent Comments Section */}
                      {Array.isArray(post.comments) && post.comments.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                          <div className="space-y-3">
                            {getRecentComments(post.comments).map(comment => (
                              <div key={comment._id} className="flex items-start">
                                <img
                                  src={comment.author?.avatar || "https://randomuser.me/api/portraits/lego/2.jpg"}
                                  alt={comment.author?.name}
                                  className="h-8 w-8 rounded-full mr-2"
                                />
                                <div className="flex-1 bg-gray-50 p-2 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-black text-sm">{comment.author?.name}</h4>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
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
                                onClick={() => openCommentModal(post)}
                              >
                                View all {post.comments.length} comments
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Inline Comment Input */}
                      <div className="mt-4 border-t pt-4">
                        <form onSubmit={(e) => handleInlineComment(e, post._id || post.id)}>
                          <div className="flex items-center">
                            <img
                              src={user.avatar || "https://randomuser.me/api/portraits/lego/5.jpg"}
                              alt="Your Profile"
                              className="h-8 w-8 rounded-full mr-2"
                            />
                            <div className="relative flex-1">
                              <input
                                type="text"
                                className="bg-gray-50 rounded-full px-4 py-2 text-gray-700 w-full text-sm"
                                placeholder="Write a comment..."
                                value={inlineComments[post._id || post.id] || ''}
                                onChange={(e) => setInlineComments(prev => ({
                                  ...prev,
                                  [post._id || post.id]: e.target.value
                                }))}
                              />
                              <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                                disabled={!inlineComments[post._id || post.id]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                !loading && (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    {activeTab === 'saved' ? (
                      <>
                        <Bookmark className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No saved posts yet</h3>
                        <p className="text-gray-500">Items you save will appear here</p>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No posts yet</h3>
                        <p className="text-gray-500">Be the first to share something!</p>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && !loading && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 text-center border-b">
                <div className="relative inline-block mb-4">
                  <img
                    src={user.avatar || "https://randomuser.me/api/portraits/lego/5.jpg"}
                    alt="Your Profile"
                    className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleAvatarUpload(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <h3 className="text-xl font-bold text-black">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-medium text-black mb-4">Your Activity</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h5 className="text-gray-500 text-sm mb-1">Posts</h5>
                    <p className="text-2xl font-bold text-blue-600">
                      {posts.filter(post => post.author?._id === user.id).length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h5 className="text-gray-500 text-sm mb-1">Comments</h5>
                    <p className="text-2xl font-bold text-blue-600">
                      {posts.reduce((count, post) => count + (post.comments?.filter(comment => comment.author?._id === user.id).length || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h5 className="text-gray-500 text-sm mb-1">Bookmarks</h5>
                    <p className="text-2xl font-bold text-blue-600">
                      {posts.filter(post => post.bookmarked).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Notifications Header */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-black">Notifications</h2>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                {unreadCount > 0 && (
                  <p className="text-gray-500 text-sm mt-1">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-500">Loading notifications...</p>
                </div>
              )}

              {/* Notifications List */}
              {!loading && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div
                      key={notification._id}
                      className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-colors relative ${
                        !notification.read ? 'border-l-4 border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      } ${processingNotification === notification._id ? 'opacity-75' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {processingNotification === notification._id && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                      )}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <img
                                src={notification.actor?.avatar || "https://randomuser.me/api/portraits/lego/3.jpg"}
                                alt={notification.actor?.name}
                                className="h-8 w-8 rounded-full mr-2"
                              />
                              <div>
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-black' : 'text-gray-700'}`}>
                                  {formatNotificationMessage(notification)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No notifications yet</h3>
                    <p className="text-gray-500">When someone interacts with your posts, you&apos;ll see notifications here</p>
                  </div>
                )
              )}
            </div>
          )}
        </main>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold text-black">Post Details</h2>
                <p className="text-sm text-gray-500">Full post content and comments</p>
              </div>
              <button onClick={closeCommentModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Post Content Section */}
            <div className="p-4 border-b bg-stone-50">
              <div className="flex items-start">
                <img
                  src={selectedPost.author?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt={selectedPost.author?.name}
                  className="h-12 w-12 rounded-full mr-3 border-2 border-amber-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-stone-800">{selectedPost.author?.name}</h3>
                    <span className="text-xs text-stone-500">•</span>
                    <p className="text-xs text-stone-500">
                      {new Date(selectedPost.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="mt-3 bg-white p-4 rounded-lg border border-stone-200">
                    <p className="text-stone-800 leading-relaxed">{selectedPost.content}</p>
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-stone-500">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{selectedPost.likes?.length || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{selectedPost.comments?.length || 0} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-medium text-black mb-4">Comments</h3>
              {Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0 ? (
                <div className="space-y-4">
                  {selectedPost.comments.map(comment => (
                    <div key={comment._id} className="flex items-start">
                      <img
                        src={comment.author?.avatar || "https://randomuser.me/api/portraits/lego/2.jpg"}
                        alt={comment.author?.name}
                        className="h-10 w-10 rounded-full mr-2"
                      />
                      <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-black">{comment.author?.name}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
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
            <div className="p-4 border-t">
              <form onSubmit={handleNewComment}>
                <div className="flex items-center">
                  <img
                    src={user.avatar || "https://randomuser.me/api/portraits/lego/5.jpg"}
                    alt="Your Profile"
                    className="h-10 w-10 rounded-full mr-2"
                  />
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="bg-gray-100 rounded-full px-4 py-2 text-gray-700 w-full"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
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
      )}
    </div>
  );
}

export default SafeSpace;