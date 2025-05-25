import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import hero from '/hero-register.png'; // Update with your actual image path

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errs.email = 'Invalid Email Address!';
    }
    if (!formData.password.trim()) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log('Registration successful', formData);
      // Handle actual registration logic here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      {/* Hero Illustration */}
      <img src={hero} className="absolute bottom-0 left-0 w-80 md:w-[28rem] lg:w-[32rem]" alt="hero" />

      <div className="relative bg-white rounded-2xl shadow-lg p-10 w-full max-w-xl z-10">
        <h2 className="text-3xl font-bold text-center text-[#251404] mb-6">Sign Up For Free</h2>

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
                placeholder="Enter your email..."
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#251404] mb-1">
              Password Confirmation
            </label>
            <div className={`flex items-center border ${errors.confirmPassword ? 'border-red-500' : 'border-[#B8C28C]'} rounded-full px-4 py-3`}>
              <Lock className="w-5 h-5 text-[#251404] mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password..."
                className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#A0A0A0]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#A0A0A0]" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#251404] text-white font-semibold rounded-full w-full py-3 flex items-center justify-center gap-2 hover:bg-[#4F3422] transition-colors duration-300 mt-6"
          >
            Sign Up <ArrowRight className="w-4 h-4" />
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
<<<<<<< HEAD
}
=======
}
>>>>>>> bd990fcd7a121ef0ec897a6fa68ef858540f3369
