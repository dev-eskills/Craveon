import authApi from '../api/authAPI';
import { useAuthStore } from '../stores/authStore';
import { useMutation } from '@tanstack/react-query';
import { handleError } from '../utils/errorHandler';

export const useAuth = () => {
  const { setAuth, logout, setOtpToken, setIsPhoneVerified, setRegistrationData } = useAuthStore();

  const sendOTPMutation = useMutation({
    mutationFn: authApi.sendOTP,
    onError: handleError,
  });

   const verifyOTPMutation = useMutation({
     mutationFn: authApi.verifyOTP,
     onSuccess: (data) => {
       setOtpToken(data.otpToken);
       setIsPhoneVerified(true);
     },
     onError: handleError,
   });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.accessToken);
      setRegistrationData(data);
    },
    onError: handleError,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.accessToken);
    },
    onError: handleError,
  });

  return {
    sendOTPFn: sendOTPMutation.mutate,
    verifyOTPFn: verifyOTPMutation.mutate,
    registerFn: registerMutation.mutate,
    loginFn: loginMutation.mutate,
    isLoadingSendOTP: sendOTPMutation.isPending,
    isLoadingVerifyOTP: verifyOTPMutation.isPending,
    isLoadingRegister: registerMutation.isPending,
    isLoadingLogin: loginMutation.isPending,
    logoutFn: logout,
  };
};
