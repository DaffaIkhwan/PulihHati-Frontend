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
    try {
      // Fetch mood history and popular posts in parallel
      const [moodHistory, popularPosts] = await Promise.all([
        this.fetchMoodHistory(),
        this.fetchPopularPosts()
      ]);

      console.log('Presenter: Data fetched successfully');
      this.updateState({
        moodHistory,
        popularPosts,
        loading: false
      });
    } catch (error) {
      console.error('Presenter: Error during initialization:', error);
      this.updateState({
        loading: false,
        error: error.message || 'Gagal memuat data'
      });
      throw error; // Re-throw to be caught by the view
    }
  }

  generateEmptyMoodHistory() {
    console.log('Presenter: Generating empty mood history');
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayIndex = date.getDay();
      const dayName = dayNames[dayIndex];

      result.push({
        day: dayName,
        date: dateStr,
        mood: null,
        emoji: null,
        label: null,
        hasEntry: false
      });
    }

    return result;
  }

  async fetchMoodHistory() {
    console.log('Presenter: Fetching mood history');
    try {
      const data = await this.model.getMoodHistory();
      return data && data.length > 0 ? data : this.generateEmptyMoodHistory();
    } catch (error) {
      console.error('Presenter: Error fetching mood history:', error);
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
    this.updateState({ loading: true, error: null, success: null });

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayDate = `${year}-${month}-${day}`;

      const todayDay = now.getDay();
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

      await this.model.saveMood(moodId, todayDate);

      this.updateState({
        selectedMood: moodId,
        success: `Mood ${dayNames[todayDay]} berhasil disimpan!`
      });

      // Update mood history
      const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const todayShort = dayNamesShort[todayDay];

      this.updateState({
        moodHistory: this.state.moodHistory.map(item => {
          if (item.day === todayShort) {
            return {
              ...item,
              mood: moodId,
              emoji: this.getMoodEmoji(moodId),
              label: this.getMoodLabel(moodId),
              hasEntry: true
            };
          }
          return item;
        })
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.updateState({
          selectedMood: null,
          success: null
        });
      }, 3000);

    } catch (error) {
      console.error('Presenter: Error saving mood:', error);
      this.updateState({
        error: error.message || 'Gagal menyimpan mood'
      });
    } finally {
      this.updateState({ loading: false });
    }
  }

  getMoodEmoji(moodId) {
    const moodTypes = [
      { id: 1, emoji: '😢' },
      { id: 2, emoji: '😟' },
      { id: 3, emoji: '😐' },
      { id: 4, emoji: '😊' },
      { id: 5, emoji: '😄' }
    ];
    const mood = moodTypes.find(m => m.id === moodId);
    return mood ? mood.emoji : '😐';
  }

  getMoodLabel(moodId) {
    const moodTypes = [
      { id: 1, label: 'Sedih' },
      { id: 2, label: 'Cemas' },
      { id: 3, label: 'Netral' },
      { id: 4, label: 'Senang' },
      { id: 5, label: 'Sangat Bahagia' }
    ];
    const mood = moodTypes.find(m => m.id === moodId);
    return mood ? mood.label : 'Unknown';
  }

  getMoodColor(moodId) {
    const moodTypes = [
      { id: 1, color: '#3B82F6' },
      { id: 2, color: '#F59E0B' },
      { id: 3, color: '#6B7280' },
      { id: 4, color: '#10B981' },
      { id: 5, color: '#EC4899' }
    ];
    const mood = moodTypes.find(m => m.id === moodId);
    return mood ? mood.color : '#6B7280';
  }

  toggleChart() {
    console.log('Presenter: Toggling chart');
    this.updateState({ showChart: !this.state.showChart });
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
      this.setState(this.state);
    }
  }
}

export default HomePresenter; 