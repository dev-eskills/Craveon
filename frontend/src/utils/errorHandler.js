import toast from 'react-hot-toast';

export const handleError = (error) => {
  const errorMessage =
    error.response?.data?.message ??
    error.response?.message ??
    error.message ??
    'Something went wrong';
  console.error('API Error:', errorMessage);
  toast.error(errorMessage);
  throw new Error(errorMessage);
};
