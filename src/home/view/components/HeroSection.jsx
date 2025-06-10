import React, { useEffect } from 'react';

const quotes = [
  "Kesehatan mental sama pentingnya dengan kesehatan fisik",
  "Bersama kita bisa lebih kuat",
  "Setiap langkah kecil adalah kemajuan",
  "Kamu tidak sendirian dalam perjalanan ini"
];

function HeroSection({ currentQuote, onPrevQuote, onNextQuote, onQuoteChange }) {
  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onNextQuote();
    }, 5000);

    return () => clearInterval(interval);
  }, [onNextQuote]);

  return (
    <section className="w-full min-h-[500px] bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center px-4 py-4">
      <div className="max-w-4xl w-full bg-white rounded-[40px] shadow-2xl shadow-stone-400/20 flex flex-col lg:flex-row gap-8 justify-center items-center p-8 lg:p-12 backdrop-blur-sm border border-white/50">
        <div className="flex-shrink-0 transition-transform duration-700 hover:scale-105">
          <img
            className="w-80 h-64 object-contain drop-shadow-lg"
            src="/Frame.png"
            alt="Mental Health Illustration"
          />
        </div>
        <div className="flex-1 max-w-md text-center lg:text-left">
          <div className="text-stone-800 text-3xl lg:text-4xl font-bold font-['Sora'] leading-relaxed">
            <div className="relative h-[120px] overflow-hidden">
              {quotes.map((quote, index) => (
                <div
                  key={index}
                  className={`absolute w-full transition-all duration-500 ease-in-out ${
                    index === currentQuote
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  {quote}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-start mt-6 space-x-2">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => onQuoteChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentQuote ? 'bg-amber-600 w-6' : 'bg-stone-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection; 