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
    <section className="w-full min-h-[500px] sm:min-h-[600px] relative flex items-center justify-center px-2 sm:px-4 py-8 sm:py-12 pt-20 sm:pt-12">
      {/* Background Pattern - Responsive positioning */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 sm:w-20 h-12 sm:h-20 border-2 border-[#251404] rounded-full"></div>
        <div className="absolute top-8 sm:top-20 right-4 sm:right-20 w-10 sm:w-16 h-10 sm:h-16 bg-[#251404] rounded-full"></div>
        <div className="absolute bottom-8 sm:bottom-20 left-4 sm:left-20 w-8 sm:w-12 h-8 sm:h-12 border-2 border-[#251404] rounded-full"></div>
        <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-16 sm:w-24 h-16 sm:h-24 bg-[#251404]/30 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-5xl w-full bg-white/95 backdrop-blur-lg rounded-[30px] sm:rounded-[50px] shadow-2xl shadow-[#251404]/30 flex flex-col lg:flex-row gap-6 sm:gap-8 justify-center items-center p-6 sm:p-10 lg:p-16 border border-white/60 relative z-10 mx-2 sm:mx-4">
        <div className="flex-shrink-0 transition-transform duration-700 hover:scale-110 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#A1BA82]/20 to-[#251404]/20 rounded-full blur-xl"></div>
          <img
            className="w-60 sm:w-80 h-48 sm:h-64 object-contain drop-shadow-2xl relative z-10"
            src="/Frame.png"
            alt="Mental Health Illustration"
          />
        </div>
        <div className="flex-1 max-w-lg text-center lg:text-left">
          <div className="text-[#251404] text-2xl sm:text-3xl lg:text-5xl font-bold font-['Sora'] leading-tight mb-4 sm:mb-6">
            <div className="relative h-[100px] sm:h-[140px] overflow-hidden">
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
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#A1BA82] to-[#251404] rounded-full mx-auto lg:mx-0 my-4 sm:my-6"></div>

            {/* Subtitle */}
            <p className="text-[#251404]/70 text-base sm:text-lg font-medium mb-6 sm:mb-8 px-2 sm:px-0">
              Bersama membangun kesehatan mental yang lebih baik
            </p>
          </div>

          <div className="flex justify-center lg:justify-start mt-6 sm:mt-8 space-x-2 sm:space-x-3">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => onQuoteChange(index)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  index === currentQuote
                    ? 'bg-gradient-to-r from-[#A1BA82] to-[#251404] w-6 sm:w-8 shadow-lg'
                    : 'bg-[#251404]/30 w-2 sm:w-3 hover:bg-[#251404]/50'
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