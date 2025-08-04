const LoginLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl bg-white  rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image Section */}
        <div className="relative w-full md:w-1/2 bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40" />
          <img
            src="https://www.indiafoodnetwork.in/h-upload/2024/09/11/1355121-qey-1.webp"
            alt="Food plating"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-white z-10 text-center">
            <h1 className="text-3xl font-bold mb-2 text-nowrap ">Welcome to Craveon</h1>
            <p className="text-lg">Delivering Excellence With Style</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
