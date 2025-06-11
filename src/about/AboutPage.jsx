import React from 'react';
import Navbar from '../components/Navbar';
import AboutSection from '../home/view/components/AboutSection';
import Footer from '../home/view/components/Footer';

function AboutPage() {
  return (
    <div className="bg-[#A1BA82] min-h-screen pt-20 relative overflow-hidden">
      {/* Background decorative elements - consistent with home page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#251404]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/20 rounded-full blur-lg animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-[#251404]/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/15 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#A1BA82]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navbar />

      {/* About Section */}
      <section className="relative z-10 mb-6">
        <AboutSection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutPage;
