import React from 'react';

function ChatbotSection({ onNavigate }) {
  return (
    <section className="w-full flex justify-center px-4 py-16 relative">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-12 w-28 h-28 bg-[#251404]/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-12 right-12 w-32 h-32 bg-[#251404]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-[#A1BA82]/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-5xl w-full bg-gradient-to-br from-[#251404] via-[#4F3422] to-[#251404] rounded-[50px] shadow-2xl shadow-[#251404]/30 relative overflow-hidden group border border-[#251404]/20">
        {/* Enhanced shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#A1BA82]/10 to-transparent transform skew-x-12 translate-x-[100%] group-hover:translate-x-[-200%] transition-transform duration-1500 delay-200"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 lg:p-16">
          <div className="flex-shrink-0 mb-8 lg:mb-0 lg:mr-12 relative">
            {/* Decorative glow around image */}
            <div className="absolute -inset-6 bg-gradient-to-r from-[#A1BA82]/20 to-white/20 rounded-full blur-2xl"></div>
            <img
              className="w-80 h-80 object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-115 relative z-10"
              src="/Group.png"
              alt="Chatbot Character"
            />
          </div>

          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <h2 className="text-white text-3xl lg:text-4xl font-bold font-['Inter'] leading-tight mb-8 drop-shadow-lg">
              Tanya apa saja tentang kesehatan mental mu, aku siap membantu!!
            </h2>

            {/* Subtitle */}
            <p className="text-white/90 text-lg lg:text-xl font-medium mb-10 leading-relaxed font-['Inter']">
              Dapatkan dukungan dan panduan kesehatan mental 24/7 dengan AI yang memahami Anda
            </p>

            <button
              onClick={() => onNavigate('/chatbot')}
              className="group/btn bg-gradient-to-r from-[#A1BA82] to-[#A1BA82]/80 hover:from-[#A1BA82]/80 hover:to-[#A1BA82] text-white px-12 py-5 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl active:scale-95 inline-flex items-center gap-4 font-bold text-xl shadow-xl"
            >
              <span className="font-['Inter']">
                Ngobrol Sekarang
              </span>
              <div className="w-8 h-8 relative">
                <div className="absolute top-1/2 left-1 w-5 h-0.5 bg-white rounded transform -translate-y-1/2 transition-transform group-hover/btn:translate-x-2 duration-300"></div>
                <div className="absolute top-1/2 right-1 w-4 h-4 border-r-2 border-t-2 border-white transform rotate-45 -translate-y-1/2 transition-transform group-hover/btn:rotate-90 duration-300"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatbotSection; 