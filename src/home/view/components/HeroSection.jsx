import { useEffect } from 'react';
import PropTypes from 'prop-types';

const quotes = [
  "Kesehatan mental sama pentingnya dengan kesehatan fisik",
  "Bersama kita bisa lebih kuat",
  "Setiap langkah kecil adalah kemajuan",
  "Kamu tidak sendirian dalam perjalanan ini"
];

function HeroSection({ currentQuote, onNextQuote, onQuoteChange }) {
  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onNextQuote();
    }, 5000);

    return () => clearInterval(interval);
  }, [onNextQuote]);

  return (
    <section className="w-full min-h-[600px] relative flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-[#251404] rounded-full"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-[#251404] rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-[#251404] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#251404]/30 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-5xl w-full bg-white/95 backdrop-blur-lg rounded-[50px] shadow-2xl shadow-[#251404]/30 flex flex-col lg:flex-row gap-8 justify-center items-center p-10 lg:p-16 border border-white/60 relative z-10">
        <div className="flex-shrink-0 transition-transform duration-700 hover:scale-110 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#A1BA82]/20 to-[#251404]/20 rounded-full blur-xl"></div>
          <img
            className="w-80 h-64 object-contain drop-shadow-2xl relative z-10"
            src="/Frame.png"
            alt="Mental Health Illustration"
          />
        </div>
        <div className="flex-1 max-w-lg text-center lg:text-left">
          <div className="text-[#251404] text-3xl lg:text-5xl font-bold font-['Sora'] leading-tight mb-6">
            <div className="relative h-[140px] overflow-hidden">
              {quotes.map((quote, index) => (
                <div
                  key={index}
                  className={`absolute w-full transition-all duration-700 ease-in-out ${
                    index === currentQuote
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                >
                  {quote}
                </div>
              ))}
            </div>

            {/* Decorative line */}
            <div className="w-20 h-1 bg-gradient-to-r from-[#A1BA82] to-[#251404] rounded-full mx-auto lg:mx-0 my-6"></div>

            {/* Subtitle */}
            <p className="text-[#251404]/70 text-lg font-medium mb-8">
              Bersama membangun kesehatan mental yang lebih baik
            </p>
          </div>

          <div className="flex justify-center lg:justify-start mt-8 space-x-3">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => onQuoteChange(index)}
                className={`h-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  index === currentQuote
                    ? 'bg-gradient-to-r from-[#A1BA82] to-[#251404] w-8 shadow-lg'
                    : 'bg-[#251404]/30 w-3 hover:bg-[#251404]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

HeroSection.propTypes = {
  currentQuote: PropTypes.number.isRequired,
  onNextQuote: PropTypes.func.isRequired,
  onQuoteChange: PropTypes.func.isRequired
};

export default HeroSection;