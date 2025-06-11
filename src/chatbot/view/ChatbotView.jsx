import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import Navbar from "../../components/Navbar";
import ChatbotPresenter from "../presenter/ChatbotPresenter";

const ChatbotView = () => {
  const [state, setState] = useState({
    messages: [],
    inputText: '',
    isTyping: false,
    loading: false,
    error: null
  });

  const messagesEndRef = useRef(null);
  const presenterRef = useRef(null);

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
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
              className="flex-1 bg-transparent text-sm text-stone-800 focus:outline-none placeholder-stone-500"
              disabled={isTyping}
            />
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
