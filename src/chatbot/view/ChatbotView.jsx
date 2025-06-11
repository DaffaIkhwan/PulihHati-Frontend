import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ChatbotPresenter from "../presenter/ChatbotPresenter";

const ChatbotView = () => {
  const [state, setState] = useState({
    messages: [],
    inputText: '',
    isTyping: false,
    loading: false,
    error: null,
    clickedButtons: new Set(), // Track which messages had their buttons clicked
    fadingButtons: new Set() // Track which buttons are fading out
  });

  const messagesEndRef = useRef(null);
  const presenterRef = useRef(null);
  const location = useLocation();

  // Initialize presenter
  useEffect(() => {
    presenterRef.current = new ChatbotPresenter();
    presenterRef.current.setView({ setState });
    presenterRef.current.initialize();

    return () => {
      if (presenterRef.current) {
        presenterRef.current.cleanup();
      }
    };
  }, []);

  // Auto-reset chatbot when user navigates away from chatbot page
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Send reset message invisibly when user navigates away
      if (presenterRef.current && location.pathname === '/chatbot') {
        try {
          // Send reset message silently (without updating UI)
          presenterRef.current.model.sendMessage('reset');
        } catch (error) {
          console.log('Auto-reset failed:', error);
        }
      }
    };

    // Add event listener for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to send reset when component unmounts (route change)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Send reset when leaving chatbot page
      if (presenterRef.current) {
        try {
          // Send reset message silently
          presenterRef.current.model.sendMessage('reset');
        } catch (error) {
          console.log('Auto-reset on route change failed:', error);
        }
      }
    };
  }, [location.pathname]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages, state.isTyping]);

  const { messages, inputText, isTyping, loading, error } = state;

  const handleInputChange = (e) => {
    if (presenterRef.current) {
      presenterRef.current.handleInputChange(e.target.value);
    }
  };

  const handleSendMessage = () => {
    if (presenterRef.current) {
      presenterRef.current.handleSendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (presenterRef.current) {
      presenterRef.current.handleKeyPress(e);
    }
  };

  const handleReset = () => {
    if (presenterRef.current) {
      // Temporarily set input to "reset" and send it
      presenterRef.current.handleInputChange("reset");
      presenterRef.current.handleSendMessage();
    }
  };

  const handleButtonResponse = (response, messageId) => {
    if (presenterRef.current) {
      // First add to fading buttons for animation
      setState(prevState => ({
        ...prevState,
        fadingButtons: new Set([...(prevState.fadingButtons || []), messageId])
      }));

      // After a short delay, add to clicked buttons to hide completely
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          clickedButtons: new Set([...(prevState.clickedButtons || []), messageId]),
          fadingButtons: new Set([...(prevState.fadingButtons || [])].filter(id => id !== messageId))
        }));
      }, 300); // 300ms fade out animation

      presenterRef.current.handleButtonResponse(response);
    }
  };

  // Check if message contains trigger phrases and buttons haven't been clicked
  const shouldShowButtons = (message) => {
    const triggerPhrases = ['mau aku bantu', 'ingin aku bantu', 'aku bantu kasih tips'];
    const messageText = message.text.toLowerCase();

    const hasTriggerPhrase = triggerPhrases.some(phrase => messageText.includes(phrase));
    const buttonsNotClicked = !(state.clickedButtons && state.clickedButtons.has(message.id));

    return message.sender === 'bot' && hasTriggerPhrase && buttonsNotClicked;
  };

  const formatTime = (date) => {
    if (presenterRef.current) {
      return presenterRef.current.getFormattedTime(date);
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#A1BA82] pt-20">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#251404] mx-auto mb-4"></div>
            <p className="text-[#251404] font-medium">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#A1BA82] pt-20">
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-80px)] w-full relative">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => presenterRef.current?.clearError()}
              className="text-xs underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="w-8 h-8 bg-[#4F3422] rounded-full flex items-center justify-center flex-shrink-0 mb-1 shadow-lg overflow-hidden">
                      <img
                        src="/bot.png"
                        alt="Bot Avatar"
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 shadow-lg relative ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[#251404] to-[#4F3422] text-white rounded-br-md"
                        : "bg-white text-stone-800 border border-stone-200 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.text}
                    </p>

                    {message.sender === "user" && (
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs text-amber-100">
                          {formatTime(message.timestamp)}
                        </span>
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

              {message.sender === "bot" && (
                <div className="ml-10 mt-1">
                  <span className="text-xs text-stone-500">
                    {formatTime(message.timestamp)}
                  </span>

                  {/* Interactive buttons for trigger messages */}
                  {shouldShowButtons(message) && (
                    <div className={`mt-4 p-4 bg-gradient-to-r from-stone-50 to-stone-100 rounded-xl border-2 border-dashed border-stone-300 shadow-lg relative overflow-hidden transition-all duration-300 ${
                      state.fadingButtons && state.fadingButtons.has(message.id)
                        ? 'opacity-0 scale-95 transform'
                        : 'opacity-100 scale-100'
                    }`}>
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-stone-200 opacity-50 animate-pulse"></div>

                      {/* Floating particles effect */}
                      <div className="absolute top-2 left-4 w-1 h-1 bg-stone-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="absolute top-3 right-6 w-1 h-1 bg-stone-500 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute bottom-2 left-8 w-1 h-1 bg-stone-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                            <div className="w-2 h-2 bg-stone-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                          </div>
                          <span className="text-sm font-bold text-stone-700 animate-pulse">💬 Pilih jawaban Anda:</span>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => handleButtonResponse('Ya', message.id)}
                            className="relative px-6 py-3 bg-gradient-to-r from-[#A1BA82] to-[#A1BA82]/80 hover:from-[#A1BA82]/80 hover:to-[#A1BA82] text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 border border-[#A1BA82]/30"
                          >
                            <span className="relative z-10">✓ Ya</span>
                            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                          </button>
                          <button
                            onClick={() => handleButtonResponse('Tidak', message.id)}
                            className="relative px-6 py-3 bg-gradient-to-r from-[#4F3422] to-[#251404] hover:from-[#251404] hover:to-[#4F3422] text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 border border-[#4F3422]/30"
                          >
                            <span className="relative z-10">✗ Tidak</span>
                            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                          </button>
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-xs text-stone-600 font-medium">👆 Klik salah satu untuk melanjutkan</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2 max-w-xs">
                <div className="w-8 h-8 bg-[#4F3422] rounded-full flex items-center justify-center flex-shrink-0 mb-1 shadow-lg">
                  <span className="text-white text-sm font-medium">T</span>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-stone-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#A1BA82] px-4 py-4 border-t border-[#4F3422] shadow-lg">
          <div className="flex items-center space-x-3 bg-white/90 rounded-full px-4 py-3 shadow-inner">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Send a message..."
              className="flex-1 bg-transparent text-sm text-stone-800 focus:outline-none placeholder-stone-500"
              disabled={isTyping}
            />
            <button
              onClick={handleReset}
              disabled={isTyping}
              className="p-2 rounded-full bg-gradient-to-r from-[#4F3422] to-[#251404] hover:from-[#251404] hover:to-[#4F3422] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-105 active:scale-95"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={inputText.trim() === "" || isTyping}
              className="p-2 rounded-full bg-gradient-to-r from-[#251404] to-[#4F3422] hover:from-[#4F3422] hover:to-[#251404] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotView;
