import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ type, placeholder, value, onChange, className, name, label, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ff6900] focus:outline-none  pr-12  ${className}`}
          value={value}
          onChange={onChange}
          name={name}
          required
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
