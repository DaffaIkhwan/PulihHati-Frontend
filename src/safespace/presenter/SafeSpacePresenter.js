class SafeSpacePresenter {
  constructor(model) {
    this.model = model;
    this.state = {
      activeTab: 'home',
      posts: [],
      loading: true,
      error: null,
      newPost: '',
      newComment: '',
      selectedPost: null,
      user: {},
      bookmarkAnimations: {},
      inlineComments: {},
      notifications: [],
      unreadCount: 0,
      processingNotification: null
    };
    this.setState = null;
  }

  setStateUpdater(setState) {
    this.setState = setState;
  }

  // Initialize the presenter with performance optimizations
  async initialize() {
    // Check if we have cached data first
    const cachedData = this.getCachedData();
    if (cachedData) {
      console.log('Using cached data for faster loading');
      this.updateState(cachedData);
    }

    try {
      // Fetch all data in parallel for better performance
      const [userData, notificationData, postsData] = await Promise.all([
        this.fetchUserDataOptimized(),
        this.fetchNotificationCountOptimized(),
        this.fetchDataOptimized()
      ]);

      // Update state with fresh data
      this.updateState({
        user: userData,
        unreadCount: notificationData,
        posts: postsData,
        loading: false
      });

      // Cache the data for next time
      this.setCachedData({
        user: userData,
        unreadCount: notificationData,
        posts: postsData,
        loading: false
      });

    } catch (error) {
      console.error('Error during initialization:', error);
      this.updateState({
        loading: false,
        error: 'Failed to load data. Please try again.'
      });
    }
  }

  // Helper function to get the most recent comment
  getRecentComments(comments) {
    if (!Array.isArray(comments) || comments.length === 0) return [];
    return comments
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 1);
  }

  // Cache management for performance optimization
  getCachedData() {
    try {
      const cached = localStorage.getItem('safespace_cache');
      if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();
        // Cache valid for 2 minutes
        if (data.timestamp && (now - data.timestamp) < 120000) {
          return data.data;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  }

  setCachedData(data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem('safespace_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  clearCache() {
    try {
      localStorage.removeItem('safespace_cache');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Fetch user data
  async fetchUserData() {
    try {
      const userData = await this.model.getUserData();
      this.updateState({ user: userData });
    } catch (err) {
      console.error('Error fetching user data:', err);
      this.updateState({ error: 'Failed to fetch user data' });
    }
  }

  // Optimized version with caching and error handling
  async fetchUserDataOptimized() {
    try {
      // Check if user data is already in state and recent
      if (this.state.user && this.state.user.id) {
        return this.state.user;
      }

      const userData = await this.model.getUserData();
      return userData;
    } catch (err) {
      console.error('Error fetching user data:', err);
      // Return cached user data if available
      const cached = this.getCachedData();
      if (cached && cached.user) {
        return cached.user;
      }
      throw err;
    }
  }

  // Fetch notification count
  async fetchNotificationCount() {
    try {
      const data = await this.model.getNotifications();
      const notificationsArray = Array.isArray(data) ? data : [];
      const unread = notificationsArray.filter(notif => !notif.read).length;
      this.updateState({ unreadCount: unread });
    } catch (err) {
      console.error('Error fetching notification count:', err);
    }
  }

  // Optimized notification count fetch
  async fetchNotificationCountOptimized() {
    try {
      // Return cached count if recent
      if (this.state.unreadCount !== undefined) {
        return this.state.unreadCount;
      }

      const data = await this.model.getNotifications();
      const notificationsArray = Array.isArray(data) ? data : [];
      const unread = notificationsArray.filter(notif => !notif.read).length;
      return unread;
    } catch (err) {
      console.error('Error fetching notification count:', err);
      // Return cached count if available
      const cached = this.getCachedData();
      if (cached && cached.unreadCount !== undefined) {
        return cached.unreadCount;
      }
      return 0; // Default to 0 if error
    }
  }

  // Fetch data based on active tab
  async fetchData() {
    this.updateState({ loading: true, error: null });
    try {
      let data;
      if (this.state.activeTab === 'saved') {
        data = await this.model.getBookmarkedPosts();
      } else if (this.state.activeTab === 'notifications') {
        data = await this.model.getNotifications();
        this.updateState({ 
          notifications: Array.isArray(data) ? data : [],
          loading: false 
        });
        return;
      } else {
        data = await this.model.getPosts();
      }

      if (!data) {
        this.updateState({ posts: [] });
      } else if (Array.isArray(data)) {
        this.updateState({ posts: data });
      } else if (data.posts && Array.isArray(data.posts)) {
        this.updateState({ posts: data.posts });
      } else if (typeof data === 'object') {
        this.updateState({ posts: [data] });
      } else {
        console.error('Unexpected data format:', data);
        this.updateState({ 
          error: 'Received unexpected data format from server',
          posts: [] 
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      this.updateState({ 
        error: this.state.activeTab === 'notifications' 
          ? 'Failed to fetch notifications. Please try again later.'
          : 'Failed to fetch posts. Please try again later.'
      });
    } finally {
      this.updateState({ loading: false });
    }
  }

  // Optimized data fetch with caching and smart loading
  async fetchDataOptimized() {
    try {
      // Return cached posts if recent and for home tab
      if (this.state.activeTab === 'home' && this.state.posts && this.state.posts.length > 0) {
        return this.state.posts;
      }

      let data;
      if (this.state.activeTab === 'saved') {
        data = await this.model.getBookmarkedPosts();
      } else if (this.state.activeTab === 'notifications') {
        data = await this.model.getNotifications();
        return Array.isArray(data) ? data : [];
      } else {
        data = await this.model.getPosts();
      }

      // Process and return data
      if (!data) {
        return [];
      } else if (Array.isArray(data)) {
        return data;
      } else if (data.posts && Array.isArray(data.posts)) {
        return data.posts;
      } else if (typeof data === 'object') {
        return [data];
      } else {
        console.error('Unexpected data format:', data);
        return [];
      }
    } catch (err) {
      console.error('Error fetching data optimized:', err);
      // Return cached data if available
      const cached = this.getCachedData();
      if (cached && cached.posts) {
        return cached.posts;
      }
      throw err;
    }
  }

  // Handle new post creation
  async handleNewPost(e, is_anonymous) {
    e.preventDefault();
    if (!this.state.newPost.trim()) return;

    this.updateState({ loading: true });
    try {
      const createdPost = await this.model.createPost(this.state.newPost, is_anonymous);
      this.updateState({
        posts: [createdPost, ...this.state.posts],
        newPost: ''
      });
    } catch (err) {
      console.error('Error creating post:', err);
      this.updateState({ error: 'Failed to create post. Please try again.' });
    } finally {
      this.updateState({ loading: false });
    }
  }

  // Handle post like
  async toggleLike(postId) {
    try {
      const updatedLikes = await this.model.likePost(postId);
      this.updateState({
        posts: this.state.posts.map(post =>
          (post._id === postId || post.id === postId)
            ? { ...post, likes: updatedLikes }
            : post
        )
      });
    } catch (err) {
      console.error('Error liking post:', err);
      this.updateState({ error: 'Failed to like post. Please try again.' });
    }
  }

  // Handle bookmark
  async handleBookmark(postId) {
    try {
      this.updateState({
        bookmarkAnimations: {
          ...this.state.bookmarkAnimations,
          [postId]: true
        }
      });

      const updatedBookmarks = await this.model.toggleBookmark(postId);

      this.updateState({
        posts: this.state.posts.map(post => {
          if (post._id === postId || post.id === postId) {
            const isBookmarked = updatedBookmarks.includes(post._id || post.id);
            return { ...post, bookmarked: isBookmarked };
          }
          return post;
        })
      });

      setTimeout(() => {
        this.updateState({
          bookmarkAnimations: {
            ...this.state.bookmarkAnimations,
            [postId]: false
          }
        });
      }, 1000);
    } catch (err) {
      console.error('Error bookmarking post:', err);
      this.updateState({ error: 'Failed to bookmark post. Please try again.' });
      this.updateState({
        bookmarkAnimations: {
          ...this.state.bookmarkAnimations,
          [postId]: false
        }
      });
    }
  }

  // Handle comment modal
  openCommentModal(post) {
    this.updateState({
      selectedPost: post,
      newComment: ''
    });
  }

  closeCommentModal() {
    this.updateState({
      selectedPost: null,
      newComment: ''
    });
  }

  // Handle new comment
  async handleNewComment(e) {
    e.preventDefault();
    if (!this.state.newComment.trim() || !this.state.selectedPost) return;

    try {
      const postId = this.state.selectedPost._id || this.state.selectedPost.id;
      const updatedComments = await this.model.addComment(postId, this.state.newComment);

      this.updateState({
        selectedPost: {
          ...this.state.selectedPost,
          comments: updatedComments
        },
        posts: this.state.posts.map(post =>
          (post._id === postId || post.id === postId)
            ? { ...post, comments: updatedComments }
            : post
        ),
        newComment: ''
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      this.updateState({ error: 'Failed to add comment. Please try again.' });
    }
  }

  // Handle inline comment
  async handleInlineComment(e, postId) {
    e.preventDefault();
    const commentText = this.state.inlineComments[postId];
    if (!commentText?.trim()) return;

    try {
      const updatedComments = await this.model.addComment(postId, commentText);

      this.updateState({
        posts: this.state.posts.map(post =>
          (post._id === postId || post.id === postId)
            ? { ...post, comments: updatedComments }
            : post
        ),
        selectedPost: this.state.selectedPost && (this.state.selectedPost._id === postId || this.state.selectedPost.id === postId)
          ? { ...this.state.selectedPost, comments: updatedComments }
          : this.state.selectedPost,
        inlineComments: {
          ...this.state.inlineComments,
          [postId]: ''
        }
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      this.updateState({ error: 'Failed to add comment. Please try again.' });
    }
  }

  // Handle notification actions
  async handleMarkAsRead(notificationId) {
    try {
      await this.model.markNotificationAsRead(notificationId);
      this.updateState({
        notifications: this.state.notifications.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, this.state.unreadCount - 1)
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      this.updateState({ error: 'Failed to mark notification as read. Please try again.' });
    }
  }

  // Handle notification click
  async handleNotificationClick(notification) {
    try {
      this.updateState({ processingNotification: notification._id });

      if (!notification.read) {
        await this.handleMarkAsRead(notification._id);
      }

      const postId = notification.post?._id || notification.post?.id;

      if (!postId) {
        this.updateState({ 
          error: 'Post not found for this notification.',
          processingNotification: null 
        });
        return;
      }

      let targetPost = this.state.posts.find(post =>
        (post._id === postId || post.id === postId)
      );

      try {
        const freshPost = await this.model.getPostById(postId);

        if (freshPost) {
          targetPost = freshPost;
          this.updateState({
            posts: this.state.posts.map(p =>
              (p._id === postId || p.id === postId) ? freshPost : p
            )
          });
        }
      } catch (fetchErr) {
        console.error('Error fetching fresh post data:', fetchErr);
        if (!targetPost) {
          this.updateState({ 
            error: 'Could not load the post for this notification.',
            processingNotification: null 
          });
          return;
        }
      }

      if (targetPost) {
        this.openCommentModal(targetPost);
      } else {
        this.updateState({ 
          error: 'Could not load the post for this notification.',
          processingNotification: null 
        });
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
      this.updateState({ 
        error: 'Failed to load post. Please try again.',
        processingNotification: null 
      });
    }
  }

  // Handle mark all notifications as read
  async handleMarkAllAsRead() {
    try {
      await this.model.markAllNotificationsAsRead();
      this.updateState({
        notifications: this.state.notifications.map(notif => ({ ...notif, read: true })),
        unreadCount: 0
      });
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      this.updateState({ error: 'Failed to mark all notifications as read. Please try again.' });
    }
  }

  // Handle avatar upload
  async handleAvatarUpload(file) {
    try {
      if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
        this.updateState({ error: 'Please select a valid image file (max 5MB)' });
        return;
      }

      this.updateState({ loading: true });
      const updatedUser = await this.model.uploadAvatar(file);
      this.updateState({ user: updatedUser });
    } catch (err) {
      console.error('Error uploading avatar:', err);
      this.updateState({ error: 'Failed to upload avatar. Please try again.' });
    } finally {
      this.updateState({ loading: false });
    }
  }

  // Handle edit post
  async handleEditPost(post) {
    try {
      this.updateState({
        editingPost: post.id || post._id,
        editContent: post.content,
        error: null
      });
    } catch (error) {
      console.error('Error setting up edit:', error);
      this.updateState({ error: 'Failed to setup edit mode.' });
    }
  }

  // Handle save edit
  async handleSaveEdit(postId, newContent) {
    try {
      this.updateState({ loading: true, error: null });

      const updatedPost = await this.model.updatePost(postId, newContent);

      // Update posts in state
      const updatedPosts = this.state.posts.map(post =>
        (post.id === postId || post._id === postId) ? updatedPost : post
      );

      this.updateState({
        posts: updatedPosts,
        editingPost: null,
        editContent: '',
        loading: false
      });

    } catch (error) {
      console.error('Error saving edit:', error);
      this.updateState({
        error: error.message || 'Failed to update post. Please try again.',
        loading: false
      });
    }
  }

  // Handle cancel edit
  handleCancelEdit() {
    this.updateState({
      editingPost: null,
      editContent: '',
      error: null
    });
  }

  // Handle delete post
  async handleDeletePost(post) {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');

      if (!confirmed) {
        return;
      }

      this.updateState({ loading: true, error: null });

      await this.model.deletePost(post.id || post._id);

      // Remove post from state
      const updatedPosts = this.state.posts.filter(p =>
        (p.id !== post.id && p._id !== post._id)
      );

      this.updateState({
        posts: updatedPosts,
        loading: false
      });

    } catch (error) {
      console.error('Error deleting post:', error);
      this.updateState({
        error: error.message || 'Failed to delete post. Please try again.',
        loading: false
      });
    }
  }

  // Update edit content
  updateEditContent(content) {
    this.updateState({ editContent: content });
  }

  // Update state
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.setState) {
      this.setState(this.state);
    }
  }

  // Set active tab with smart data fetching
  setActiveTab(tab) {
    const previousTab = this.state.activeTab;
    this.updateState({ activeTab: tab });

    // Only fetch data if tab actually changed and we don't have cached data
    if (previousTab !== tab) {
      // Clear error state when switching tabs
      this.updateState({ error: null });

      // Check if we need to fetch new data
      const needsFetch = this.shouldFetchDataForTab(tab);
      if (needsFetch) {
        this.fetchData();
      }
    }
  }

  // Helper to determine if we need to fetch data for a tab
  shouldFetchDataForTab(tab) {
    switch (tab) {
      case 'home':
        // Fetch if we don't have posts or they're old
        return !this.state.posts || this.state.posts.length === 0;
      case 'saved':
        // Always use current posts data, just filter client-side
        return false;
      case 'notifications':
        // Fetch if we don't have notifications
        return !this.state.notifications || this.state.notifications.length === 0;
      case 'profile':
        // Profile doesn't need additional data fetching
        return false;
      default:
        return true;
    }
  }

  // Update new post text
  updateNewPost(text) {
    this.updateState({ newPost: text });
  }

  // Update new comment text
  updateNewComment(text) {
    this.updateState({ newComment: text });
  }

  // Update inline comment text
  updateInlineComment(postId, text) {
    this.updateState({
      inlineComments: {
        ...this.state.inlineComments,
        [postId]: text
      }
    });
  }

  // Handle post creation with formatted data
  handlePost = async (postData) => {
    try {
      // Make sure boolean conversion is explicit
      const formattedData = {
        ...postData,
        isAnonymous: Boolean(postData.isAnonymous) // Explicitly convert to boolean
      };

      // Log to verify data
      console.log('Sending post data:', formattedData);
      
      await this.model.createPost(formattedData);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }
}

export default SafeSpacePresenter;