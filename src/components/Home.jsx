import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';

const quotes = [
  "Kamu tidak sendiri. Pulih bisa dimulai dari sini.",
  "Setiap emosi itu valid. Dengarkan dirimu.",
  "Tak apa merasa lelah, kamu manusia.",
  "Langkah kecil tetap langkah menuju pulih."
];


export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000); // ganti setiap 4 detik
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-white grid place-items-center">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full h-[800px] bg-stone-100 grid place-items-center">
        <div className="w-[1104px] h-[569px] bg-white rounded-[30px] shadow-[0px_4px_4px_0px_rgba(79,52,34,1.00)] flex flex-col md:flex-row gap-6 justify-center items-center px-4">
          <img className="w-72 h-56" src="/public/Frame.png" alt="Frame" />
          <div className="w-96 h-36 text-center flex items-center justify-center text-black text-4xl font-semibold font-['Sora'] leading-[60px] transition-all duration-500">
            {quotes[currentQuote]}
          </div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="w-[848px] h-[465px] bg-amber-300 rounded-[30px] grid place-items-center my-8">
        <div className="w-[848px] h-[465px] relative">
          <div className="w-[848px] h-[465px] left-0 top-0 absolute bg-amber-300 rounded-[30px]" />
          <img className="size-80 left-[-185px] top-[120px] absolute" src="/public/Group.png" alt="Group" />
          <div className="w-[569px] h-36 left-[190px] top-[91px] absolute text-center justify-start text-black text-3xl font-semibold font-['Sora'] leading-[48px] tracking-tight">
            Tanya apa saja tentang kesehatan mental mu, aku siap membantu!!
          </div>
          <div className="h-14 px-6 py-4 left-[375px] top-[259px] absolute bg-stone-700 rounded-full inline-flex justify-center items-center">
            <div className="flex justify-center items-center gap-3">
              <button 
                onClick={() => navigate('/chatbot')} 
                className="justify-start text-white text-lg font-extrabold font-['Urbanist']"
              >
                Ngobrol yuk
              </button>
              <div className="size-6 relative">
                <div className="w-5 h-0 left-[2px] top-[12px] absolute outline outline-2 outline-offset-[-1px] outline-white" />
                <div className="size-3 left-[9px] top-[6px] absolute rounded-full outline outline-2 outline-offset-[-1px] outline-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Space Section */}
      <section className="w-[1343px] h-[557px] relative bg-stone-100 mt-16 mb-8">
        <div className="w-[1343px] h-[557px] left-0 top-0 absolute bg-amber-700" />
        <div className="w-7 h-5 left-[584px] top-[474px] absolute bg-white rounded-full" />
        <div className="w-7 h-5 left-[725px] top-[474px] absolute bg-white rounded-full" />
        <div className="w-7 h-5 left-[658px] top-[474px] absolute bg-white rounded-full" />
        <div className="w-[594px] h-72 left-[64px] top-[126px] absolute">
          <div className="w-[594px] h-72 left-0 top-0 absolute bg-white rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.30)]" />
          <div className="w-72 h-11 left-[220px] top-[209px] absolute bg-rose-100 rounded-[40px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-amber-700 cursor-pointer" 
               onClick={() => navigate('/safespace')}>
            <div className="w-40 h-9 left-[64px] top-[4px] absolute text-center justify-start text-black text-2xl font-semibold font-['Sora'] leading-9 tracking-tight">
              Lihat detail
            </div>
          </div>
        </div>
        <div className="w-96 h-14 left-[483px] top-[48px] absolute text-center justify-start text-white text-3xl font-semibold font-['Sora'] leading-[48px] tracking-tight">
          Safe Space
        </div>
      </section>

      {/* About Section */}
      <section className="w-[1343px] h-[557px] relative bg-stone-100 my-8">
        <div className="w-[1343px] h-[557px] left-0 top-0 absolute bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.20)]" />
        <div className="w-[840px] h-72 left-[491px] top-[159px] absolute text-center justify-start text-black text-sm font-normal font-['Sora'] leading-tight tracking-tight">
          PulihHati adalah sebuah inisiatif digital yang lahir dari keprihatinan terhadap meningkatnya kasus gangguan kesehatan mental, terutama di kalangan remaja dan dewasa muda. Kami percaya bahwa setiap individu berhak atas akses terhadap kesehatan jiwa yang mudah, aman, dan tanpa stigma.<br/>
          Didukung oleh tim multidisiplin dari berbagai universitas di Indonesia, PulihHati dirancang sebagai aplikasi berbasis web yang membantu pengguna mengenali kondisi kesehatan mental mereka secara mandiri melalui pendekatan ilmiah berbasis data dan teknologi kecerdasan buatan (AI/ML).<br/>
          Kami menghadirkan tiga fitur utama: 🔹 Asesmen Kesehatan Mental / Chatbot Interaktif untuk deteksi awal kondisi psikologis, 🔹 Mood Tracker untuk memantau dan memahami dinamika emosi, 🔹 Forum SafeSpace sebagai ruang aman untuk berbagi dan saling mendukung.<br/>
          PulihHati tidak hanya menjadi alat bantu personal, tetapi juga gerakan kolektif untuk memutus rantai stigma dan membuka ruang dialog sehat seputar kesehatan mental. Dengan desain yang inklusif dan teknologi yang humanis, kami berkomitmen untuk membantu masyarakat menemukan kembali tenangnya.
        </div>
        <img className="size-96 left-[45px] top-[60px] absolute" src="/public/Group (1).png" alt="Group About" />
      </section>

      {/* Footer */}
      <footer className="w-full h-72 relative">
        <div className="w-full h-72 left-0 top-0 absolute  bg-[#9bb067]" />
        <div className="w-96 h-32 left-[22px] top-[50.91px] absolute text-center justify-start text-black text-3xl font-semibold font-['Sora'] leading-[48px] tracking-tight">Pulih Hati</div>
      </footer>
    </div>
  );
}
