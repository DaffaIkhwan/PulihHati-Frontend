import ChatbotModel from '../model/ChatbotModel';

class ChatbotPresenter {
  constructor() {
    this.model = new ChatbotModel();
    this.view = null;
    this.state = {
      messages: [this.model.getInitialMessage()],
      inputText: '',
      isTyping: false,
      loading: false,
      error: null
    };
  }

  // Set view reference
  setView(view) {
    this.view = view;
  }

  // Update state and notify view
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.view) {
      this.view.setState(this.state);
    }
  }

  // Initialize chatbot
  async initialize() {
    try {
      this.updateState({ loading: true, error: null });
      
      // Try to load chat history
      const history = await this.model.getChatHistory();
      
      if (history && history.length > 0) {
        this.updateState({ 
          messages: history,
          loading: false 
        });
      } else {
        this.updateState({ loading: false });
      }
    } catch (error) {
      console.error('Error initializing chatbot:', error);
      this.updateState({ 
        error: 'Failed to load chat history',
        loading: false 
      });
    }
  }

  // Handle input text change
  handleInputChange(text) {
    this.updateState({ inputText: text, error: null });
  }

  // Handle send message
  async handleSendMessage() {
    const { inputText, messages } = this.state;
    
    if (!inputText.trim()) {
      return;
    }

    try {
      // Create user message
      const userMessage = this.model.createMessage(inputText, 'user', false);
      
      // Add user message to state
      const updatedMessages = [...messages, userMessage];
      this.updateState({
        messages: updatedMessages,
        inputText: '',
        isTyping: true,
        error: null
      });

      // Send message to backend
      const botReplyText = await this.model.sendMessage(inputText);

      // Create bot message
      const botMessage = this.model.createMessage(botReplyText, 'bot', true);

      // Add bot message to state
      const finalMessages = [...updatedMessages, botMessage];
      this.updateState({
        messages: finalMessages,
        isTyping: false
      });

      // Save chat history (optional)
      this.model.saveChatHistory(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      this.updateState({
        error: error.message || 'Failed to send message. Please try again.',
        isTyping: false
      });
    }
  }

  // Handle key press
  handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSendMessage();
    }
  }

  // Clear error
  clearError() {
    this.updateState({ error: null });
  }

  // Clear chat history
  async clearChatHistory() {
    try {
      const confirmed = window.confirm('Are you sure you want to clear chat history? This action cannot be undone.');
      
      if (!confirmed) {
        return;
      }

      this.updateState({ loading: true });
      
      // Clear from backend if implemented
      await this.model.saveChatHistory([]);
      
      // Reset to initial state
      this.updateState({
        messages: [this.model.getInitialMessage()],
        inputText: '',
        isTyping: false,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error clearing chat history:', error);
      this.updateState({
        error: 'Failed to clear chat history',
        loading: false
      });
    }
  }

  // Get formatted time
  getFormattedTime(date) {
    return this.model.formatTime(date);
  }

  // Scroll to bottom (helper for view)
  scrollToBottom(messagesEndRef) {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handle retry message
  async handleRetryMessage(originalMessage) {
    try {
      this.updateState({ isTyping: true, error: null });

      const botReplyText = await this.model.sendMessage(originalMessage);
      const botMessage = this.model.createMessage(botReplyText, 'bot', true);

      const updatedMessages = [...this.state.messages, botMessage];
      this.updateState({
        messages: updatedMessages,
        isTyping: false
      });

      // Save updated history
      this.model.saveChatHistory(updatedMessages);

    } catch (error) {
      console.error('Error retrying message:', error);
      this.updateState({
        error: error.message || 'Failed to retry message. Please try again.',
        isTyping: false
      });
    }
  }

  // Get current state
  getState() {
    return this.state;
  }

  // Cleanup
  cleanup() {
    this.model.clearCache();
    this.view = null;
  }
}

export default ChatbotPresenter;
