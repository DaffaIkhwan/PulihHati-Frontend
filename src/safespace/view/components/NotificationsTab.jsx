import { Bell, Heart, MessageCircle, Bookmark } from 'lucide-react';

function NotificationsTab({
  notifications,
  loading,
  unreadCount,
  processingNotification,
  onMarkAllAsRead,
  onNotificationClick
}) {
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

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  return (
    <div className="space-y-6">
      {/* Notifications Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">Notifications</h2>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
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
              onClick={() => onNotificationClick(notification)}
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
                      {notification.actor?.avatar ? (
                        <img
                          src={notification.actor.avatar}
                          alt={notification.actor.name}
                          className="h-8 w-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full mr-2 bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-xs">
                          {getInitials(notification.actor?.name)}
                        </div>
                      )}
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
  );
}

export default NotificationsTab; 