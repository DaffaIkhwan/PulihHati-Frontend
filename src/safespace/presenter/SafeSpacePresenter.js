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
      processingNotification: null,
      // Infinite scroll state
      currentPage: 1,
      hasMorePosts: true,
      loadingMore: false,
      // Comment submission tracking
      commentSubmitting: {}, // Track comment submission state per post
      submittingComment: false // Track modal comment submission
    };
    this.setState = null;

    // Track ongoing requests to prevent duplicates
    this.ongoingRequests = new Set();
  }

  setStateUpdater(setState) {
    this.setState = setState;
  }

  // Initialize the presenter with performance optimizations
  async initialize() {
    // Reset pagination state
    this.resetPagination();

    // Check if we have cached data first
    const cachedData = this.getCachedData();
    if (cachedData) {
      console.log('Using cached data for faster loading');
      this.updateState(cachedData);
    }

    try {
      // Always fetch posts first (works for both authenticated and non-authenticated users)
      console.log('Fetching posts data...');
      const postsData = await this.fetchDataOptimized(1, false);

      // Check if there are more posts
      const hasMore = await this.model.hasMorePosts(1);

      // Check if user is authenticated for additional data
      const isAuthenticated = this.model.isAuthenticated();
      console.log('User authenticated:', isAuthenticated);

      let userData = null;
      let notificationData = 0;

      if (isAuthenticated) {
        try {
          // Fetch user data and notifications only if authenticated
          console.log('Fetching user data and notifications...');
          const [userResult, notificationResult] = await Promise.all([
            this.fetchUserDataOptimized(),
            this.fetchNotificationCountOptimized()
          ]);
          userData = userResult;
          notificationData = notificationResult;
        } catch (authError) {
          console.error('Error fetching authenticated data:', authError);
          // If auth data fails, continue with posts only (read-only mode)
          console.log('Continuing in read-only mode due to auth error');
        }
      } else {
        console.log('User not authenticated, using read-only mode');
      }

      // Update state with available data
      this.updateState({
        user: userData,
        unreadCount: notificationData,
        posts: postsData,
        loading: false,
        hasMorePosts: hasMore
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
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });

      // Provide more specific error messages based on error type
      let errorMessage = 'Failed to load data. Please try again.';

      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please login to access SafeSpace.';
      } else if (error.response?.status === 404) {
        errorMessage = 'SafeSpace service not found. Please try again later.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error occurred. Please try again in a moment.';
      } else if (error.message && (
        error.message.includes('Cannot connect to server') ||
        error.message.includes('Failed to fetch posts') ||
        error.message.includes('endpoint not found')
      )) {
        errorMessage = 'Unable to load posts. Please check your connection and try again.';
      }

      this.updateState({
        loading: false,
        error: errorMessage,
        posts: [] // Ensure posts is empty array instead of undefined
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
      // Check if user is authenticated first
      if (!this.model.isAuthenticated()) {
        console.log('User not authenticated, skipping user data fetch');
        return null;
      }

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
      // Return null instead of throwing for non-authenticated users
      return null;
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
      // Check if user is authenticated first
      if (!this.model.isAuthenticated()) {
        console.log('User not authenticated, skipping notifications fetch');
        return 0;
      }

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

      // Check if it's an authentication error that should show login prompt
      if (err.message && err.message.includes('Authentication required') && !this.model.isAuthenticated()) {
        this.updateState({
          error: 'Authentication required. Please login to access SafeSpace features.',
          requiresAuth: true
        });
      } else {
        this.updateState({
          error: this.state.activeTab === 'notifications'
            ? 'Failed to fetch notifications. Please try again later.'
            : 'Failed to fetch posts. Please try again later.'
        });
      }
    } finally {
      this.updateState({ loading: false });
    }
  }

  // Optimized data fetch with caching and smart loading
  async fetchDataOptimized(page = 1, append = false) {
    try {
      // For non-home tabs, use existing logic
      if (this.state.activeTab === 'saved') {
        const data = await this.model.getBookmarkedPosts();
        return Array.isArray(data) ? data : [];
      } else if (this.state.activeTab === 'notifications') {
        const data = await this.model.getNotifications();
        return Array.isArray(data) ? data : [];
      }

      // For home tab, handle pagination
      console.log(`Fetching posts from model... (page: ${page}, append: ${append})`);
      const data = await this.model.getPosts(page, 10, append);
      console.log('Model returned data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));

      // Process and return data
      if (!data) {
        console.log('No data returned');
        return [];
      } else if (Array.isArray(data)) {
        console.log('Data is array, returning directly');
        return data;
      } else if (data.posts && Array.isArray(data.posts)) {
        console.log('Data has posts array, returning posts');
        return data.posts;
      } else if (typeof data === 'object') {
        console.log('Data is object, wrapping in array');
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

  // Load more posts for infinite scroll
  async loadMorePosts() {
    if (this.state.loadingMore || !this.state.hasMorePosts || this.state.activeTab !== 'home') {
      console.log('Skipping load more:', {
        loadingMore: this.state.loadingMore,
        hasMorePosts: this.state.hasMorePosts,
        activeTab: this.state.activeTab
      });
      return;
    }

    // Clear any previous errors
    this.updateState({ loadingMore: true, error: null });

    try {
      const nextPage = this.state.currentPage + 1;
      console.log(`Loading more posts... page ${nextPage}`);

      // Fetch new posts and append to existing ones
      const allPosts = await this.fetchDataOptimized(nextPage, true);

      // Validate that we got posts
      if (!Array.isArray(allPosts)) {
        throw new Error('Invalid response format from server');
      }

      // Check if we have more posts after this page
      const hasMore = await this.model.hasMorePosts(nextPage);

      this.updateState({
        posts: allPosts,
        currentPage: nextPage,
        hasMorePosts: hasMore,
        loadingMore: false,
        error: null
      });

      console.log(`Loaded page ${nextPage}, hasMore: ${hasMore}, total posts: ${allPosts.length}`);
    } catch (error) {
      console.error('Error loading more posts:', error);

      // Provide specific error messages based on error type
      let errorMessage = 'Failed to load more posts. Please try again.';

      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again in a moment.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Posts endpoint not found. Please refresh the page.';
      } else if (error.message.includes('Invalid response format')) {
        errorMessage = 'Received invalid data from server. Please refresh the page.';
      }

      this.updateState({
        loadingMore: false,
        error: errorMessage
      });

      // Re-throw error so InfiniteScroll component can handle retry logic
      throw new Error(errorMessage);
    }
  }

  // Reset pagination when switching tabs or refreshing
  resetPagination() {
    this.updateState({
      currentPage: 1,
      hasMorePosts: true,
      loadingMore: false
    });
    // Clear posts cache to force fresh data
    this.model.clearPostsCache();
  }

  // Handle new post creation
  async handleNewPost(e, is_anonymous) {
    e.preventDefault();
    if (!this.state.newPost.trim()) return;

    // Check if user is authenticated
    if (!this.model.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/signin';
      return;
    }

    this.updateState({ loading: true });
    try {
      const createdPost = await this.model.createPost(this.state.newPost, is_anonymous);
      this.updateState({
        posts: [createdPost, ...this.state.posts],
        newPost: ''
      });
    } catch (err) {
      console.error('Error creating post:', err);
      // If error is due to authentication, redirect to login
      if (err.message.includes('401') || err.message.includes('unauthorized') || err.message.includes('Not authorized')) {
        window.location.href = '/signin';
        return;
      }
      this.updateState({ error: 'Failed to create post. Please try again.' });
    } finally {
      this.updateState({ loading: false });
    }
  }

  // Handle post like
  async toggleLike(postId) {
    // Check if user is authenticated
    if (!this.model.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/signin';
      return;
    }

    // Store original post state for rollback on error
    const originalPost = this.state.posts.find(post => post._id === postId || post.id === postId);
    if (!originalPost) {
      console.error('Post not found for like action');
      return;
    }

    // Optimistic update - immediately update UI
    const optimisticUpdate = {
      ...originalPost,
      liked: !originalPost.liked,
      likes_count: originalPost.liked
        ? (originalPost.likes_count || 0) - 1
        : (originalPost.likes_count || 0) + 1
    };

    this.updateState({
      posts: this.state.posts.map(post =>
        (post._id === postId || post.id === postId) ? optimisticUpdate : post
      ),
      selectedPost: this.state.selectedPost && (this.state.selectedPost._id === postId || this.state.selectedPost.id === postId)
        ? optimisticUpdate
        : this.state.selectedPost
    });

    try {
      console.log('Liking post:', postId);
      const response = await this.model.likePost(postId);
      console.log('Like response:', response);

      // Update with actual server response
      this.updateState({
        posts: this.state.posts.map(post => {
          if (post._id === postId || post.id === postId) {
            return {
              ...post,
              likes: response.likes || response,
              likes_count: response.likes_count || (response.likes ? response.likes.length : 0),
              liked: response.liked !== undefined ? response.liked : !originalPost.liked
            };
          }
          return post;
        }),
        selectedPost: this.state.selectedPost && (this.state.selectedPost._id === postId || this.state.selectedPost.id === postId)
          ? {
              ...this.state.selectedPost,
              likes: response.likes || response,
              likes_count: response.likes_count || (response.likes ? response.likes.length : 0),
              liked: response.liked !== undefined ? response.liked : !originalPost.liked
            }
          : this.state.selectedPost,
        error: null // Clear any previous errors
      });
    } catch (err) {
      console.error('Error liking post:', err);

      // Rollback optimistic update
      this.updateState({
        posts: this.state.posts.map(post =>
          (post._id === postId || post.id === postId) ? originalPost : post
        ),
        selectedPost: this.state.selectedPost && (this.state.selectedPost._id === postId || this.state.selectedPost.id === postId)
          ? originalPost
          : this.state.selectedPost
      });

      // Handle specific error types
      if (err.message.includes('401') || err.message.includes('unauthorized') || err.message.includes('Not authorized')) {
        window.location.href = '/signin';
        return;
      }

      // Provide specific error messages
      let errorMessage = 'Failed to like post. Please try again.';
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again in a moment.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Post not found. Please refresh the page.';
      }

      this.updateState({ error: errorMessage });

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        this.updateState({ error: null });
      }, 5000);
    }
  }

  // Handle bookmark
  async handleBookmark(postId) {
    // Check if user is authenticated
    if (!this.model.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/signin';
      return;
    }

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
      // If error is due to authentication, redirect to login
      if (err.message.includes('401') || err.message.includes('unauthorized') || err.message.includes('Not authorized')) {
        window.location.href = '/signin';
        return;
      }
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
    // Check if user is authenticated
    if (!this.model.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/signin';
      return;
    }

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

    // Check if user is authenticated
    if (!this.model.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/signin';
      return;
    }

    // Prevent duplicate submissions
    if (this.state.submittingComment) {
      console.log('Comment submission already in progress');
      return;
    }

    const postId = this.state.selectedPost._id || this.state.selectedPost.id;
    const commentContent = this.state.newComment.trim();
    const requestKey = `modal_comment_${postId}_${commentContent}`;

    // Check if this exact request is already in progress
    if (this.ongoingRequests.has(requestKey)) {
      console.log('Duplicate comment request detected, ignoring');
      return;
    }

    this.updateState({ submittingComment: true });
    this.ongoingRequests.add(requestKey);

    try {
      const updatedComments = await this.model.addComment(postId, commentContent);

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
        newComment: '',
        submittingComment: false
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      // If error is due to authentication, redirect to login
      if (err.message.includes('401') || err.message.includes('unauthorized') || err.message.includes('Not authorized')) {
        window.location.href = '/signin';
        return;
      }
      this.updateState({
        error: 'Failed to add comment. Please try again.',
        submittingComment: false
      });
    } finally {
      // Remove request from ongoing set after a delay to prevent rapid resubmission
      setTimeout(() => {
        this.ongoingRequests.delete(requestKey);
      }, 1000);
    }
  }

  // Handle inline comment
  async handleInlineComment(e, postId) {
    e.preventDefault();
    const commentText = this.state.inlineComments[postId];
    if (!commentText?.trim()) return;

    // Check if user is authenticated
    if (!this.model.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/signin';
      return;
    }

    // Prevent duplicate submissions for this specific post
    if (this.state.commentSubmitting[postId]) {
      console.log(`Comment submission already in progress for post ${postId}`);
      return;
    }

    const commentContent = commentText.trim();
    const requestKey = `inline_comment_${postId}_${commentContent}`;

    // Check if this exact request is already in progress
    if (this.ongoingRequests.has(requestKey)) {
      console.log('Duplicate inline comment request detected, ignoring');
      return;
    }

    // Set submitting state for this specific post
    this.updateState({
      commentSubmitting: {
        ...this.state.commentSubmitting,
        [postId]: true
      }
    });
    this.ongoingRequests.add(requestKey);

    try {
      const updatedComments = await this.model.addComment(postId, commentContent);

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
        },
        commentSubmitting: {
          ...this.state.commentSubmitting,
          [postId]: false
        }
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      // If error is due to authentication, redirect to login
      if (err.message.includes('401') || err.message.includes('unauthorized') || err.message.includes('Not authorized')) {
        window.location.href = '/signin';
        return;
      }
      this.updateState({
        error: 'Failed to add comment. Please try again.',
        commentSubmitting: {
          ...this.state.commentSubmitting,
          [postId]: false
        }
      });
    } finally {
      // Remove request from ongoing set after a delay to prevent rapid resubmission
      setTimeout(() => {
        this.ongoingRequests.delete(requestKey);
      }, 1000);
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

  // Handle edit comment
  async handleEditComment(commentId, newContent) {
    try {
      this.updateState({ loading: true, error: null });

      const updatedComment = await this.model.updateComment(commentId, newContent);

      // Update the comment in posts state
      const updatedPosts = this.state.posts.map(post => {
        if (Array.isArray(post.comments)) {
          const updatedComments = post.comments.map(comment =>
            (comment.id === commentId || comment._id === commentId) ? updatedComment : comment
          );
          return { ...post, comments: updatedComments };
        }
        return post;
      });

      // Also update selectedPost if it contains the edited comment
      let updatedSelectedPost = this.state.selectedPost;
      if (updatedSelectedPost && Array.isArray(updatedSelectedPost.comments)) {
        const updatedSelectedComments = updatedSelectedPost.comments.map(comment =>
          (comment.id === commentId || comment._id === commentId) ? updatedComment : comment
        );
        updatedSelectedPost = { ...updatedSelectedPost, comments: updatedSelectedComments };
      }

      this.updateState({
        posts: updatedPosts,
        selectedPost: updatedSelectedPost,
        loading: false
      });

      return updatedComment;
    } catch (error) {
      console.error('Error editing comment:', error);
      this.updateState({
        error: error.message || 'Failed to edit comment. Please try again.',
        loading: false
      });
      throw error;
    }
  }

  // Handle delete comment
  async handleDeleteComment(commentId) {
    try {
      this.updateState({ loading: true, error: null });

      await this.model.deleteComment(commentId);

      // Remove the comment from posts state
      const updatedPosts = this.state.posts.map(post => {
        if (Array.isArray(post.comments)) {
          const filteredComments = post.comments.filter(comment =>
            comment.id !== commentId && comment._id !== commentId
          );
          return {
            ...post,
            comments: filteredComments,
            comments_count: Math.max(0, (post.comments_count || 0) - 1)
          };
        }
        return post;
      });

      // Also update selectedPost if it contains the deleted comment
      let updatedSelectedPost = this.state.selectedPost;
      if (updatedSelectedPost && Array.isArray(updatedSelectedPost.comments)) {
        const filteredSelectedComments = updatedSelectedPost.comments.filter(comment =>
          comment.id !== commentId && comment._id !== commentId
        );
        updatedSelectedPost = {
          ...updatedSelectedPost,
          comments: filteredSelectedComments,
          comments_count: Math.max(0, (updatedSelectedPost.comments_count || 0) - 1)
        };
      }

      this.updateState({
        posts: updatedPosts,
        selectedPost: updatedSelectedPost,
        loading: false
      });

    } catch (error) {
      console.error('Error deleting comment:', error);
      this.updateState({
        error: error.message || 'Failed to delete comment. Please try again.',
        loading: false
      });
      throw error;
    }
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

      // Reset pagination when switching to home tab
      if (tab === 'home') {
        this.resetPagination();
      }

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