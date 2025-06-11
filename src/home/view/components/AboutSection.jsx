// import React from 'react';

// function AboutSection() {
//   return (
//     <section className="w-full px-4 py-8">
//       <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-stone-300/20 overflow-hidden">
//         <div className="flex flex-col lg:flex-row">
//           <div className="flex-shrink-0 p-8 lg:p-12 bg-gradient-to-br from-stone-50 to-stone-100">
//             <img
//               className="w-full max-w-sm h-auto object-contain mx-auto drop-shadow-lg"
//               src="/Group (1).png"
//               alt="About PulihHati"
//             />
//           </div>

//           <div className="flex-1 p-8 lg:p-12">
//             <h2 className="text-stone-800 text-2xl lg:text-3xl font-bold font-['Sora'] mb-8 text-center lg:text-left">
//               Tentang PulihHati
//             </h2>

//             <div className="space-y-6 text-stone-700 text-sm lg:text-base font-['Sora'] leading-relaxed">
//               <p>
//                 <strong>PulihHati</strong> adalah sebuah inisiatif digital yang lahir dari keprihatinan terhadap meningkatnya kasus gangguan kesehatan mental, terutama di kalangan remaja dan dewasa muda. Kami percaya bahwa setiap individu berhak atas akses terhadap kesehatan jiwa yang mudah, aman, dan tanpa stigma.
//               </p>

//               <p>
//                 Didukung oleh tim multidisiplin dari berbagai universitas di Indonesia, PulihHati dirancang sebagai aplikasi berbasis web yang membantu pengguna mengenali kondisi kesehatan mental mereka secara mandiri melalui pendekatan ilmiah berbasis data dan teknologi kecerdasan buatan (AI/ML).
//               </p>

//               <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-6 rounded-2xl border-l-4 border-amber-600">
//                 <p className="font-medium">
//                   <span className="text-amber-600">🔹</span> Asesmen Kesehatan Mental / Chatbot Interaktif untuk deteksi awal kondisi psikologis<br/>
//                   <span className="text-amber-600">🔹</span> Mood Tracker untuk memantau dan memahami dinamika emosi<br/>
//                   <span className="text-amber-600">🔹</span> Forum SafeSpace sebagai ruang aman untuk berbagi dan saling mendukung
//                 </p>
//               </div>

//               <p>
//                 PulihHati tidak hanya menjadi alat bantu personal, tetapi juga gerakan kolektif untuk memutus rantai stigma dan membuka ruang dialog sehat seputar kesehatan mental. Dengan desain yang inklusif dan teknologi yang humanis, kami berkomitmen untuk membantu masyarakat menemukan kembali tenangnya.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default AboutSection; 

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function AboutSection() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <section className="relative w-full px-4 py-12 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-80px] left-[-100px] w-[400px] h-[400px] bg-rose-100 rounded-full blur-3xl opacity-30 z-0"></div>
      <div className="absolute bottom-[-80px] right-[-100px] w-[400px] h-[400px] bg-amber-100 rounded-full blur-3xl opacity-30 z-0"></div>

      {/* Main Content Card */}
      <div className="relative z-10 max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-stone-300/20 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div
            className="flex-shrink-0 p-8 lg:p-12 bg-gradient-to-br from-stone-50 to-stone-100"
            data-aos="fade-right"
            data-aos-duration="700"
          >
            <img
              className="w-full max-w-sm h-auto object-contain mx-auto drop-shadow-xl transition-transform hover:scale-105 duration-300"
              src="/Group (1).png"
              alt="About PulihHati"
            />
          </div>

          {/* Text Content Section */}
          <div
            className="flex-1 p-8 lg:p-12"
            data-aos="fade-left"
            data-aos-duration="700"
          >
            <h2 className="text-stone-800 text-2xl lg:text-3xl font-bold font-['Sora'] mb-8 text-center lg:text-left tracking-tight">
              Tentang PulihHati
            </h2>

            <div className="space-y-6 text-stone-700 text-[15px] lg:text-base font-['Sora'] leading-relaxed">
              <p>
                <strong>PulihHati</strong> adalah sebuah inisiatif digital yang lahir dari keprihatinan terhadap meningkatnya kasus gangguan kesehatan mental, terutama di kalangan remaja dan dewasa muda. Kami percaya bahwa setiap individu berhak atas akses terhadap kesehatan jiwa yang mudah, aman, dan <span className="font-semibold text-amber-600">tanpa stigma</span>.
              </p>

              <p>
                Didukung oleh tim multidisiplin dari berbagai universitas di Indonesia, PulihHati dirancang sebagai aplikasi berbasis web yang membantu pengguna mengenali kondisi kesehatan mental mereka secara mandiri melalui pendekatan ilmiah berbasis data dan teknologi <span className="font-semibold text-amber-600">kecerdasan buatan (AI/ML)</span>.
              </p>

              {/* Feature Box */}
              <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-6 rounded-2xl border-l-4 border-amber-600">
                <p className="font-medium">
                  <span className="text-amber-600">🔹</span> Asesmen Kesehatan Mental / Chatbot Interaktif<br />
                  <span className="text-amber-600">🔹</span> Mood Tracker untuk memantau dinamika emosi<br />
                  <span className="text-amber-600">🔹</span> Forum SafeSpace untuk berbagi dan saling mendukung
                </p>
              </div>

              <p>
                PulihHati tidak hanya menjadi alat bantu personal, tetapi juga gerakan kolektif untuk memutus rantai stigma dan membuka ruang dialog sehat seputar kesehatan mental. Dengan desain yang inklusif dan teknologi yang humanis, kami berkomitmen untuk membantu masyarakat <span className="text-rose-600 font-semibold">menemukan kembali tenangnya</span>.
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-10">
              <a
                href="/signup"
                className="inline-block bg-[#251404] text-white py-3 px-8 rounded-full text-sm font-medium hover:bg-[#4F3422] transition-colors"
              >
                Bergabung Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
