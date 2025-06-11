function Footer() {
  return (
    <footer className="w-full mt-8 relative">
      {/* Background with pattern */}
      <div className="bg-gradient-to-r from-[#A1BA82] via-[#A1BA82]/95 to-[#A1BA82] py-12 px-6 relative overflow-hidden">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-6 left-8 w-20 h-20 bg-[#251404]/15 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-8 right-12 w-24 h-24 bg-white/15 rounded-full blur-2xl animate-pulse delay-300"></div>
          <div className="absolute bottom-6 left-1/3 w-16 h-16 bg-[#251404]/10 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute bottom-8 right-8 w-22 h-22 bg-white/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="mb-6">
              <div className="flex justify-center items-center">
                <img
                  src="/logoNavbar.png"
                  alt="PulihHati Logo"
                  className="h-16 lg:h-20 w-auto object-contain drop-shadow-lg transition-transform hover:scale-105 duration-300"
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-[#251404]/85 text-lg lg:text-xl font-medium font-['Inter'] max-w-2xl mx-auto leading-relaxed mb-6">
              Bersama membangun kesehatan mental yang lebih baik untuk Indonesia
            </p>



            {/* Copyright */}
            <div className="mt-8 pt-6 border-t border-[#251404]/25">
              <p className="text-[#251404]/70 text-sm font-medium font-['Inter']">
                © 2025 PulihHati. Semua hak dilindungi undang-undang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 