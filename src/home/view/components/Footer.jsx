import React from 'react';

function Footer() {
  return (
    <footer className="w-full mt-16">
      <div className="bg-gradient-to-r from-[#9bb067] via-[#a8bd74] to-[#9bb067] py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h3 className="text-stone-800 text-3xl lg:text-4xl font-bold font-['Sora'] mb-4">
              Pulih Hati
            </h3>
            <p className="text-stone-700 text-lg font-['Sora'] max-w-2xl mx-auto leading-relaxed">
              Bersama membangun kesehatan mental yang lebih baik untuk Indonesia
            </p>
            <div className="mt-8 flex justify-center space-x-8">
              <div className="w-12 h-1 bg-stone-600 rounded-full"></div>
              <div className="w-8 h-1 bg-stone-500 rounded-full"></div>
              <div className="w-12 h-1 bg-stone-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 