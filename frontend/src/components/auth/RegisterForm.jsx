import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../ui/Logo';
import VerifyOTP from './VerifyOtp';
import useFormData from '../../hooks/useFormData';
import Input from '../ui/Input';
import { useAuthStore } from '../../stores/authStore';

const RegisterForm = ({ changeForm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const { isPhoneVerified, otpToken } = useAuthStore();
  const {
    sendOTPFn,
    verifyOTPFn,
    registerFn,
    isLoadingSendOTP,
    isLoadingVerifyOTP,
    isLoadingRegister,
  } = useAuth();

  const { formData, handleChange } = useFormData({
    name: '',
    email: '',
    password: '',
    number: '',
  });

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    sendOTPFn(formData.number, {
      onSuccess: () => {
        setIsModalOpen(true);
        setOtpTimer(30);
      },
    });
  };

  const handleVerifyOTP = async (otp) => {
    verifyOTPFn({ phone: formData.number, otp }, { onSuccess: () => setIsModalOpen(false) });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    registerFn({ ...formData, otpToken });
  };

  return (
    <>
      <div className="w-full md:w-1/2 px-8 md:px-12 pb-5">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center items-center mb-8">
            <Logo className={'mt-5'} />
          </div>

          <form className="space-y-6" onSubmit={isPhoneVerified ? handleRegister : handleSendOTP}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Create your account</h2>

            <Input
              name={'number'}
              placeholder={'Enter Your Phone'}
              label="Phone"
              type={'tel'}
              value={formData.number}
              onChange={handleChange}
              pattern="\d{10}"
              maxLength={10}
              disabled={isPhoneVerified}
            />

            {isPhoneVerified && (
              <div className="space-y-6">
                <Input
                  name={'name'}
                  placeholder={'Enter your name'}
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name={'email'}
                  placeholder={'Enter Your email'}
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  name={'password'}
                  placeholder={'Enter Your password'}
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-black hover:text-black/70">
                      terms and conditions
                    </a>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors btn`}
              disabled={(!isPhoneVerified && otpTimer > 0) || isLoadingSendOTP || isLoadingRegister}
            >
              {isPhoneVerified
                ? isLoadingRegister
                  ? 'Signing Up...'
                  : 'Sign Up'
                : `${isLoadingSendOTP ? 'Sending...' : `Send OTP ${otpTimer > 0 ? `(${otpTimer}s)` : ''}`}`}
            </button>
          </form>

          {!isPhoneVerified && (
            <p className="text-center text-sm text-gray-600 mt-3">
              Already have an account?{' '}
              <button className="text-black hover:text-black/70" onClick={changeForm}>
                Sign in now
              </button>
            </p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-opacity-50 z-50">
          <VerifyOTP
            setIsModalOpen={setIsModalOpen}
            onVerify={handleVerifyOTP}
            isLoading={isLoadingVerifyOTP}
          />
        </div>
      )}
    </>
  );
};

export default RegisterForm;
