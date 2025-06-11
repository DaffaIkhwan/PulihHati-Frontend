import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, ArrowRight, Heart, Lock, Sparkles, Star, Shield, Eye, EyeOff } from 'lucide-react';

const StylishLoginPrompt = ({ 
  message = "Belum login, silahkan login terlebih dahulu",
  showQuickLogin = false 
}) => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setShowAnimation(true);
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  const steps = [
    { icon: Heart, text: "Kesehatan Mental", color: "text-pink-500" },
    { icon: Shield, text: "Aman & Terpercaya", color: "text-green-500" },
    { icon: Star, text: "Komunitas Peduli", color: "text-yellow-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-float">
        <Sparkles className="h-8 w-8 text-white/30" />
      </div>
      <div className="absolute top-40 right-32 animate-float animation-delay-1000">
        <Star className="h-6 w-6 text-yellow-300/40" />
      </div>
      <div className="absolute bottom-32 right-20 animate-float animation-delay-2000">
        <Heart className="h-10 w-10 text-pink-300/30" />
      </div>

      <div className={`max-w-lg w-full relative z-10 transform transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with Animation */}
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
            
            {/* Animated Icon */}
            <div className="relative z-10 mb-6">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 relative">
                <Lock className="h-12 w-12 text-white animate-pulse" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-yellow-800 text-xs font-bold">!</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-3 animate-fade-in">
              Akses Terbatas
            </h1>
            <p className="text-lg text-white/90 font-medium animate-fade-in animation-delay-500">
              {message}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Animated Steps */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-6 text-center text-lg">
                Bergabung dengan PulihHati
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === index;
                  return (
                    <div 
                      key={index}
                      className={`flex items-center p-4 rounded-2xl transition-all duration-500 ${
                        isActive 
                          ? 'bg-white/20 border border-white/30 transform scale-105' 
                          : 'bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-500 ${
                        isActive ? 'bg-white/30 scale-110' : 'bg-white/20'
                      }`}>
                        <Icon className={`h-6 w-6 ${step.color} ${isActive ? 'animate-pulse' : ''}`} />
                      </div>
                      <span className={`text-white font-medium transition-all duration-500 ${
                        isActive ? 'text-lg' : 'text-base'
                      }`}>
                        {step.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group shadow-2xl"
              >
                <LogIn className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" />
                Masuk ke Akun
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-center">
                <span className="text-white/70 text-sm">Belum punya akun?</span>
              </div>
              
              <button
                onClick={handleRegister}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm flex items-center justify-center group"
              >
                <UserPlus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Daftar Gratis Sekarang
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-green-400 mr-2 animate-pulse" />
                <span className="text-sm font-medium text-white/90">100% Aman & Gratis</span>
              </div>
              <p className="text-xs text-white/70 text-center leading-relaxed">
                Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat PulihHati
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default StylishLoginPrompt;
