import { Home as HomeIcon, Bell, Bookmark, User, Lock } from 'lucide-react';

function NavigationTabs({ activeTab, unreadCount, isReadOnly, onTabChange }) {
  const handleTabClick = (tab) => {
    if (isReadOnly && (tab === 'saved' || tab === 'notifications' || tab === 'profile')) {
      // Show login prompt for authenticated-only tabs
      window.location.href = '/signin';
      return;
    }
    onTabChange(tab);
  };

  return (
    <div className="flex border-b border-[#4F3422] mb-6">
      <button
        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'home' ? 'text-[#251404] border-b-2 border-[#251404]' : 'text-[#4F3422] hover:text-[#251404]'}`}
        onClick={() => handleTabClick('home')}
      >
        <HomeIcon className="h-5 w-5 inline mr-1" />
        <span>Home</span>
      </button>

      <button
        className={`px-4 py-2 font-medium transition-colors relative ${
          isReadOnly
            ? 'text-[#4F3422]/60 cursor-not-allowed'
            : activeTab === 'saved'
              ? 'text-[#251404] border-b-2 border-[#251404]'
              : 'text-[#4F3422] hover:text-[#251404]'
        }`}
        onClick={() => handleTabClick('saved')}
        title={isReadOnly ? 'Login required' : ''}
      >
        <Bookmark className="h-5 w-5 inline mr-1" />
        <span>Saved</span>
        {isReadOnly && <Lock className="h-3 w-3 inline ml-1 text-[#4F3422]/60" />}
      </button>

      <button
        className={`px-4 py-2 font-medium relative transition-colors ${
          isReadOnly
            ? 'text-[#4F3422]/60 cursor-not-allowed'
            : activeTab === 'notifications'
              ? 'text-[#251404] border-b-2 border-[#251404]'
              : 'text-[#4F3422] hover:text-[#251404]'
        }`}
        onClick={() => handleTabClick('notifications')}
        title={isReadOnly ? 'Login required' : ''}
      >
        <Bell className="h-5 w-5 inline mr-1" />
        <span>Notifications</span>
        {isReadOnly && <Lock className="h-3 w-3 inline ml-1 text-[#4F3422]/60" />}
        {!isReadOnly && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <button
        className={`px-4 py-2 font-medium transition-colors relative ${
          isReadOnly
            ? 'text-[#4F3422]/60 cursor-not-allowed'
            : activeTab === 'profile'
              ? 'text-[#251404] border-b-2 border-[#251404]'
              : 'text-[#4F3422] hover:text-[#251404]'
        }`}
        onClick={() => handleTabClick('profile')}
        title={isReadOnly ? 'Login required' : ''}
      >
        <User className="h-5 w-5 inline mr-1" />
        <span>Profile</span>
        {isReadOnly && <Lock className="h-3 w-3 inline ml-1 text-[#4F3422]/60" />}
      </button>
    </div>
  );
}

export default NavigationTabs; 