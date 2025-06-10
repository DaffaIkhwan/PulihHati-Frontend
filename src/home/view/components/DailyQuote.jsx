import { ChevronLeft, ChevronRight } from "lucide-react";

const quotes = [
  {
    text: "Kesehatan mental sama pentingnya dengan kesehatan fisik. Jangan abaikan keduanya.",
    author: "Unknown"
  },
  {
    text: "Setiap hari adalah kesempatan baru untuk memulai dengan pikiran yang lebih positif.",
    author: "Unknown"
  },
  {
    text: "Jangan takut untuk meminta bantuan. Itu adalah tanda kekuatan, bukan kelemahan.",
    author: "Unknown"
  },
  {
    text: "Kamu lebih kuat dari yang kamu pikirkan. Percayalah pada dirimu sendiri.",
    author: "Unknown"
  },
  {
    text: "Kesehatan mental yang baik adalah kunci untuk hidup yang bahagia dan produktif.",
    author: "Unknown"
  }
];

function DailyQuote({ currentQuote, onPrevQuote, onNextQuote }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg border border-amber-200 p-6">
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={onPrevQuote}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg border border-amber-200 hover:bg-amber-50 transition-colors z-10"
        >
          <ChevronLeft className="h-5 w-5 text-amber-600" />
        </button>
        
        <button
          onClick={onNextQuote}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg border border-amber-200 hover:bg-amber-50 transition-colors z-10"
        >
          <ChevronRight className="h-5 w-5 text-amber-600" />
        </button>

        {/* Quote Content */}
        <div className="text-center px-8">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Kutipan Hari Ini</h3>
          <blockquote className="text-amber-900 text-lg italic mb-4">
            "{quotes[currentQuote].text}"
          </blockquote>
          <p className="text-amber-700">- {quotes[currentQuote].author}</p>
        </div>

        {/* Quote Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {quotes.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentQuote === index ? 'bg-amber-500' : 'bg-amber-300'
              }`}
              onClick={() => onQuoteChange(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailyQuote; 