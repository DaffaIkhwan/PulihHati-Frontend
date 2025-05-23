const HomeScreen = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="text-center py-16 bg-[#FAF5EF]">
        <div className="inline-block px-10 py-12 rounded-xl shadow-md bg-white">
          <img src="https://cdn-icons-png.flaticon.com/512/4202/4202840.png" alt="Hero" className="mx-auto mb-4 w-24 h-24" />
          <h2 className="text-lg font-semibold">Kamu tidak sendiri. <br /> Pulih bisa dimulai dari sini</h2>
        </div>
      </section>

      {/* Chat Prompt */}
      <section className="bg-white text-center py-10">
        <div className="inline-block bg-yellow-300 rounded-lg px-6 py-8">
          <img src="https://cdn-icons-png.flaticon.com/512/620/620851.png" alt="Mascot" className="w-24 mx-auto mb-4" />
          <p className="font-semibold mb-3">Tanya apa saja tentang kesehatan mental mu, aku siap membantu!!</p>
          <button className="bg-black text-white px-4 py-2 rounded-md">Ngobrol yuk →</button>
        </div>
      </section>

      {/* Safe Space Section */}
      <section className="bg-orange-600 text-white py-12">
        <h3 className="text-center text-xl font-bold mb-6">Safe Space</h3>
        <div className="flex justify-center gap-6">
          {[1, 2].map((item) => (
            <div key={item} className="bg-white text-black p-6 rounded-xl w-60 text-center">
              <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4"></div>
              <p className="text-sm mb-4">&ldquo;Kamu tidak sendiri. Pulih bisa dimulai dari sini&rdquo;</p>
              <button className="border border-black px-4 py-2 rounded-md">Lihat detail</button>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {[0, 1, 2].map(i => (
            <span key={i} className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-white' : 'bg-orange-300'}`}></span>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-white py-10 px-6 text-center">
        <img src="https://cdn-icons-png.flaticon.com/512/2965/2965567.png" alt="Relax" className="w-32 mx-auto mb-6" />
        <p className="text-sm text-gray-700">
          Pulih Hati adalah platform digital yang dirancang untuk mendukung kesehatan mental penggunanya.
          Kami menyediakan berbagai layanan mulai dari konsultasi, komunitas pendukung, hingga artikel dan konten edukatif.
          <br /><br />
          ✨ Aman dan Rahasia  |  🌟 Profesional dan Terpercaya  |  📈 Terbukti Berdampak Positif
        </p>
      </section>

      {/* Footer Bottom */}
      <footer className="bg-green-200 py-4 text-center font-medium">
        Pulih Hati
      </footer>
    </div>
  );
};

export default HomeScreen;
