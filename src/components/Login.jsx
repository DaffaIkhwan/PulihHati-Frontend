// components/Login.jsx
import LoginForm from '../auth/LoginForm';
import Navbar from './Navbar';

function Login() {
  return (
    <div className="min-h-screen bg-[#A1BA82] relative overflow-hidden pt-20">
      <Navbar />
      <LoginForm />
    </div>
  );
}

export default Login;
