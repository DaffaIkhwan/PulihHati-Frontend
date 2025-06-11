import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useMemo } from 'react';
import NavigationTabs from './components/NavigationTabs';
import HomeTab from './components/HomeTab';
import ProfileTab from './components/ProfileTab';
import NotificationsTab from './components/NotificationsTab';
import PostModal from './components/PostModal';
import EditPostModal from './components/EditPostModal';
import DeletePostModal from './components/DeletePostModal';
import StylishLoginPrompt from '../../components/StylishLoginPrompt';

function SafeSpaceView({ presenter }) {
  const [state, setState] = useState({
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
    editingPost: null,
    editContent: '',
    showEditModal: false,
    showDeleteModal: false,
    postToEdit: null,
    postToDelete: null,
    editLoading: false,
    deleteLoading: false
  });

  // Memoize presenter initialization to prevent unnecessary re-initializations
  const initializePresenter = useCallback(() => {
    presenter.setStateUpdater(setState);
    presenter.initialize();
  }, [presenter]);

  useEffect(() => {
    initializePresenter();
  }, [initializePresenter]);

  const {
    activeTab,
    posts,
    loading,
    error,
    newPost,
    newComment,
    selectedPost,
    user,
    bookmarkAnimations,
    inlineComments,
    notifications,
    unreadCount,
    processingNotification,
    editingPost,
    editContent,
    showEditModal,
    showDeleteModal,
    postToEdit,
    postToDelete,
    editLoading,
    deleteLoading,
    hasMorePosts,
    loadingMore
  } = state;

  // Memoize handler functions to prevent unnecessary re-renders
  const handleTabChange = useCallback((tab) => {
    presenter.setActiveTab(tab);
  }, [presenter]);

  const handleNewPost = useCallback((e, is_anonymous) => {
    presenter.handleNewPost(e, !!is_anonymous);
  }, [presenter]);

  const handleNewPostChange = useCallback((text) => {
    presenter.updateNewPost(text);
  }, [presenter]);

  const handleLike = useCallback((postId) => {
    presenter.toggleLike(postId);
  }, [presenter]);

  const handleBookmark = useCallback((postId) => {
    presenter.handleBookmark(postId);
  }, [presenter]);

  const handleCommentClick = useCallback((post) => {
    presenter.openCommentModal(post);
  }, [presenter]);

  const handleInlineComment = useCallback((e, postId) => {
    presenter.handleInlineComment(e, postId);
  }, [presenter]);

  const handleInlineCommentChange = useCallback((postId, text) => {
    presenter.updateInlineComment(postId, text);
  }, [presenter]);

  const handleAvatarUpload = useCallback((file) => {
    presenter.handleAvatarUpload(file);
  }, [presenter]);

  const handleMarkAllAsRead = useCallback(() => {
    presenter.handleMarkAllAsRead();
  }, [presenter]);

  const handleNotificationClick = useCallback((notification) => {
    presenter.handleNotificationClick(notification);
  }, [presenter]);

  const handleCloseModal = useCallback(() => {
    presenter.closeCommentModal();
  }, [presenter]);

  const handleNewComment = useCallback((e) => {
    presenter.handleNewComment(e);
  }, [presenter]);

  const handleNewCommentChange = useCallback((text) => {
    presenter.updateNewComment(text);
  }, [presenter]);

  const handleEditPost = useCallback((post) => {
    setState(prev => ({
      ...prev,
      showEditModal: true,
      postToEdit: post
    }));
  }, []);

  const handleSaveEdit = useCallback(async (postId, newContent) => {
    setState(prev => ({ ...prev, editLoading: true }));
    try {
      await presenter.handleSaveEdit(postId, newContent);
      setState(prev => ({
        ...prev,
        showEditModal: false,
        postToEdit: null,
        editLoading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, editLoading: false }));
      throw error;
    }
  }, [presenter]);

  const handleCancelEdit = useCallback(() => {
    setState(prev => ({
      ...prev,
      showEditModal: false,
      postToEdit: null,
      editLoading: false
    }));
  }, []);

  const handleDeletePost = useCallback((post) => {
    setState(prev => ({
      ...prev,
      showDeleteModal: true,
      postToDelete: post
    }));
  }, []);

  const handleConfirmDelete = useCallback(async (post) => {
    setState(prev => ({ ...prev, deleteLoading: true }));
    try {
      await presenter.handleDeletePost(post);
      setState(prev => ({
        ...prev,
        showDeleteModal: false,
        postToDelete: null,
        deleteLoading: false
      }));
    } catch (error) {
      setState(prev => ({ ...prev, deleteLoading: false }));
      throw error;
    }
  }, [presenter]);

  const handleCancelDelete = useCallback(() => {
    setState(prev => ({
      ...prev,
      showDeleteModal: false,
      postToDelete: null,
      deleteLoading: false
    }));
  }, []);



  // Memoize filtered posts to prevent unnecessary recalculations
  const filteredPosts = useMemo(() => {
    if (activeTab === 'saved') {
      return posts.filter(post => post.bookmarked);
    }
    return posts;
  }, [posts, activeTab]);



  // Check if authentication is required (only show login prompt for specific auth errors)
  if (state.requiresAuth && error && error.includes('Authentication required')) {
    return <StylishLoginPrompt message="Silahkan login untuk mengakses SafeSpace" />;
  }

  // Check if we're in read-only mode
  const isReadOnly = !presenter.model?.isAuthenticated();
  const showReadOnlyBanner = isReadOnly && !loading;

  return (
    <div className="min-h-screen bg-[#A1BA82] pt-20">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <NavigationTabs
          activeTab={activeTab}
          unreadCount={unreadCount}
          isReadOnly={isReadOnly}
          onTabChange={handleTabChange}
        />

        <main>


          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium">Error: </span>
                  <span>{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Read-only mode banner */}
          {showReadOnlyBanner && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Mode Baca Saja - Login untuk berinteraksi dengan posts</span>
              </div>
              <button
                onClick={() => window.location.href = '/signin'}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                Login
              </button>
            </div>
          )}

          {error && !error.includes('Please login') && !error.includes('Authentication required') && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {(activeTab === 'home' || activeTab === 'saved') && (
            <HomeTab
              activeTab={activeTab}
              posts={filteredPosts}
              loading={loading}
              newPost={newPost}
              user={user}
              bookmarkAnimations={bookmarkAnimations}
              inlineComments={inlineComments}
              editingPost={editingPost}
              editContent={editContent}
              isReadOnly={isReadOnly}
              hasMorePosts={hasMorePosts}
              loadingMore={loadingMore}
              onNewPost={handleNewPost}
              onNewPostChange={handleNewPostChange}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onCommentClick={handleCommentClick}
              onInlineComment={handleInlineComment}
              onInlineCommentChange={handleInlineCommentChange}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onLoadMore={() => presenter.loadMorePosts()}
              getRecentComments={(comments) => presenter.getRecentComments(comments)}
            />
          )}

          {activeTab === 'profile' && !loading && (
            <ProfileTab
              user={user}
              posts={posts}
              onAvatarUpload={handleAvatarUpload}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              loading={loading}
              unreadCount={unreadCount}
              processingNotification={processingNotification}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNotificationClick={handleNotificationClick}
            />
          )}
        </main>
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          user={user}
          newComment={newComment}
          onClose={handleCloseModal}
          onNewComment={handleNewComment}
          onNewCommentChange={handleNewCommentChange}
        />
      )}

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={handleCancelEdit}
        post={postToEdit}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Delete Post Modal */}
      <DeletePostModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        post={postToDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

SafeSpaceView.propTypes = {
  presenter: PropTypes.shape({
    model: PropTypes.shape({
      isAuthenticated: PropTypes.func.isRequired
    }),
    setStateUpdater: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    handleNewPost: PropTypes.func.isRequired,
    updateNewPost: PropTypes.func.isRequired,
    toggleLike: PropTypes.func.isRequired,
    handleBookmark: PropTypes.func.isRequired,
    openCommentModal: PropTypes.func.isRequired,
    handleInlineComment: PropTypes.func.isRequired,
    updateInlineComment: PropTypes.func.isRequired,
    getRecentComments: PropTypes.func.isRequired,
    handleAvatarUpload: PropTypes.func.isRequired,
    handleMarkAllAsRead: PropTypes.func.isRequired,
    handleNotificationClick: PropTypes.func.isRequired,
    closeCommentModal: PropTypes.func.isRequired,
    handleNewComment: PropTypes.func.isRequired,
    updateNewComment: PropTypes.func.isRequired,
    handleEditPost: PropTypes.func.isRequired,
    handleSaveEdit: PropTypes.func.isRequired,
    handleCancelEdit: PropTypes.func.isRequired,
    handleDeletePost: PropTypes.func.isRequired,
    updateEditContent: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired
  }).isRequired
};

export default SafeSpaceView;