import { Home as HomeIcon, Bell, Bookmark, User } from 'lucide-react';

function NavigationTabs({ activeTab, unreadCount, onTabChange }) {
  return (
    <div className="flex border-b border-stone-300 mb-6">
      <button
        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'home' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
        onClick={() => onTabChange('home')}
      >
        <HomeIcon className="h-5 w-5 inline mr-1" />
        <span>Home</span>
      </button>
      <button
        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'saved' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
        onClick={() => onTabChange('saved')}
      >
        <Bookmark className="h-5 w-5 inline mr-1" />
        <span>Saved</span>
      </button>
      <button
        className={`px-4 py-2 font-medium relative transition-colors ${activeTab === 'notifications' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
        onClick={() => onTabChange('notifications')}
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
        onClick={() => onTabChange('profile')}
      >
        <User className="h-5 w-5 inline mr-1" />
        <span>Profile</span>
      </button>
    </div>
  );
}

export default NavigationTabs; 