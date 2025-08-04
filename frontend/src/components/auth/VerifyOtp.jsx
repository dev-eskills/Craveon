import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import Logo from '../ui/Logo';

const VerifyOtp = ({ setIsModalOpen, onVerify, isLoading }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleInput = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (index === 3 && value) {
      const otp = [...newCode.slice( 0, 3), value].join('');
      onVerify(otp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.slice(0, 4).split('');

    if (pasteArray.length) {
      const newCode = [...pasteArray, ...Array(4 - pasteArray.length).fill('')];
      setVerificationCode(newCode);

      if (pasteArray.length === 4) {
        onVerify(paste.slice(0, 4));
      } else {
        inputRefs.current[Math.min(pasteArray.length, 3)].focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-6 sm:p-8 bg-white/90 relative">
        <div className="rounded-2xl mb-6 mx-auto flex items-center justify-center">
          <Logo />
        </div>

        <button
          className="absolute top-5 right-7 text-gray-600 hover:text-gray-900"
          onClick={() => setIsModalOpen(false)}
        >
          <X className="cursor-pointer" />
        </button>

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-2">
          Verify your OTP
        </h1>

        <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 text-gray-500 text-sm sm:text-base mb-8 text-center">
          <span>Enter the verification code sent to your</span>
          <div className="flex items-center gap-1">
            <span>Registered Number</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-4 px-4">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className={`w-full h-12 sm:h-14 text-center text-xl sm:text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] transition-all
                ${index === 0 ? 'border-gray-600' : 'border-gray-400'}`}
            />
          ))}
        </div>

        <button
          className="w-full bg-[#ff6900] text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#e65e00] transition-colors disabled:opacity-50 disabled:hover:bg-[#ff6900]"
          onClick={() => onVerify(verificationCode.join(''))}
          disabled={verificationCode.some((digit) => !digit) || isLoading}
        >
          <span className="text-base sm:text-lg">{isLoading ? 'Verifying...' : 'Verify OTP'}</span>
          <span className="inline-block transform rotate-45">↗</span>
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
