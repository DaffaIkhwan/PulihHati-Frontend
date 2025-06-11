import api from '../../utils/api';

class ChatbotModel {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Send message to chatbot API
  async sendMessage(message) {
    try {
      const response = await api.post('/chatbot', { message });
      return response.data.reply || 'Maaf, saya tidak mengerti.';
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw new Error(error.response?.data?.message || 'Ups, terjadi kesalahan. Coba lagi ya!');
    }
  }

  // Get chat history (if implemented in backend)
  async getChatHistory() {
    try {
      const cacheKey = 'chat_history';

      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      const response = await api.get('/chatbot/history');
      const history = response.data;

      // Cache the result
      this.cache.set(cacheKey, {
        data: history,
        timestamp: Date.now()
      });

      return history;
    } catch (error) {
      console.error('Error getting chat history:', error);
      // Return empty array if history is not available (e.g., no authentication or endpoint not implemented)
      return [];
    }
  }

  // Save chat history (if implemented in backend)
  async saveChatHistory(messages) {
    try {
      await api.post('/chatbot/history', { messages });

      // Clear cache after saving
      this.clearCache('chat_history');

      return true;
    } catch (error) {
      console.error('Error saving chat history:', error);
      // Silently fail if history saving is not available (e.g., no authentication or endpoint not implemented)
      return false;
    }
  }

  // Clear specific cache or all cache
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Format time helper
  formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  // Generate message ID
  generateMessageId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Create message object
  createMessage(text, sender = 'user', isRead = false) {
    return {
      id: this.generateMessageId(),
      text,
      sender,
      timestamp: new Date(),
      isRead
    };
  }

  // Get initial bot message
  getInitialMessage() {
    return this.createMessage(
      "Hai,😊 selamat datang di Pulih Hati",
      'bot',
      true
    );
  }
}

export default ChatbotModel;
