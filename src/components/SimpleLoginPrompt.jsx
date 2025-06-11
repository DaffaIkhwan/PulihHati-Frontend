import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Heart, Lock, ArrowRight } from 'lucide-react';

const SimpleLoginPrompt = ({ 
  title = "Silahkan Login Terlebih Dahulu",
  message = "Untuk mengakses fitur ini, Anda perlu masuk ke akun PulihHati.",
  showFeatures = true 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">
              {title}
            </h1>
            <div className="flex items-center justify-center">
              <Heart className="h-4 w-4 text-white/80 mr-2" />
              <span className="text-white/90 text-sm font-medium">PulihHati</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Features (Optional) */}
            {showFeatures && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-center text-sm">
                  Fitur yang menanti Anda:
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                    <div className="text-green-600 font-medium">SafeSpace</div>
                    <div className="text-gray-600 mt-1">Komunitas</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                    <div className="text-blue-600 font-medium">AI Chatbot</div>
                    <div className="text-gray-600 mt-1">Konsultasi</div>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg text-center border border-pink-100">
                    <div className="text-pink-600 font-medium">Tracking</div>
                    <div className="text-gray-600 mt-1">Progress</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
                    <div className="text-purple-600 font-medium">Profile</div>
                    <div className="text-gray-600 mt-1">Personal</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
              >
                <LogIn className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Masuk ke Akun
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-center">
                <span className="text-gray-500 text-sm">Belum punya akun?</span>
              </div>
              
              <button
                onClick={handleRegister}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300"
              >
                <UserPlus className="h-5 w-5 mr-2 inline" />
                Daftar Gratis
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Gratis • Aman • Terpercaya
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Bergabung dengan ribuan pengguna yang telah merasakan manfaat PulihHati
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginPrompt;
