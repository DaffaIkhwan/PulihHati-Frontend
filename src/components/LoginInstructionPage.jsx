import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, ArrowRight, Heart, Shield, Star, Sparkles, Lock } from 'lucide-react';

const LoginInstructionPage = ({ 
  title = "Silahkan Login Terlebih Dahulu", 
  subtitle = "Akses fitur lengkap PulihHati",
  variant = "elegant" 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  if (variant === "elegant") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-teal-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-cyan-200 rounded-full opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-emerald-300 rounded-full opacity-20 animate-bounce delay-500"></div>

        <div className="max-w-lg w-full relative z-10">
          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center relative">
              <div className="absolute top-4 right-4">
                <Sparkles className="h-6 w-6 text-white/70 animate-spin" />
              </div>
              <div className="absolute top-4 left-4">
                <Star className="h-5 w-5 text-white/60 animate-pulse" />
              </div>
              
              {/* Logo/Icon */}
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
                <Heart className="h-12 w-12 text-white animate-pulse" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {title}
              </h1>
              <p className="text-lg text-white/90 font-medium">
                {subtitle}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Instruction Message */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Akses Terbatas
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Untuk mengakses fitur ini, Anda perlu masuk ke akun PulihHati terlebih dahulu. 
                  Jika belum memiliki akun, silakan daftar gratis.
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4 text-center">Mengapa harus login?</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { icon: "🔒", text: "Keamanan data terjamin" },
                    { icon: "💾", text: "Simpan progress Anda" },
                    { icon: "🎯", text: "Pengalaman yang personal" },
                    { icon: "🤝", text: "Terhubung dengan komunitas" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                      <span className="text-2xl mr-4">{item.icon}</span>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group shadow-lg"
                >
                  <LogIn className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  Masuk ke Akun
                  <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="text-center">
                  <span className="text-gray-500 text-sm">Belum punya akun?</span>
                </div>
                
                <button
                  onClick={handleRegister}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-2xl border-2 border-gray-300 hover:border-emerald-400 transition-all duration-300 flex items-center justify-center group"
                >
                  <UserPlus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Daftar Gratis Sekarang
                </button>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">100% Aman & Gratis</span>
                </div>
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Data Anda dilindungi dengan enkripsi tingkat bank. Daftar hanya membutuhkan waktu 30 detik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal variant
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
        
        <p className="text-gray-600 mb-8">
          Silakan masuk ke akun Anda untuk melanjutkan.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Masuk
          </button>
          
          <button
            onClick={handleRegister}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginInstructionPage;
