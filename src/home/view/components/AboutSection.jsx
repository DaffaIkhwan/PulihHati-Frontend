import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function AboutSection() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <section className="relative w-full px-4 py-16 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[-120px] w-[450px] h-[450px] bg-[#A1BA82]/25 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-100px] right-[-120px] w-[450px] h-[450px] bg-[#251404]/15 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-[#A1BA82]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>


      {/* Main Content Card */}
      <div className="relative z-10 max-w-7xl mx-auto bg-white/95 backdrop-blur-lg rounded-[60px] shadow-2xl shadow-[#251404]/25 overflow-hidden border border-white/50">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div
            className="flex-shrink-0 p-12 lg:p-20 bg-gradient-to-br from-[#A1BA82]/15 to-[#251404]/8 relative"
            data-aos="fade-right"
            data-aos-duration="800"
          >
            {/* Enhanced Decorative elements */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-[#A1BA82]/25 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-[#251404]/25 rounded-full blur-lg animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-[#A1BA82]/15 rounded-full blur-md animate-pulse delay-1000"></div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-[#A1BA82]/25 to-[#251404]/25 rounded-4xl blur-2xl"></div>
              <img
                className="w-full max-w-md h-auto object-contain mx-auto drop-shadow-2xl transition-transform hover:scale-110 duration-700 relative z-10"
                src="/Group (1).png"
                alt="About PulihHati"
              />
            </div>
          </div>

          {/* Text Content Section */}
          <div
            className="flex-1 p-12 lg:p-20"
            data-aos="fade-left"
            data-aos-duration="800"
          >
            <div className="space-y-8 text-[#251404]/90">
              {/* Opening paragraph */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-[#A1BA82] to-transparent rounded-full"></div>
                <p className="text-xl lg:text-2xl font-light leading-relaxed font-['Crimson_Text',_serif] pl-4">
                  <span className="text-[#251404] font-medium text-2xl lg:text-3xl">Pulih Hati</span> adalah sebuah inisiatif digital yang lahir dari keprihatinan terhadap meningkatnya kasus gangguan kesehatan mental, terutama di kalangan remaja dan dewasa muda.
                </p>
              </div>

              {/* Mission statement */}
              <div className="bg-gradient-to-r from-[#A1BA82]/10 to-transparent p-6 rounded-2xl border-l-4 border-[#A1BA82]">
                <p className="text-lg lg:text-xl font-light leading-relaxed font-['Crimson_Text',_serif] italic">
                  Kami percaya bahwa setiap individu berhak atas akses terhadap kesehatan jiwa yang mudah, aman, dan <span className="font-medium text-[#A1BA82] not-italic">tanpa stigma</span>.
                </p>
              </div>

              {/* Technical description */}
              <p className="text-lg lg:text-xl font-light leading-relaxed font-['Crimson_Text',_serif]">
                Didukung oleh tim multidisiplin dari berbagai universitas di Indonesia, PulihHati dirancang sebagai aplikasi berbasis web yang membantu pengguna mengenali kondisi kesehatan mental mereka secara mandiri melalui pendekatan ilmiah berbasis data dan teknologi <span className="font-medium text-[#A1BA82]">kecerdasan buatan (AI/ML)</span>.
              </p>

              {/* Features grid */}
              <div className="grid grid-cols-1 gap-4 my-10">
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg border border-[#A1BA82]/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-[#A1BA82] rounded-full animate-pulse"></div>
                    <span className="text-lg font-light font-['Crimson_Text',_serif]">Asesmen Kesehatan Mental & Chatbot Interaktif</span>
                  </div>
                </div>
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg border border-[#A1BA82]/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-[#A1BA82] rounded-full animate-pulse delay-300"></div>
                    <span className="text-lg font-light font-['Crimson_Text',_serif]">Mood Tracker untuk memantau dinamika emosi</span>
                  </div>
                </div>
                <div className="bg-white/80 p-6 rounded-2xl shadow-lg border border-[#A1BA82]/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-[#A1BA82] rounded-full animate-pulse delay-500"></div>
                    <span className="text-lg font-light font-['Crimson_Text',_serif]">Forum SafeSpace untuk berbagi dan saling mendukung</span>
                  </div>
                </div>
              </div>

              {/* Closing statement */}
              <div className="relative bg-gradient-to-r from-[#251404]/5 to-[#A1BA82]/5 p-8 rounded-2xl">
                <p className="text-lg lg:text-xl font-light leading-relaxed font-['Crimson_Text',_serif] text-center">
                  PulihHati tidak hanya menjadi alat bantu personal, tetapi juga gerakan kolektif untuk memutus rantai stigma dan membuka ruang dialog sehat seputar kesehatan mental. Dengan desain yang inklusif dan teknologi yang humanis, kami berkomitmen untuk membantu masyarakat <span className="text-[#A1BA82] font-medium text-xl">menemukan kembali tenangnya</span>.
                </p>
              </div>
            </div>

            {/* Enhanced CTA Button */}
            <div className="text-center mt-16">
              <a
                href="/signup"
                className="inline-flex items-center gap-4 bg-gradient-to-r from-[#A1BA82] to-[#A1BA82]/80 hover:from-[#A1BA82]/80 hover:to-[#A1BA82] text-white py-5 px-12 rounded-full text-xl font-bold font-['Inter'] transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl"
              >
                <span>Bergabung Sekarang</span>
                <div className="w-7 h-7 relative">
                  <div className="absolute top-1/2 left-1 w-5 h-0.5 bg-white rounded transform -translate-y-1/2 transition-transform group-hover:translate-x-1"></div>
                  <div className="absolute top-1/2 right-1 w-4 h-4 border-r-2 border-t-2 border-white transform rotate-45 -translate-y-1/2 transition-transform group-hover:rotate-90"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;