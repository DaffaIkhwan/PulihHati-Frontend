class HomePresenter {
  constructor(model) {
    this.model = model;
    this.state = {
      moodHistory: [],
      selectedMood: null,
      showChart: false,
      loading: true,
      error: null,
      success: null,
      popularPosts: [],
      currentSlide: 0,
      currentQuote: 0
    };
    this.setState = null;
  }

  setStateUpdater(setState) {
    this.setState = setState;
  }

  async initialize() {
    console.log('Presenter: Initializing...');

    // Set loading false immediately to show UI faster
    this.updateState({
      loading: false,
      moodHistory: this.generateEmptyMoodHistory(),
      popularPosts: []
    });

    try {
      // Fetch data in background without blocking UI
      const [moodHistory, popularPosts] = await Promise.allSettled([
        this.fetchMoodHistory(),
        this.fetchPopularPosts()
      ]);

      console.log('Presenter: Data fetched successfully');
      this.updateState({
        moodHistory: moodHistory.status === 'fulfilled' ? moodHistory.value : this.generateEmptyMoodHistory(),
        popularPosts: popularPosts.status === 'fulfilled' ? popularPosts.value : []
      });
    } catch (error) {
      console.error('Presenter: Error during initialization:', error);
      // Don't show error for background loading failures
    }
  }

  // Helper function to get current WIB date consistently
  getWIBDate() {
    // Create a new date and convert to WIB timezone
    const now = new Date();
    const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // Add 7 hours for WIB
    return wibTime;
  }

  // Helper function to format date as YYYY-MM-DD in WIB
  formatWIBDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  generateEmptyMoodHistory() {
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const wibToday = this.getWIBDate();
    const todayStr = this.formatWIBDate(wibToday);
    const result = [];

    console.log(`🕐 Current WIB time: ${wibToday.toISOString()}`);
    console.log(`📅 Today's date (WIB): ${todayStr}`);

    // Generate 7 days with today on the RIGHT (index 6)
    // i=6 means 6 days ago (leftmost), i=0 means today (rightmost)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(wibToday);
      date.setUTCDate(date.getUTCDate() - i);

      const dateStr = this.formatWIBDate(date);
      const dayIndex = date.getUTCDay(); // 0=Sunday, 1=Monday, etc.
      const dayName = dayNames[dayIndex];
      const isToday = dateStr === todayStr;

      result.push({
        day: dayName,
        date: dateStr,
        mood: null,
        emoji: null,
        label: null,
        hasEntry: false,
        isToday: isToday
      });
    }

    // Debug: Log the order to verify today is at the end (rightmost)
    console.log('📊 Generated Empty Mood History Order:', result.map((r, idx) => `${idx}:${r.day}(${r.date.split('-')[2]})${r.isToday ? '👈TODAY' : ''}`).join(' → '));

    return result;
  }

  async fetchMoodHistory() {
    console.log('Presenter: Fetching mood history');

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      console.log('Presenter: User not authenticated, returning empty mood history');
      return this.generateEmptyMoodHistory();
    }

    try {
      const data = await this.model.getMoodHistory();
      return data && data.length > 0 ? data : this.generateEmptyMoodHistory();
    } catch (error) {
      console.error('Presenter: Error fetching mood history:', error);

      // If authentication error, clear token and return empty history
      if (error.message && error.message.includes('401')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      return this.generateEmptyMoodHistory();
    }
  }

  async fetchPopularPosts() {
    console.log('Presenter: Fetching popular posts');
    try {
      const posts = await this.model.getPopularPosts();
      return posts;
    } catch (error) {
      console.error('Presenter: Error fetching popular posts:', error);
      return [];
    }
  }

  async handleMoodSelect(moodId) {
    console.log('Presenter: Handling mood selection:', moodId);

    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      console.log('Presenter: User not authenticated, redirecting to login');
      window.location.href = '/signin';
      return;
    }

    this.updateState({ loading: true, error: null, success: null });

    try {
      // Use consistent WIB date calculation
      const wibToday = this.getWIBDate();
      const todayDate = this.formatWIBDate(wibToday);
      const todayDay = wibToday.getUTCDay();
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

      console.log(`🕐 Current WIB time: ${wibToday.toISOString()}`);
      console.log(`💾 Saving mood ${moodId} for date ${todayDate} (${dayNames[todayDay]})`);

      const saveResult = await this.model.saveMood(moodId, todayDate);
      console.log('💾 Mood save result:', saveResult);

      this.updateState({
        selectedMood: moodId,
        success: `Mood ${dayNames[todayDay]} berhasil disimpan!`
      });

      // Refresh mood history from backend to get updated data
      try {
        console.log('🔄 Refreshing mood history after save...');
        const updatedMoodHistory = await this.fetchMoodHistory();
        console.log('📊 Updated mood history received:', updatedMoodHistory?.map(item =>
          `${item.day}(${item.date?.split('-')[2]}): mood=${item.mood}, hasEntry=${item.hasEntry}, isToday=${item.isToday}`
        ));

        // Force state update to trigger re-render
        this.updateState({
          moodHistory: updatedMoodHistory,
          // Clear any previous error
          error: null
        });
        console.log('✅ Mood history refreshed successfully');

        // Additional debug: Log final state
        setTimeout(() => {
          console.log('📊 Final mood history state:', this.state.moodHistory?.map(item =>
            `${item.day}(${item.date?.split('-')[2]}): mood=${item.mood}, hasEntry=${item.hasEntry}, isToday=${item.isToday}`
          ));
        }, 100);

      } catch (refreshError) {
        console.error('❌ Failed to refresh mood history:', refreshError);
        // Fallback: Update local state if refresh fails
        const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const fallbackHistory = this.state.moodHistory.map(item => {
          if (item.date === todayDate) {
            return {
              ...item,
              mood: moodId,
              emoji: this.getMoodEmoji(moodId),
              label: this.getMoodLabel(moodId),
              hasEntry: true,
              isToday: true
            };
          }
          return item;
        });

        console.log('📊 Using fallback mood history:', fallbackHistory?.map(item =>
          `${item.day}(${item.date?.split('-')[2]}): mood=${item.mood}, hasEntry=${item.hasEntry}, isToday=${item.isToday}`
        ));

        this.updateState({
          moodHistory: fallbackHistory,
          error: null
        });
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.updateState({
          selectedMood: null,
          success: null
        });
      }, 3000);

    } catch (error) {
      console.error('Presenter: Error saving mood:', error);

      // Handle authentication errors
      if (error.message && (error.message.includes('401') || error.message.includes('Authentication'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
        return;
      }

      this.updateState({
        error: error.message || 'Gagal menyimpan mood'
      });
    } finally {
      this.updateState({ loading: false });
    }
  }

  getMoodEmoji(moodId) {
    const moodTypes = [
      { id: 1, emoji: '😊' },
      { id: 2, emoji: '🙂' },
      { id: 3, emoji: '😐' },
      { id: 4, emoji: '😔' },
      { id: 5, emoji: '😢' }
    ];
    const mood = moodTypes.find(m => m.id === moodId);
    return mood ? mood.emoji : '😐';
  }

  getMoodLabel(moodId) {
    const moodTypes = [
      { id: 1, label: 'Sangat Baik' },
      { id: 2, label: 'Baik' },
      { id: 3, label: 'Biasa' },
      { id: 4, label: 'Buruk' },
      { id: 5, label: 'Sangat Buruk' }
    ];
    const mood = moodTypes.find(m => m.id === moodId);
    return mood ? mood.label : 'Unknown';
  }

  getMoodColor(moodId) {
    const moodTypes = [
      { id: 1, color: '#22C55E' },  // Green - Sangat Baik
      { id: 2, color: '#10B981' },  // Emerald - Baik
      { id: 3, color: '#EAB308' },  // Yellow - Biasa
      { id: 4, color: '#F97316' },  // Orange - Buruk
      { id: 5, color: '#EF4444' }   // Red - Sangat Buruk
    ];
    const mood = moodTypes.find(m => m.id === moodId);
    return mood ? mood.color : '#6B7280';
  }

  async toggleChart() {
    console.log('Presenter: Toggling chart');
    const newShowChart = !this.state.showChart;

    // Update state to show/hide chart
    this.updateState({ showChart: newShowChart });

    // If showing chart and we don't have fresh mood data, fetch it
    if (newShowChart) {
      console.log('Presenter: Chart is being shown, fetching fresh mood history...');

      try {
        // Always fetch fresh mood history when showing chart
        const freshMoodHistory = await this.fetchMoodHistory();
        console.log('Presenter: Fresh mood history fetched:', freshMoodHistory?.map(item =>
          `${item.day}(${item.date?.split('-')[2]}): mood=${item.mood}, hasEntry=${item.hasEntry}, isToday=${item.isToday}`
        ));

        // Update state with fresh data
        this.updateState({
          moodHistory: freshMoodHistory,
          error: null // Clear any previous errors
        });
      } catch (error) {
        console.error('Presenter: Error fetching mood history for chart:', error);
        // Don't hide chart on error, just show error message
        this.updateState({
          error: 'Gagal memuat data mood. Silakan coba lagi.'
        });
      }
    }
  }

  nextSlide() {
    if (this.state.popularPosts.length === 0) return;
    console.log('Presenter: Next slide');
    this.updateState({
      currentSlide: (this.state.currentSlide + 1) % this.state.popularPosts.length
    });
  }

  prevSlide() {
    if (this.state.popularPosts.length === 0) return;
    console.log('Presenter: Previous slide');
    this.updateState({
      currentSlide: (this.state.currentSlide - 1 + this.state.popularPosts.length) % this.state.popularPosts.length
    });
  }

  setCurrentSlide(index) {
    if (index >= 0 && index < this.state.popularPosts.length) {
      console.log('Presenter: Setting current slide to', index);
      this.updateState({ currentSlide: index });
    }
  }

  nextQuote() {
    console.log('Presenter: Next quote');
    this.updateState({
      currentQuote: (this.state.currentQuote + 1) % 5
    });
  }

  prevQuote() {
    console.log('Presenter: Previous quote');
    this.updateState({
      currentQuote: (this.state.currentQuote - 1 + 5) % 5
    });
  }

  setCurrentQuote(index) {
    if (index >= 0 && index < 5) {
      console.log('Presenter: Setting current quote to', index);
      this.updateState({ currentQuote: index });
    }
  }

  updateState(newState) {
    console.log('Presenter: Updating state with:', newState);
    this.state = { ...this.state, ...newState };
    if (this.setState) {
      this.setState(newState); // Pass newState directly to trigger React update
    }
  }
}

export default HomePresenter; 