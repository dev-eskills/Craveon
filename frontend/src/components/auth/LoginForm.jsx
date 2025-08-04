import Logo from '../ui/Logo';
import Input from '../ui/Input';
import SubmitButton from '../ui/SubmitButton';
import useFormData from '../../hooks/useFormData';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = ({ changeForm }) => {
  const { loginFn, isLoadingLogin } = useAuth();

  const { formData, handleChange } = useFormData({
    number: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginFn(formData);
  };

  return (
    <>
      <div className="w-full md:w-1/2 px-8 md:px-12 pb-5">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center items-center mb-8">
            <Logo className={'mt-5'} />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Sign in to your account</h2>

            <Input
              name={'number'}
              placeholder={'Enter Your Phone'}
              label="Phone"
              type={'tel'}
              value={formData.number}
              onChange={handleChange}
              autoComplete={'tel'}
            />

            <Input
              name={'password'}
              placeholder={'Enter Your Password'}
              label="Password"
              type={'password'}
              value={formData.password}
              onChange={handleChange}
              autoComplete={'current-password'}
            />

            <div className="text-xs text-gray-500 -translate-y-5">
              *Password should be a minimum of 8 characters and include an uppercase letter
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            </div>

            <SubmitButton
              title={'Sign in'}
              type={'submit'}
              handleClick={handleSubmit} // Optional - form's onSubmit will handle it
              data={formData}
              isPending={isLoadingLogin}
            />

            <p className="text-center text-sm text-gray-600 ">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-black hover:text-black/70 cursor-pointer"
                onClick={changeForm}
              >
                Sign up now
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
