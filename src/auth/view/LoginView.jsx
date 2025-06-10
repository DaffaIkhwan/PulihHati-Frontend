import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hero from '/hero-login.png';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthPresenter from '../presenter/AuthPresenter';

const LoginView = () => {
  const [state, setState] = useState({
    loginForm: {
      email: '',
      password: ''
    },
    loading: false,
    error: null,
    success: null,
    showPassword: false,
    validation: {
      email: { isValid: true, message: '' },
      password: { isValid: true, message: '' }
    }
  });

  const navigate = useNavigate();
  const presenterRef = useRef(null);

  // Initialize presenter
  useEffect(() => {
    presenterRef.current = new AuthPresenter();
    presenterRef.current.setView({ setState });
    presenterRef.current.initialize();

    return () => {
      if (presenterRef.current) {
        presenterRef.current.cleanup();
      }
    };
  }, []);

  const { loginForm, loading, error, success, showPassword, validation } = state;

  const handleInputChange = (field, value) => {
    if (presenterRef.current) {
      presenterRef.current.handleLoginInputChange(field, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (presenterRef.current) {
      await presenterRef.current.handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    if (presenterRef.current) {
      presenterRef.current.togglePasswordVisibility();
    }
  };

  const clearError = () => {
    if (presenterRef.current) {
      presenterRef.current.clearError();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <img src={hero} className="absolute bottom-0 right-0 w-80 md:w-[28rem] lg:w-[32rem]" />

      <div className="relative bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl z-10">
        <h2 className="text-3xl font-bold text-center text-[#251404] mb-6">WELCOME</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
            <button 
              onClick={clearError}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#251404] mb-1">
              Email Address
            </label>
            <div className={`flex items-center border ${!validation.email.isValid ? 'border-red-500' : 'border-[#B8C28C]'} rounded-full px-4 py-3`}>
              <Mail className="w-5 h-5 text-[#251404] mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={loginForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={loading}
              />
            </div>
            {!validation.email.isValid && (
              <p className="text-xs text-red-500 mt-1">{validation.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#251404] mb-1">
              Password
            </label>
            <div className={`flex items-center border ${!validation.password.isValid ? 'border-red-500' : 'border-[#B8C28C]'} rounded-full px-4 py-3`}>
              <Lock className="w-5 h-5 text-[#251404] mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password..."
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={loginForm.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#A0A0A0]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#A0A0A0]" />
                )}
              </button>
            </div>
            {!validation.password.isValid && (
              <p className="text-xs text-red-500 mt-1">{validation.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#251404] text-white font-semibold rounded-full w-full py-3 flex items-center justify-center gap-2 hover:bg-[#4F3422] transition-colors duration-300 disabled:bg-gray-400"
          >
            {loading ? 'Signing In...' : 'Sign In'} 
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
