import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Navbar from '../components/Navbar';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi, Jerry 😊 How's your day?", 
      sender: "bot", 
      timestamp: new Date(),
      isRead: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotResponse = (userMessage) => {
    const responses = {
      'tired': "It's sad to hear that 😔😔😔\n\nIf I were your TA, I will show you mercy 🔥🔥🔥\n\nAlso, with such a great work.\nI am sure they will know you did spend lots of efforts on your work",
      'assignment': "It's sad to hear that 😔😔😔\n\nIf I were your TA, I will show you mercy 🔥🔥🔥\n\nAlso, with such a great work.\nI am sure they will know you did spend lots of efforts on your work",
      'halo': 'Halo! Senang bertemu dengan Anda 😊',
      'hai': 'Hai! Ada yang bisa saya bantu hari ini? 😄',
      'siapa kamu': 'Saya adalah chatbot AI yang siap membantu Anda.',
      'apa kabar': 'Kabar saya baik! Bagaimana dengan Anda? 😊',
      'terima kasih': 'Sama-sama! Senang bisa membantu 🙏',
      'bye': 'Sampai jumpa! Semoga harimu menyenangkan 👋',
      'good': 'That\'s great to hear! 😊✨',
      'bad': 'Sorry to hear that 😔 Things will get better!',
      'help': 'I\'m here to help! What do you need? 🤝',
      'stressed': 'Take a deep breath. You\'ve got this! 💪✨'
    };

    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    const defaultResponses = [
      'That sounds interesting! Tell me more 😊',
      'I understand. How are you feeling about that? 🤔',
      'Thanks for sharing that with me! 💭',
      'What would you like to do about it? 🤝',
      'I\'m here to listen. Go on... 👂',
      'That\'s quite something! What\'s next? ✨'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
        isRead: true
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-white relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end space-x-2 max-w-xs ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                      <span className="text-white text-sm font-medium">T</span>
                    </div>
                  )}
                
                  <div className={`rounded-2xl px-4 py-3 shadow-sm relative ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-md' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                  
                    {message.sender === 'user' && (
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs text-blue-200">{formatTime(message.timestamp)}</span>
                        <div className="flex space-x-0.5">
                          <div className="w-3 h-3 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                          {message.isRead && (
                            <div className="w-3 h-3 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            
              {message.sender === 'bot' && (
                <div className="ml-10 mt-1">
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                </div>
              )}
            </div>
          ))}
        
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2 max-w-xs">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                  <span className="text-white text-sm font-medium">T</span>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
              className="flex-1 bg-transparent text-sm text-black focus:outline-none placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputText.trim() === ''}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
