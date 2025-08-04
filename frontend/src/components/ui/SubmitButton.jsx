import Spinner from './Spinner';

const SubmitButton = ({
  title,
  className,
  type = 'submit', // Default to submit
  handleClick,
  isPending,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`flex justify-center gap-2 w-full ${isPending ? 'bg-black/70' : 'bg-black hover:bg-gray-800'}  text-white py-3 rounded-lg  transition-colors btn ${className}`}
      onClick={handleClick}
      disabled={isPending}
      {...rest}
    >
      {isPending && <Spinner className="size-5" />} {title}
    </button>
  );
};

export default SubmitButton;
