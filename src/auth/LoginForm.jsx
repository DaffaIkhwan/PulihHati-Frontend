// // auth/LoginForm.jsx
// import cloud1 from '../assets/cloud1.png';
// import cloud2 from '../assets/cloud2.png';
// import hero from '../assets/hero.png';

const LoginForm = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      {/* Cloud and hero illustrations (absolute positioning) */}
      {/* <img src={cloud1} className="absolute top-6 left-6 w-20" />
      <img src={cloud2} className="absolute top-10 right-10 w-24" />
      <img src={cloud2} className="absolute bottom-20 left-10 w-24" />
      <img src={hero} className="absolute bottom-0 right-0 w-64 md:w-80" /> */}

      {/* Login Card */}
      <div className="relative bg-white rounded-2xl shadow-lg p-8 w-full max-w-md z-10">
        <h2 className="text-3xl font-bold text-center text-[#251404] mb-6">WELCOME</h2>
        {/* form contents */}
        <form className="space-y-4">
  {/* Email */}
  <div>
    <label htmlFor="email" className="block text-sm font-semibold text-[#251404] mb-1">
      Email Address
    </label>
    <div className="flex items-center border border-[#B8C28C] rounded-full px-4 py-2 bg-white">
      <span className="material-symbols-outlined text-[#251404] mr-2">mail</span>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="jerrychan2206@gmail.com"
        className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
      />
    </div>
  </div>

  {/* Password */}
  <div>
    <label htmlFor="password" className="block text-sm font-semibold text-[#251404] mb-1">
      Password
    </label>
    <div className="flex items-center border border-[#B8C28C] rounded-full px-4 py-2 bg-white">
      <span className="material-symbols-outlined text-[#251404] mr-2">lock</span>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Enter your password..."
        className="w-full outline-none bg-transparent text-sm text-[#251404] placeholder:text-[#A0A0A0]"
      />
      <span className="material-symbols-outlined text-[#A0A0A0] ml-2 cursor-pointer">
        visibility_off
      </span>
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="bg-[#251404] text-white font-semibold rounded-full w-full py-3 flex items-center justify-center gap-2 hover:bg-[#4F3422] transition-colors duration-300"
  >
    Sign In <span className="material-symbols-outlined">arrow_forward</span>
  </button>
</form>

      </div>
    </div>
  );
};

export default LoginForm;
