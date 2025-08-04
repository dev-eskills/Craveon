import { Link } from "react-router-dom";

function SpecialOfferCard({ title, description, bottomText, className }) {

  const handleClick = () => {
    window.scrollTo({ top:20, behavior: 'smooth' });
  };
  return (
    <div
      className={`w-full text-white p-6 flex flex-col gap-y-2.5 flex-wrap rounded-lg max-w-[38rem] ${className}`}
    >
      <h3 className="text-xl leading-2">{title}</h3>
      <p className="text-sm font-normal mt-2">{description}</p>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{bottomText}</h1>
        <button
          onClick={handleClick}
          className="bg-white text-black px-4 py-1 cursor-pointer"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

export default SpecialOfferCard;
