import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User } from 'lucide-react';
import hero from '/hero-register.png';
import AuthPresenter from '../presenter/AuthPresenter';

const RegisterView = () => {
  const [state, setState] = useState({
    registerForm: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    loading: false,
    error: null,
    success: null,
    showPassword: false,
    showConfirmPassword: false,
    validation: {
      name: { isValid: true, message: '' },
      email: { isValid: true, message: '' },
      password: { isValid: true, message: '' },
      confirmPassword: { isValid: true, message: '' }
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

  const { registerForm, loading, error, success, showPassword, showConfirmPassword, validation } = state;

  const handleInputChange = (field, value) => {
    if (presenterRef.current) {
      presenterRef.current.handleRegisterInputChange(field, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (presenterRef.current) {
      await presenterRef.current.handleRegister();
    }
  };

  const togglePasswordVisibility = (field = 'password') => {
    if (presenterRef.current) {
      presenterRef.current.togglePasswordVisibility(field);
    }
  };

  const clearError = () => {
    if (presenterRef.current) {
      presenterRef.current.clearError();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      {/* Hero Illustration */}
      <img src={hero} className="absolute bottom-0 left-0 w-80 md:w-[28rem] lg:w-[32rem]" alt="hero" />

      <div className="relative bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl z-10">
        <h2 className="text-3xl font-bold text-center text-[#251404] mb-6">Sign Up For Free</h2>

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
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#251404] mb-1">
              Full Name
            </label>
            <div className={`flex items-center border ${!validation.name.isValid ? 'border-red-500' : 'border-[#B8C28C]'} rounded-full px-4 py-3`}>
              <User className="w-5 h-5 text-[#251404] mr-2" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name..."
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={registerForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={loading}
              />
            </div>
            {!validation.name.isValid && (
              <p className="text-xs text-red-500 mt-1">{validation.name.message}</p>
            )}
          </div>

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
                placeholder="Enter your email..."
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={registerForm.email}
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
                value={registerForm.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#251404] mb-1">
              Password Confirmation
            </label>
            <div className={`flex items-center border ${!validation.confirmPassword.isValid ? 'border-red-500' : 'border-[#B8C28C]'} rounded-full px-4 py-3`}>
              <Lock className="w-5 h-5 text-[#251404] mr-2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password..."
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={registerForm.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="ml-2"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-[#A0A0A0]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#A0A0A0]" />
                )}
              </button>
            </div>
            {!validation.confirmPassword.isValid && (
              <p className="text-xs text-red-500 mt-1">{validation.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#251404] text-white font-semibold rounded-full w-full py-3 flex items-center justify-center gap-2 hover:bg-[#4F3422] transition-colors duration-300 mt-6 disabled:bg-gray-400"
          >
            {loading ? 'Signing Up...' : 'Sign Up'} 
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-sm text-[#251404] mt-4">
          Already have an account?{' '}
          <Link to="/signin" className="text-orange-500 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;
