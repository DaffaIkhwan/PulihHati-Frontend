import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hero from '/hero-login.png';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setApiError('');

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Save token and user data to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to home page and refresh to update navbar
        navigate('/');
        window.location.reload();
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <img src={hero} className="absolute bottom-0 right-0 w-80 md:w-[28rem] lg:w-[32rem]" />

      <div className="relative bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl z-10">
        <h2 className="text-3xl font-bold text-center text-[#251404] mb-6">WELCOME</h2>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {apiError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#251404] mb-1">
              Email Address
            </label>
            <div className={`flex items-center border ${errors.email ? 'border-red-500' : 'border-[#B8C28C]'} rounded-full px-4 py-3`}>
              <Mail className="w-5 h-5 text-[#251404] mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#251404] mb-1">
              Password
            </label>
            <div className={`flex items-center border ${errors.password ? 'border-red-500' : 'border-[#B8C28C]'} rounded-full px-4 py-3`}>
            <Lock className="w-5 h-5 text-[#251404] mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password..."
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#A0A0A0]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#A0A0A0]" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#251404] text-white font-semibold rounded-full w-full py-3 flex items-center justify-center gap-2 hover:bg-[#4F3422] transition-colors duration-300 disabled:bg-gray-400"
          >
            {isLoading ? 'Signing In...' : 'Sign In'} {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
