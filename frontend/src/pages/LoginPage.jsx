import { useState } from 'react';
import LoginLayout from '../layouts/LoginLayout';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const user = useAuthStore((state) => state.user);

  if (user) return <Navigate to={`/${user?.role}`} />;

  const changeForm = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <LoginLayout>
      {showLogin ? <LoginForm changeForm={changeForm} /> : <RegisterForm changeForm={changeForm} />}
    </LoginLayout>
  );
};

export default LoginPage;
