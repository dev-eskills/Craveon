import { useState } from 'react';

function useFormData(initialState) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const reset = () => {
    setFormData(initialState);
  };

  return { formData, handleChange, reset, setFormData };
}

export default useFormData;
