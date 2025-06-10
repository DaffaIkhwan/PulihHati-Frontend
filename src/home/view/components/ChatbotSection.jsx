import React from 'react';

function ChatbotSection({ onNavigate }) {
  return (
    <section className="w-full flex justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-gradient-to-br from-amber-300 via-amber-300 to-amber-400 rounded-[40px] shadow-2xl shadow-amber-500/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12">
          <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
            <img
              className="w-72 h-72 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-110"
              src="/Group.png"
              alt="Chatbot Character"
            />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-stone-800 text-2xl lg:text-3xl font-bold font-['Sora'] leading-tight mb-8 max-w-lg">
              Tanya apa saja tentang kesehatan mental mu, aku siap membantu!!
            </h2>

            <button
              onClick={() => onNavigate('/chatbot')}
              className="group/btn bg-stone-700 hover:bg-stone-800 text-white px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 inline-flex items-center gap-3"
            >
              <span className="text-lg font-bold font-['Urbanist']">
                Ngobrol yuk
              </span>
              <div className="w-6 h-6 relative">
                <div className="absolute top-1/2 left-1 w-4 h-0.5 bg-white rounded transform -translate-y-1/2 transition-transform group-hover/btn:translate-x-1"></div>
                <div className="absolute top-1/2 right-1 w-3 h-3 border-r-2 border-t-2 border-white transform rotate-45 -translate-y-1/2 transition-transform group-hover/btn:rotate-90"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatbotSection; 