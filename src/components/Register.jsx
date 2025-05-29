// components/Register.jsx
import RegisterForm from '../auth/RegisterForm';
import Navbar from './Navbar';

function Register() {
  return (
    <div className="min-h-screen bg-[#C35C00] relative overflow-hidden pt-20">
      <Navbar />
      <RegisterForm />
    </div>
  );
}

export default Register;

