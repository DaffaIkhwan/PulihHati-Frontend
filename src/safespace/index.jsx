import { useState, useEffect } from 'react';
import { MessageCircle, Heart, Bookmark, Send, X, Plus, User, Home as HomeIcon } from 'lucide-react';
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

function SafeSpace() {
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState({});

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
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
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again later.');
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
    } catch (err) {
      console.error('Error bookmarking post:', err);
      setError('Failed to bookmark post. Please try again.');
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Safe Space</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">{user.name}</span>
              <img 
                src={user.avatar || "https://randomuser.me/api/portraits/lego/5.jpg"} 
                alt="Your Profile" 
                className="h-8 w-8 rounded-full" 
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('home')}
          >
            <HomeIcon className="h-5 w-5 inline mr-1" />
            <span>Home</span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'saved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark className="h-5 w-5 inline mr-1" />
            <span>Saved</span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
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
                <div className="bg-white rounded-lg shadow p-4">
                  <form onSubmit={handleNewPost}>
                    <div className="flex items-start">
                      <img 
                        src={user.avatar || "https://randomuser.me/api/portraits/lego/5.jpg"} 
                        alt="Your Profile" 
                        className="h-10 w-10 rounded-full mr-2" 
                      />
                      <div className="flex-1">
                        <textarea
                          className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="What's on your mind?"
                          rows="3"
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <button 
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-blue-700"
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
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-500">Loading posts...</p>
                </div>
              )}

              {/* Posts */}
              {!loading && posts.length > 0 ? (
                posts.map(post => (
                  <article key={post._id} className="bg-white rounded-lg shadow">
                    <div className="p-4">
                      <div className="flex items-start">
                        <img 
                          src={post.author?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                          alt={post.author?.name} 
                          className="h-10 w-10 rounded-full mr-2" 
                        />
                        <div>
                          <h3 className="font-medium text-black">{post.author?.name}</h3>
                          <p className="text-xs text-gray-500">
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
                      <div className="mt-3">
                        <p className="text-black">{post.content}</p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button 
                          className={`flex items-center px-2 py-1 rounded ${post.likes?.some(like => like.user === user.id) ? 'text-red-500' : 'text-gray-500 hover:bg-gray-100'}`}
                          onClick={() => toggleLike(post._id)}
                        >
                          <Heart className={`h-5 w-5 mr-1 ${post.likes?.some(like => like.user === user.id) ? 'fill-current' : ''}`} />
                          <span>
                            {Array.isArray(post.likes) 
                              ? post.likes.length > 0 
                                ? post.likes.length 
                                : 'Like'
                              : 'Like'}
                          </span>
                        </button>
                        <button 
                          className="text-gray-500 flex items-center hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => openCommentModal(post)}
                        >
                          <MessageCircle className="h-5 w-5 mr-1" />
                          <span>
                            {Array.isArray(post.comments) 
                              ? post.comments.length > 0 
                                ? post.comments.length 
                                : 'Comment'
                              : 'Comment'}
                          </span>
                        </button>
                        <button 
                          className={`flex items-center px-2 py-1 rounded ${post.bookmarked ? 'text-black' : 'text-gray-500 hover:bg-gray-100'}`}
                          onClick={() => handleBookmark(post._id)}
                        >
                          <Bookmark className={`h-5 w-5 mr-1 ${post.bookmarked ? 'fill-current' : ''}`} />
                          <span>Save</span>
                        </button>
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
                <img 
                  src={user.avatar || "https://randomuser.me/api/portraits/lego/5.jpg"} 
                  alt="Your Profile" 
                  className="h-24 w-24 rounded-full mx-auto mb-4" 
                />
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
        </main>
      </div>

      {/* Comment Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-black">Post</h2>
              <button onClick={closeCommentModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 border-b overflow-y-auto">
              <div className="flex items-start">
                <img 
                  src={selectedPost.author?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                  alt={selectedPost.author?.name} 
                  className="h-12 w-12 rounded-full mr-2" 
                />
                <div className="flex-1">
                  <h3 className="font-medium text-black">{selectedPost.author?.name}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedPost.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="mt-3">
                    <p className="text-black">{selectedPost.content}</p>
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






